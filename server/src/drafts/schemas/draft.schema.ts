import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DraftDocument = Draft & Document;

@Schema({ timestamps: true })
export class Draft {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Business' })
    businessId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Recipient' })
    recipientId: Types.ObjectId;

    @Prop()
    refNo: string;

    @Prop()
    date: Date;

    @Prop()
    subject: string;

    @Prop()
    content: string; // HTML content from rich text editor

    @Prop({ default: 'DRAFT' })
    status: string; // DRAFT, FINAL

    @Prop({ default: false })
    includeSeal: boolean;

    @Prop({ type: Object })
    layout: any; // Stores x,y positions of elements
}

export const DraftSchema = SchemaFactory.createForClass(Draft);
