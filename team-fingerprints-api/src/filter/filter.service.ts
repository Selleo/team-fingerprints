import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDetailI } from 'team-fingerprints-common';
import { Filter } from './models/filter.model';

@Injectable()
export class FilterService {
  constructor(
    @InjectModel(Filter.name)
    private readonly filterModel: Model<Filter>,
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

  async filterExists(filterId: string) {
    const filter = await this.filterModel.findById(filterId).exec();
    if (!filter) throw new NotFoundException(`Filer does not exist`);
    else return filter;
  }

  async getFiltersList() {
    return await this.filterModel.find();
  }

  async getFilter(filterId: string) {
    return await this.filterModel.findById(filterId);
  }

  async createFilter(name: string) {
    const filterPath = await this.generateFilterPath(name);
    const newFilter = await this.filterModel.create({
      name,
      filterPath,
    });
    return await newFilter.save();
  }

  async updateFilter(filterId: string, name: string) {
    await this.filterExists(filterId);

    const filterPath = await this.generateFilterPath(name);

    return await this.filterModel
      .findByIdAndUpdate(
        filterId,
        {
          $set: {
            name,
            filterPath,
          },
        },
        { new: true },
      )
      .exec();
  }

  async removeFilter(filterId: string) {
    await this.filterExists(filterId);

    return await this.filterModel.findByIdAndRemove(filterId);
  }

  async getFilterWithValues(filterId: string) {
    await this.filterExists(filterId);

    return await this.filterModel.findById(filterId);
  }

  async addFilterValue(filterId: string, value: string) {
    await this.filterExists(filterId);

    return await this.filterModel
      .findByIdAndUpdate(
        filterId,
        {
          $push: {
            values: { value },
          },
        },
        { new: true },
      )
      .exec();
  }

  async updateFilterValue(filterId: string, valueId: string, value: string) {
    await this.filterExists(filterId);

    return await this.filterModel
      .findOneAndUpdate(
        { _id: filterId, 'values._id': valueId },
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

  async removeFilterValue(filterId: string, valueId: string) {
    await this.filterExists(filterId);

    return await this.filterModel
      .findOneAndUpdate(
        { _id: filterId, 'values._id': valueId },
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

  async validateUserDetails(userDetails: UserDetailI) {
    const filterPaths = Object.keys(userDetails);
    if (filterPaths.length <= 0)
      throw new NotFoundException('No params passed');

    const filter: Filter = (
      await this.filterModel
        .aggregate([
          {
            $match: {
              filterPath: {
                $in: filterPaths,
              },
            },
          },
          {
            $project: {
              filterPath: 1,
            },
          },
        ])
        .count('filterPath')
    )[0];

    if (Number(filterPaths.length) !== Number(filter?.filterPath))
      throw new NotFoundException('Filter not found');
  }
}
