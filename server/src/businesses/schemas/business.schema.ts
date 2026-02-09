import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BusinessDocument = Business & Document;

@Schema({ timestamps: true })
export class Business {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    address: string;

    @Prop()
    phone: string;

    @Prop()
    email: string;

    @Prop()
    website: string;

    @Prop()
    logoUrl: string;

    @Prop()
    sealUrl: string;
}

export const BusinessSchema = SchemaFactory.createForClass(Business);
