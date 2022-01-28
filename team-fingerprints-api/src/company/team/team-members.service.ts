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
import { RoleService } from 'src/role/role.service';
import { Role } from 'src/role/role.type';
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
    private readonly roleService: RoleService,
  ) {}

  async isLeaderInTeam(teamId: string): Promise<string | boolean> {
    const team = await this.teamService.getTeam(teamId);
    const { teamLeader } = team as Team;
    return teamLeader ? teamLeader : false;
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
      return new ForbiddenException(`This email already exists in some team`);
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

    const leader = await this.isTeamLeaderByEmail(memberEmail);
    if (leader) {
      console.log(leader);
      await this.removeTeamLeader(leader.leaderId, leader.teamId, companyId);
    }

    const teamWithoutRemovedMember = await this.teamModel
      .findOneAndUpdate(
        { _id: companyId, 'teams._id': teamId },
        {
          $pull: {
            'teams.$.members': memberToRemoveId,
            'teams.$.emailWhitelist': memberEmail,
          },
        },
        { new: true },
      )
      .exec();

    if (!teamWithoutRemovedMember) return new InternalServerErrorException();
    return teamWithoutRemovedMember;
  }

  async assignTeamLeader(
    companyId: string,
    teamId: string,
    leaderEmail: string,
  ): Promise<Company | HttpException> {
    const leaderCandidate = await this.usersService.getUserByEmail(leaderEmail);
    if (leaderCandidate.role !== Role.USER)
      return new ForbiddenException(
        `User ${leaderEmail} can not be a team leader.`,
      );
    if (!leaderCandidate) return new NotFoundException();

    const leaderCandidateId = leaderCandidate?._id.toString();
    const team = await this.teamService.getTeam(teamId);
    if (!team) return new NotFoundException();

    const currentLeader = await this.isLeaderInTeam(teamId);

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
    if (!members) {
      await this.addUserToTeamWhitelist(companyId, teamId, leaderEmail);
    } else if (!members.includes(leaderCandidateId)) {
      await this.addUserToTeamWhitelist(companyId, teamId, leaderEmail);
    }
    await this.roleService.changeUserRole(leaderCandidateId, Role.TEAM_LEADER);
    if (currentLeader) {
      await this.roleService.changeUserRole(
        currentLeader.toString(),
        Role.USER,
      );
    }

    const message = (email: string) => `
    <html>
      <body>
        <h3>You are a team leader now ${email}</h3>
      </body>
    </html>
  `;

    await this.mailService.sendMail(
      leaderEmail,
      `Team invitation for ${leaderEmail}`,
      message(leaderEmail),
    );

    return teamWithLeader;
  }

  async removeTeamLeaderByEmail(
    email: string,
    teamId: string,
    companyId: string,
  ) {
    const leader = await this.isTeamLeaderByEmail(email);
    if (!leader) return new ForbiddenException();
    return await this.removeTeamLeader(leader.leaderId, teamId, companyId);
  }

  async removeTeamLeader(leaderId: string, teamId: string, companyId: string) {
    await this.roleService.changeUserRole(leaderId, Role.USER);
    const team = await this.teamModel
      .findOneAndUpdate(
        { _id: companyId, 'teams._id': teamId },
        {
          $unset: {
            'teams.$.teamLeader': leaderId,
          },
        },
        { new: true },
      )
      .exec();
    if (!team) return new InternalServerErrorException();
    await this.roleService.changeUserRole(leaderId, Role.USER);
    return team;
  }

  async isTeamLeaderByEmail(email: string) {
    const user = await this.usersService.getUserByEmail(email);
    const { teamLeader, _id }: Team = await this.teamService.getTeamByUserEmail(
      email,
    );

    if (teamLeader === user._id.toString() && user.role === Role.TEAM_LEADER) {
      return { leaderId: user._id, teamId: _id };
    }
    return false;
  }
}
