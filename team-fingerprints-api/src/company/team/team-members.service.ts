import {
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailService } from 'src/mail/mail.service';
import { UsersService } from 'src/users/users.service';
import { Company } from '../entities/Company.entity';
import { Team } from '../entities/team.entity';
import { TeamService } from './team.service';

@Injectable()
export class TeamMembersService {
  constructor(
    @InjectModel(Company.name) private readonly teamModel: Model<Company>,
    private readonly usersService: UsersService,
    private readonly teamService: TeamService,
    private readonly mailService: MailService,
  ) {}

  async assignTeamLeader(
    companyId: string,
    teamId: string,
    leaderEmail: string,
  ): Promise<Company | HttpException> {
    const leaderCandidate = await this.usersService.getUserByEmail(leaderEmail);
    if (!leaderCandidate) return new NotFoundException();

    const leaderCandidateId = leaderCandidate?._id.toString();
    const team = await this.teamService.getTeam(teamId);
    if (!team) return new NotFoundException();

    const teamWithLeader = await this.teamModel
      .findOneAndUpdate(
        { _id: companyId, 'teams._id': teamId },
        {
          $set: {
            'teams.$.teamLeader': leaderCandidateId,
          },
        },
        { new: true },
      )
      .exec();
    if (!teamWithLeader) return new InternalServerErrorException();
    const { members } = team as Team;
    if (!members.includes(leaderCandidateId)) {
      await this.addUserToTeamWhitelist(companyId, teamId, leaderEmail);
      await this.addMemberToTeamByEmail(leaderEmail);
    }

    return teamWithLeader;
  }

  async isUserInAnyTeamWhitelist(email: string): Promise<boolean> {
    const team = await this.teamService.getTeamByUserEmail(email);

    if (!team) return false;
    const { emailWhitelist } = team as Team;

    return emailWhitelist?.find((el) => el === email) ? true : false;
  }

  async addUserToTeamWhitelist(
    companyId: string,
    teamId: string,
    email: string,
  ): Promise<Company | HttpException> {
    if (await this.isUserInAnyTeamWhitelist(email)) {
      return new ForbiddenException(
        `This email already exists in whitelist for chosen team`,
      );
    }

    const message = (email: string) => `
      <html>
        <body>
          <h3>Team invitation for ${email}</h3>
        </body>
      </html>
    `;

    await this.mailService.sendMail(
      email,
      `Team invitation for ${email}`,
      message(email),
    );

    return await this.teamModel
      .findOneAndUpdate(
        { _id: companyId, 'teams._id': teamId },
        {
          $push: {
            'teams.$.emailWhitelist': email,
          },
        },
        { new: true },
      )
      .exec();
  }

  async addMemberToTeamByEmail(
    email: string,
  ): Promise<Company | HttpException> {
    const team: any = await this.teamService.getTeamByUserEmail(email);
    if (!team) return new NotFoundException();
    const teamId = team?._id?.toString();

    if (!(await this.isUserInAnyTeamWhitelist(email))) {
      return new NotFoundException();
    }

    const newMember = await this.usersService.getUserByEmail(email);
    if (!newMember) return new NotFoundException();

    const newMemberId = newMember?._id.toString();
    if (!team) return new NotFoundException();

    const { members } = team as Team;

    if (members.find((el) => el === newMemberId))
      return new ForbiddenException();

    const teamWithNewMember = await this.teamModel
      .findOneAndUpdate(
        { 'teams._id': teamId },
        {
          $push: {
            'teams.$.members': newMemberId,
          },
        },
        { new: true },
      )
      .exec();
    if (!teamWithNewMember) return new InternalServerErrorException();
    return teamWithNewMember;
  }

  async removeMemberFromTeam(
    companyId: string,
    teamId: string,
    memberEmail: string,
  ): Promise<Company | HttpException> {
    const memberToRemove = await this.usersService.getUserByEmail(memberEmail);
    if (!memberToRemove) return new NotFoundException();

    const memberToRemoveId = memberToRemove?._id.toString();
    const team = await this.teamService.getTeam(teamId);
    if (!team) return new NotFoundException();
    const { members } = team as Team;

    if (!members.find((el) => el === memberToRemoveId))
      return new NotFoundException();

    const teamWithoutRemovedMember = await this.teamModel
      .findOneAndUpdate(
        { _id: companyId, 'teams._id': teamId },
        {
          $pull: {
            'teams.$.members': memberToRemoveId,
          },
        },
        { new: true },
      )
      .exec();
    if (!teamWithoutRemovedMember) return new InternalServerErrorException();
    return teamWithoutRemovedMember;
  }
}
