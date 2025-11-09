import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MachineDocument = Machine & Document;

@Schema({ timestamps: true })
export class Machine {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['Running', 'Idle', 'Stopped'], default: 'Idle' })
  status: 'Running' | 'Idle' | 'Stopped';

  @Prop({ required: true, default: 0 })
  temperature: number;

  @Prop({ required: true, default: 0 })
  energyConsumption: number;
}

export const MachineSchema = SchemaFactory.createForClass(Machine);

