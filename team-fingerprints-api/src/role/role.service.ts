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
import { UserModel } from 'src/users/models/user.model';
import { RoleModel } from './models/role.model';
import { Role, RoleType } from 'team-fingerprints-common';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(RoleModel.name) private readonly roleModel: Model<RoleModel>,
    @Inject(forwardRef(() => CompanyService))
    private readonly companyService: CompanyService,
  ) {}

  async createRoleDocument(
    user: Partial<UserModel>,
    roleDocumentData: Partial<RoleModel> = {},
  ): Promise<RoleModel> {
    const roleDocument = await this.roleModel.create({
      email: user.email,
      role: RoleType.USER,
      ...roleDocumentData,
    });
    if (!roleDocument) throw new InternalServerErrorException();
    await roleDocument.save();
    return roleDocument;
  }

  async findRoleDocument(
    searchParams: Partial<Role | null>,
  ): Promise<RoleModel> {
    const roleDocument = await this.roleModel.findOne(searchParams).exec();
    if (!roleDocument) return null;
    return roleDocument;
  }

  async findAllRoleDocuments(searchParams: Partial<Role>): Promise<Role[]> {
    const roleDocuments = await this.roleModel.find(searchParams).exec();
    if (!roleDocuments || roleDocuments.length <= 0) return [];
    return roleDocuments;
  }

  async updateRoleDocument(
    searchParams: Partial<Role>,
    updateData: Partial<Role>,
  ): Promise<RoleModel> {
    const updatedRoleDocument = await this.roleModel
      .findOneAndUpdate(searchParams, updateData, { new: true })
      .exec();
    if (!updatedRoleDocument)
      throw new InternalServerErrorException('Could not update role document');

    return updatedRoleDocument;
  }

  async removeRoleDocumentById(roleDocument: Role): Promise<RoleModel> {
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

  async leave(userId: string, roleId: string): Promise<RoleModel> {
    const roleDocument = await this.findRoleDocument({
      _id: roleId,
      userId,
    });

    if (!roleDocument) throw new NotFoundException();

    return await this.removeRoleDocumentById(roleDocument);
  }

  async removeRole(roleId: string, currentUserId: string): Promise<RoleModel> {
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

  async addSuperAdminRole(email: string): Promise<RoleModel> {
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
    if (!roleDocument)
      throw new InternalServerErrorException('Something went wrong');
    await roleDocument.save();
    return roleDocument;
  }

  async addCompanyAdminRole(
    email: string,
    companyId: string,
  ): Promise<RoleModel> {
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
