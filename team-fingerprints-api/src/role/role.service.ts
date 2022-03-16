import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/models/user.model';
import { RoleI } from './interfaces/role.interface';
import { Role } from './models/role.model';
import { RoleType } from './role.type';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {}

  async changeUserRole(userId: string, role: RoleType) {
    if (role.toString() in RoleType) {
      return await this.userModel.findOneAndUpdate(
        { _id: userId },
        { role },
        { new: true },
      );
    }
    throw new BadRequestException();
  }

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

  async findOneRoleDocument(
    searchParams: Partial<RoleI | null>,
  ): Promise<Role> {
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
    return await this.roleModel
      .findByIdAndDelete(roleDocument._id, {
        new: true,
      })
      .exec();
  }

  async leave(userId: string, roleId: string) {
    const roleDocument = await this.findOneRoleDocument({
      _id: roleId,
      userId,
    });

    if (!roleDocument) throw new NotFoundException();

    return await this.removeRoleDocumentById(roleDocument);
  }

  async removeRole(roleId: string) {
    const roleDocument = await this.findOneRoleDocument({ _id: roleId });
    if (!roleDocument) throw new NotFoundException();

    return await this.removeRoleDocumentById(roleDocument);
  }
}
