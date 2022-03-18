import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDetails } from './models/user-details.model';

@Injectable()
export class UserDetailsService {
  constructor(
    @InjectModel(UserDetails.name)
    private readonly userDetailsModel: Model<UserDetails>,
  ) {}

  async generateFilterPath(name: string) {
    const filterPathCombined = name
      .split(' ')
      .map((el) => el.charAt(0).toUpperCase() + el.slice(1).toLowerCase())
      .join('');

    return (
      filterPathCombined.charAt(0).toLowerCase() + filterPathCombined.slice(1)
    );
  }

  async userDetailExists(detailId: string) {
    const userDetail = await this.userDetailsModel.findById(detailId).exec();
    return userDetail ? userDetail : false;
  }

  async getUserDetailsList() {
    return await this.userDetailsModel.find();
  }

  async getUserDetail(detailId: string) {
    return await this.userDetailsModel.findById(detailId);
  }

  async createUserDetial(name: string, savedInUser: boolean) {
    const filterPath = await this.generateFilterPath(name);
    const userDetail = await this.userDetailsModel.create({
      name,
      filterPath,
      savedInUser,
    });
    return await userDetail.save();
  }

  async updateUserDetial(
    detailId: string,
    name: string,
    savedInUser: boolean | null = null,
  ) {
    if (!(await this.userDetailExists(detailId))) throw new NotFoundException();

    let updateOptions = {};

    if (name && name.length > 0) {
      const filterPath = await this.generateFilterPath(name);
      updateOptions = {
        name,
        filterPath,
      };
    }

    if (savedInUser !== null) {
      updateOptions = { ...updateOptions, savedInUser };
    }

    return await this.userDetailsModel
      .findByIdAndUpdate(detailId, { $set: updateOptions }, { new: true })
      .exec();
  }

  async removeUserDetial(detailId: string) {
    if (!(await this.userDetailExists(detailId))) throw new NotFoundException();

    return await this.userDetailsModel.findByIdAndRemove(detailId);
  }

  async getUserDetailWithValues(detailId: string) {
    return await this.userDetailsModel.findById(detailId);
  }

  async addUserDetailValue(detailId: string, value: string) {
    const userDetails = await this.userDetailExists(detailId);
    if (!userDetails) throw new NotFoundException();

    if (userDetails.savedInUser)
      throw new BadRequestException(
        `Can not add value. Value for "${userDetails.name}" comes from user document`,
      );

    return await this.userDetailsModel
      .findByIdAndUpdate(
        detailId,
        {
          $push: {
            values: { value },
          },
        },
        { new: true },
      )
      .exec();
  }

  async updateUserDetailValue(
    detailId: string,
    valueId: string,
    value: string,
  ) {
    const userDetails = await this.userDetailExists(detailId);
    if (!userDetails) throw new NotFoundException();

    if (userDetails.savedInUser)
      throw new BadRequestException(
        `Can not add value. Value for "${userDetails.name}" comes from user document`,
      );

    return await this.userDetailsModel
      .findOneAndUpdate(
        { _id: detailId, 'values._id': valueId },
        {
          $set: {
            'values.$.value': value,
          },
        },
        {
          new: true,
        },
      )
      .exec();
  }

  async removeUserDetailValue(detailId: string, valueId: string) {
    if (!(await this.userDetailExists(detailId))) throw new NotFoundException();

    return await this.userDetailsModel
      .findOneAndUpdate(
        { _id: detailId, 'values._id': valueId },
        {
          $pull: {
            values: { _id: valueId },
          },
        },
        {
          new: true,
        },
      )
      .exec();
  }
}
