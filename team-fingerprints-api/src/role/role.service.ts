import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEmail } from 'class-validator';
import { Model } from 'mongoose';
import { CompanyService } from 'src/company/company.service';
import { User } from 'src/users/models/user.model';
import { RoleI } from './interfaces/role.interface';
import { Role } from './models/role.model';
import { RoleType } from 'team-fingerprints-common';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
    @Inject(forwardRef(() => CompanyService))
    private readonly companyService: CompanyService,
  ) {}

  async createRoleDocument(
    user: Partial<User>,
    roleDocumentData: Partial<Role> = {},
  ): Promise<Role> {
    const roleDocument = await this.roleModel.create({
      email: user.email,
      role: RoleType.USER,
      ...roleDocumentData,
    });
    if (!roleDocument) throw new InternalServerErrorException();
    await roleDocument.save();
    return roleDocument;
  }

  async findRoleDocument(searchParams: Partial<RoleI | null>): Promise<Role> {
    const roleDocument = await this.roleModel.findOne(searchParams).exec();
    if (!roleDocument) return null;
    return roleDocument;
  }

  async findAllRoleDocuments(searchParams: Partial<RoleI>): Promise<Role[]> {
    const roleDocuments = await this.roleModel.find(searchParams).exec();
    if (!roleDocuments || roleDocuments.length <= 0) return [];
    return roleDocuments;
  }

  async updateRoleDocument(
    searchParams: Partial<RoleI>,
    updateData: Partial<RoleI>,
  ): Promise<Role> {
    const updatedRoleDocument = await this.roleModel
      .findOneAndUpdate(searchParams, updateData, { new: true })
      .exec();
    if (!updatedRoleDocument)
      throw new InternalServerErrorException('Could not update role document');

    return updatedRoleDocument;
  }

  async removeRoleDocumentById(roleDocument: Role): Promise<Role> {
    const deletedRoleDocument = await this.roleModel
      .findByIdAndDelete(roleDocument._id.toString(), {
        new: true,
      })
      .exec();
    if (deletedRoleDocument) {
      await this.companyService.deleteCompanyWithoutMembers(
        roleDocument.companyId,
      );
    }
    return deletedRoleDocument;
  }

  async leave(userId: string, roleId: string) {
    const roleDocument = await this.findRoleDocument({
      _id: roleId,
      userId,
    });

    if (!roleDocument) throw new NotFoundException();

    return await this.removeRoleDocumentById(roleDocument);
  }

  async removeRole(roleId: string, currentUserId: string) {
    const roleDocumentToRemove = await this.findRoleDocument({
      _id: roleId,
    });

    if (!roleDocumentToRemove) throw new NotFoundException();

    const companyAdminRemovalRole = await this.findRoleDocument({
      companyId: roleDocumentToRemove.companyId,
      userId: currentUserId,
      role: RoleType.COMPANY_ADMIN,
    });

    if (companyAdminRemovalRole) {
      return await this.removeRoleDocumentById(roleDocumentToRemove);
    }

    const teamLeadRemovalRole = await this.findRoleDocument({
      teamId: roleDocumentToRemove.teamId,
      userId: currentUserId,
      role: RoleType.TEAM_LEADER,
    });

    if (teamLeadRemovalRole) {
      return await this.removeRoleDocumentById(roleDocumentToRemove);
    }

    const superAdminRemovalRole = await this.findRoleDocument({
      userId: currentUserId,
      role: RoleType.SUPER_ADMIN,
    });

    if (superAdminRemovalRole) {
      return await this.removeRoleDocumentById(roleDocumentToRemove);
    }

    throw new UnauthorizedException();
  }

  async addSuperAdminRole(email: string) {
    if (!isEmail(email)) throw new BadRequestException('Invalid email');

    const roleDocumenExists = await this.findRoleDocument({
      email,
      role: RoleType.SUPER_ADMIN,
    });

    if (roleDocumenExists)
      throw new BadRequestException('This user has already suer_admin role');

    const roleDocument = await this.roleModel.create({
      email,
      role: RoleType.SUPER_ADMIN,
    });
    if (!roleDocument) throw new InternalServerErrorException();
    await roleDocument.save();
    return roleDocument;
  }

  async addCompanyAdminRole(email: string, companyId: string) {
    const roleDocument = await this.roleModel.create({
      email,
      companyId,
      role: RoleType.COMPANY_ADMIN,
    });
    if (!roleDocument) throw new InternalServerErrorException();
    await roleDocument.save();
    return roleDocument;
  }
}
