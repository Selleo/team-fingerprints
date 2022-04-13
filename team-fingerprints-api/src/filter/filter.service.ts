import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
    return filter ? filter : false;
  }

  async getFiltersList() {
    return await this.filterModel.find();
  }

  async getFilter(filterId: string) {
    return await this.filterModel.findById(filterId);
  }

  async getFilterByFilterPath(filterPath: string) {
    return await this.filterModel.findOne({ filterPath });
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
    if (!(await this.filterExists(filterId))) throw new NotFoundException();

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
    if (!(await this.filterExists(filterId)))
      throw new NotFoundException(`Filer does not exist`);

    return await this.filterModel.findByIdAndRemove(filterId);
  }

  async getFilterWithValues(filterId: string) {
    if (!(await this.filterExists(filterId)))
      throw new NotFoundException(`Filer does not exist`);
    return await this.filterModel.findById(filterId);
  }

  async getFilterValue(filterPath: string, valueId: string) {
    const filter = await this.getFilterByFilterPath(filterPath);
    const { value, _id } = filter.values.find(
      (el) => el._id.toString() === valueId,
    );
    return { value, _id: _id.toString() };
  }

  async addFilterValue(filterId: string, value: string) {
    const filter = await this.filterExists(filterId);
    if (!filter) throw new NotFoundException(`Filer does not exist`);

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
    const filter = await this.filterExists(filterId);
    if (!filter) throw new NotFoundException();

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
    if (!(await this.filterExists(filterId))) throw new NotFoundException();

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
}
