import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Machine, MachineDocument } from './schemas/machine.schema';

@Injectable()
export class MachinesService {
  constructor(
    @InjectModel(Machine.name) private machineModel: Model<MachineDocument>,
  ) {}

  async findAll(): Promise<MachineDocument[]> {
    return this.machineModel.find().exec();
  }

  async findOne(id: string): Promise<MachineDocument> {
    const machine = await this.machineModel.findById(id).exec();
    if (!machine) {
      throw new NotFoundException(`Machine with ID ${id} not found`);
    }
    return machine;
  }

  async update(id: string, updateData: Partial<Machine>): Promise<MachineDocument> {
    const machine = await this.machineModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!machine) {
      throw new NotFoundException(`Machine with ID ${id} not found`);
    }
    return machine;
  }

  async create(machineData: Partial<Machine>): Promise<MachineDocument> {
    const machine = new this.machineModel(machineData);
    return machine.save();
  }

  async delete(id: string): Promise<void> {
    const result = await this.machineModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Machine with ID ${id} not found`);
    }
  }
}

