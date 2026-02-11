import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true, select: false })
    password: string;

    @Prop({ required: true })
    name: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Business' }], default: [] })
    businesses: Types.ObjectId[];

    @Prop({ default: false })
    verifyAccount: boolean;

    @Prop({ default: false })
    admin: boolean;

    @Prop({ required: true })
    phone: string;

    @Prop({ default: false })
    isHeld: boolean;

    @Prop({ default: false })
    isDeleted: boolean;

    @Prop({ required: false })
    deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
