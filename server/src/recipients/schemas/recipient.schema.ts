import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RecipientDocument = Recipient & Document;

@Schema({ timestamps: true })
export class Recipient {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    name: string; // Organization or Person Name

    @Prop()
    contactPerson: string; // MD or specific contact

    @Prop({ required: true })
    address: string;

    @Prop()
    email: string;

    @Prop()
    phone: string;
}

export const RecipientSchema = SchemaFactory.createForClass(Recipient);
