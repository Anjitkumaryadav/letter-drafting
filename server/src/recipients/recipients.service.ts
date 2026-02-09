import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Recipient, RecipientDocument } from './schemas/recipient.schema';
import { CreateRecipientDto } from './dto/create-recipient.dto';
import { UpdateRecipientDto } from './dto/update-recipient.dto';

@Injectable()
export class RecipientsService {
    constructor(@InjectModel(Recipient.name) private recipientModel: Model<RecipientDocument>) { }

    async create(createRecipientDto: CreateRecipientDto, userId: string): Promise<Recipient> {
        const newRecipient = new this.recipientModel({
            ...createRecipientDto,
            userId: new Types.ObjectId(userId),
        });
        return newRecipient.save();
    }

    async findAll(userId: string): Promise<Recipient[]> {
        return this.recipientModel.find({ userId: new Types.ObjectId(userId) }).exec();
    }

    async findOne(id: string, userId: string): Promise<Recipient> {
        const recipient = await this.recipientModel.findOne({ _id: id, userId: new Types.ObjectId(userId) }).exec();
        if (!recipient) {
            throw new NotFoundException(`Recipient with ID ${id} not found`);
        }
        return recipient;
    }

    async update(id: string, updateRecipientDto: UpdateRecipientDto, userId: string): Promise<Recipient> {
        const recipient = await this.recipientModel.findOneAndUpdate(
            { _id: id, userId: new Types.ObjectId(userId) },
            updateRecipientDto,
            { new: true },
        ).exec();

        if (!recipient) {
            throw new NotFoundException(`Recipient with ID ${id} not found`);
        }
        return recipient;
    }

    async remove(id: string, userId: string): Promise<Recipient> {
        const recipient = await this.recipientModel.findOneAndDelete({ _id: id, userId: new Types.ObjectId(userId) }).exec();
        if (!recipient) {
            throw new NotFoundException(`Recipient with ID ${id} not found`);
        }
        return recipient;
    }
}
