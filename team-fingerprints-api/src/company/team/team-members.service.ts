import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Role } from 'src/role/models/role.model';
import { MailService } from 'src/mail/mail.service';
import { RoleService } from 'src/role/role.service';
import { RoleType } from 'src/role/role.type';
import { UsersService } from 'src/users/users.service';
import { CompanyService } from '../company.service';
import { TeamService } from './team.service';
import { isEmail } from 'class-validator';

@Injectable()
export class TeamMembersService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly roleService: RoleService,
    private readonly companyService: CompanyService,
    private readonly teamService: TeamService,
  ) {}

  async isLeaderInTeam(teamId: string): Promise<string | boolean> {
    const roleDocuments = await this.roleService.findRoleDocument({
      role: RoleType.TEAM_LEADER,
      teamId,
    });

    return roleDocuments?.userId ? roleDocuments?.userId : false;
  }

  async isUserInTargetTeam(
    email: string,
    companyId: string,
    teamId: string,
  ): Promise<Role | null> {
    const roleDocument = await this.roleService.findRoleDocument({
      email,
      teamId,
      companyId,
    });

    return roleDocument ? roleDocument : null;
  }

  async getTeamMembers(teamId: string): Promise<Role[] | []> {
    const roleDocuments = await this.roleService.findAllRoleDocuments({
      teamId,
    });
    if (!roleDocuments || roleDocuments.length <= 0) return [];
    return roleDocuments;
  }

  async isSuperAdminByEmail(email: string) {
    const roleDocument = await this.roleService.findRoleDocument({
      email,
      role: RoleType.SUPER_ADMIN,
    });
    if (!roleDocument) return false;
    else roleDocument;
  }

  async addUsersToTeamWhitelist(
    companyId: string,
    teamId: string,
    emails: string[],
  ) {
    if (!emails.every((el) => isEmail(el))) {
      throw new BadRequestException('Invalid email');
    }

    return await Promise.all(
      emails.map(async (email) => {
        const roleDocument = await this.roleService.findRoleDocument({
          email,
          companyId,
          teamId,
        });

        if (roleDocument) return email;

        const newRoleDocument = await this.roleService.createRoleDocument(
          { email },
          {
            email,
            companyId,
            teamId,
            role: RoleType.USER,
          },
        );

        if (!newRoleDocument) throw new InternalServerErrorException();

        const company = await this.companyService.getCompanyById(companyId);
        const team = await this.teamService.getTeam(companyId, teamId);

        this.mailService.inviteToTeamMail(email, company.name, team.name);
        return email;
      }),
    );
  }

  async addMemberToTeamByEmail(
    email: string,
    companyId: string,
    teamId: string,
  ): Promise<Role | null> {
    const user = await this.usersService.getUserByEmail(email);

    return await this.roleService.updateRoleDocument(
      { email, companyId, teamId },
      { userId: user._id },
    );
  }

  async removeMemberFromTeam(
    companyId: string,
    teamId: string,
    memberEmail: string,
  ) {
    const roleDocuments = await this.roleService.findAllRoleDocuments({
      email: memberEmail,
      companyId,
      teamId,
    });

    if (!roleDocuments || roleDocuments.length <= 0)
      throw new NotFoundException();

    roleDocuments.forEach(async (doc) => {
      await this.roleService.removeRoleDocumentById(doc);
    });

    return { success: true };
  }

  async checkEmailIfAssignedToBeLeader(
    email: string,
    companyId: string,
    teamId: string,
  ): Promise<Role | boolean> {
    const roleDocument = await this.roleService.findRoleDocument({
      email,
      companyId,
      teamId,
    });

    if (!roleDocument) throw new NotFoundException();

    if (roleDocument.role === RoleType.TEAM_LEADER) return roleDocument;
    else false;
  }

  async assignTeamLeader(
    companyId: string,
    teamId: string,
    leaderEmail: string,
  ): Promise<Role> {
    const isUserInTargetTeam = await this.isUserInTargetTeam(
      leaderEmail,
      companyId,
      teamId,
    );

    const isTeamLeader = await this.isTeamLeaderByEmail(leaderEmail, teamId);
    if (!isUserInTargetTeam || isTeamLeader) return;

    const currentTeamLeader = await this.roleService.findRoleDocument({
      companyId,
      teamId,
      role: RoleType.TEAM_LEADER,
    });

    if (currentTeamLeader) {
      await this.roleService.removeRoleDocumentById(currentTeamLeader);
    }

    const newTeamLeader = await this.roleService.createRoleDocument(
      { email: leaderEmail },
      { companyId, teamId, role: RoleType.TEAM_LEADER },
    );

    if (!newTeamLeader) throw new InternalServerErrorException();

    const company = await this.companyService.getCompanyById(companyId);
    const team = await this.teamService.getTeam(companyId, teamId);

    this.mailService.newTeamLeaderMail(leaderEmail, company.name, team.name);

    return newTeamLeader;
  }

  async removeTeamLeader(
    email: string,
    teamId: string,
  ): Promise<Role | HttpException> {
    const roleDocument = await this.roleService.findRoleDocument({
      email,
      teamId,
      role: RoleType.TEAM_LEADER,
    });
    if (!roleDocument) throw new NotFoundException();
    return await this.roleService.removeRoleDocumentById(roleDocument);
  }

  async isTeamLeaderByEmail(
    email: string,
    teamId: string,
  ): Promise<Role | boolean> {
    const roleDocument = await this.roleService.findRoleDocument({
      email,
      teamId,
      role: RoleType.TEAM_LEADER,
    });

    if (roleDocument) return roleDocument;
    return false;
  }
}
