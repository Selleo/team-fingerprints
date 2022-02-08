import {
  ForbiddenException,
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailService } from 'src/mail/mail.service';
import { RoleService } from 'src/role/role.service';
import { Role } from 'src/role/role.type';
import { User } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';
import { CompanyMembersService } from '../company-members.service';
import { CompanyService } from '../company.service';
import { Company } from '../models/company.model';
import { Team } from '../models/team.model';
import { TeamService } from './team.service';

@Injectable()
export class TeamMembersService {
  constructor(
    @InjectModel(Company.name) private readonly teamModel: Model<Company>,
    private readonly usersService: UsersService,
    private readonly teamService: TeamService,
    private readonly mailService: MailService,
    private readonly roleService: RoleService,
    @Inject(forwardRef(() => CompanyMembersService))
    private readonly companyMembersService: CompanyMembersService,
    @Inject(forwardRef(() => CompanyService))
    private readonly companyService: CompanyService,
  ) {}

  async isLeaderInTeam(teamId: string): Promise<string | boolean> {
    const team = await this.teamService.getTeam(teamId);
    const { teamLeader } = team as Team;
    return teamLeader?._id ? teamLeader?._id : false;
  }

  async isUserInAnyTeamWhitelist(email: string): Promise<boolean> {
    const team = await this.teamService.getTeamByUserEmail(email);
    if (!team) return false;
    const { emailWhitelist } = team as Team;
    return emailWhitelist?.find((el) => el === email) ? true : false;
  }

  async getTeamMembers(teamId: string) {
    const team = await this.teamService.getTeam(teamId);
    if (!team) throw new NotFoundException();
    const { members } = team as Team;
    return members ? members : [];
  }

  async addUserToTeamWhitelist(
    companyId: string,
    teamId: string,
    email: string,
  ): Promise<Company | HttpException> {
    if (await this.isUserInAnyTeamWhitelist(email)) return;

    const updatedTeam = await this.teamModel
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

    await this.mailService.sendEmail();

    // const message = (email: string) => `
    //   <html>
    //     <body>
    //       <h3>Team invitation for ${email}</h3>
    //     </body>
    //   </html>
    // `;

    // await this.mailService.sendMail(
    //   email,
    //   `Team invitation for ${email}`,
    //   message(email),
    // );

    return updatedTeam;
  }

  async addMemberToTeamByEmail(
    email: string,
  ): Promise<Company | HttpException> {
    const team: any = await this.teamService.getTeamByUserEmail(email);
    if (!team) throw new NotFoundException();
    const teamId = team?._id?.toString();

    if (!(await this.isUserInAnyTeamWhitelist(email))) return;

    const newMember = await this.usersService.getUserByEmail(email);
    if (!newMember) throw new NotFoundException();

    const newMemberId = newMember?._id.toString();
    const { members } = team as Team;

    if (members.find((el) => el === newMemberId)) return;

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
    if (!teamWithNewMember) throw new InternalServerErrorException();
    return teamWithNewMember;
  }

  async removeMemberFromTeam(
    companyId: string,
    teamId: string,
    memberEmail: string,
  ): Promise<Company | HttpException> {
    const memberToRemove = await this.usersService.getUserByEmail(memberEmail);
    const memberToRemoveId = memberToRemove?._id.toString();
    const team = await this.teamService.getTeam(teamId);
    if (!team) throw new NotFoundException();
    const { members, emailWhitelist } = team as Team;

    const memberToRemoveInsideTeam = members.find(
      (el) => el === memberToRemoveId,
    );
    const emailToRemove = emailWhitelist.find((el) => el === memberEmail);

    if (!memberToRemoveInsideTeam && !emailToRemove)
      throw new NotFoundException();

    const leader = await this.isTeamLeaderByEmail(memberEmail);

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

    if (!teamWithoutRemovedMember) throw new InternalServerErrorException();
    if (leader) {
      await this.removeTeamLeader(leader.leaderId, leader.teamId, companyId);
    }
    return teamWithoutRemovedMember;
  }

  async checkEmailIfAssignedToBeLeader(email: string) {
    const team: Team = await this.teamService.getTeamByUserEmail(email);
    if (!team) return;

    if (await this.isTeamLeaderByEmail(email)) return;

    if (team?.teamLeader.email === email) {
      const { _id } = await this.companyService.getCompanyByUserEmail(email);
      await this.assignTeamLeader(_id, team._id, email);
    }
  }

  async assignTeamLeader(
    companyId: string,
    teamId: string,
    leaderEmail: string,
  ): Promise<Company | HttpException> {
    const leaderCandidate: User = await this.usersService.getUserByEmail(
      leaderEmail,
    );
    if (!leaderCandidate) {
      const teamWithLeaderEmail = await this.teamModel
        .findOneAndUpdate(
          { _id: companyId, 'teams._id': teamId },
          {
            $set: {
              'teams.$.teamLeader.email': leaderEmail,
              'teams.$.teamLeader._id': '',
            },
          },
          { new: true },
        )
        .exec();
      if (!teamWithLeaderEmail) throw new InternalServerErrorException();
      await this.addUserToTeamWhitelist(companyId, teamId, leaderEmail);
      await this.companyMembersService.addUserToCompanyWhitelist(
        companyId,
        leaderEmail,
      );
      return teamWithLeaderEmail;
    }

    if (leaderCandidate?.role !== Role.USER) {
      throw new ForbiddenException(
        `User ${leaderEmail} can not be a team leader.`,
      );
    }

    const leaderCandidateId = leaderCandidate?._id.toString();
    const team = await this.teamService.getTeam(teamId);

    if (!team) throw new NotFoundException();

    const currentLeader = await this.isLeaderInTeam(teamId);

    const teamWithLeader = await this.teamModel
      .findOneAndUpdate(
        { _id: companyId, 'teams._id': teamId },
        {
          $set: {
            'teams.$.teamLeader.email': leaderEmail,
            'teams.$.teamLeader._id': leaderCandidateId,
          },
        },
        { new: true },
      )
      .exec();

    if (!teamWithLeader) throw new InternalServerErrorException();
    const { members } = team as Team;

    if (!members) {
      await this.addUserToTeamWhitelist(companyId, teamId, leaderEmail);
    } else if (!members.includes(leaderCandidateId)) {
      await this.addUserToTeamWhitelist(companyId, teamId, leaderEmail);
    }

    await this.companyMembersService.addUserToCompanyWhitelist(
      companyId,
      leaderEmail,
    );

    await this.roleService.changeUserRole(leaderCandidateId, Role.TEAM_LEADER);
    if (
      currentLeader &&
      currentLeader.toString() !== leaderCandidate._id.toString()
    ) {
      await this.roleService.changeUserRole(
        currentLeader.toString(),
        Role.USER,
      );
    }

    await this.mailService.sendEmail();

    // const message = (email: string) => `
    //   <html>
    //     <body>
    //       <h3>You are a team leader now ${email}</h3>
    //     </body>
    //   </html>
    // `;

    // await this.mailService.sendMail(
    //   leaderEmail,
    //   `Team invitation for ${leaderEmail}`,
    //   message(leaderEmail),
    // );

    return teamWithLeader;
  }

  async removeTeamLeaderByEmail(
    email: string,
    teamId: string,
    companyId: string,
  ) {
    const leader = await this.isTeamLeaderByEmail(email);
    if (!leader) throw new ForbiddenException();
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
    if (!team) throw new InternalServerErrorException();
    await this.roleService.changeUserRole(leaderId, Role.USER);
    return team;
  }

  async isTeamLeaderByEmail(email: string) {
    const user = await this.usersService.getUserByEmail(email);
    const { teamLeader, _id }: Team = await this.teamService.getTeamByUserEmail(
      email,
    );

    if (
      user &&
      teamLeader._id === user._id.toString() &&
      user.role === Role.TEAM_LEADER
    ) {
      return { leaderId: user._id, teamId: _id };
    }
    return false;
  }
}
