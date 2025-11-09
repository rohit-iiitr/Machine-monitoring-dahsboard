import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { MachinesService } from './machines.service';
import { Machine } from './schemas/machine.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('machines')
@UseGuards(JwtAuthGuard)
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @Get()
  async findAll(): Promise<Machine[]> {
    return this.machinesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Machine> {
    return this.machinesService.findOne(id);
  }

  @Post()
  async create(@Body() createData: Partial<Machine>): Promise<Machine> {
    return this.machinesService.create(createData);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<Machine>,
  ): Promise<Machine> {
    return this.machinesService.update(id, updateData);
  }

  @Post(':id/update')
  async updatePost(
    @Param('id') id: string,
    @Body() updateData: Partial<Machine>,
  ): Promise<Machine> {
    return this.machinesService.update(id, updateData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.machinesService.delete(id);
    return { message: 'Machine deleted successfully' };
  }
}

