import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Draft, DraftDocument } from './schemas/draft.schema';
import { CreateDraftDto } from './dto/create-draft.dto';
import { UpdateDraftDto } from './dto/update-draft.dto';

@Injectable()
export class DraftsService {
    constructor(@InjectModel(Draft.name) private draftModel: Model<DraftDocument>) { }

    async create(createDraftDto: CreateDraftDto, userId: string): Promise<Draft> {
        const newDraft = new this.draftModel({
            ...createDraftDto,
            userId: new Types.ObjectId(userId),
        });
        return newDraft.save();
    }

    async findAll(userId: string): Promise<Draft[]> {
        return this.draftModel
            .find({ userId: new Types.ObjectId(userId) })
            .populate('businessId')
            .populate('recipientId')
            .sort({ updatedAt: -1 })
            .exec();
    }

    async findOne(id: string, userId: string): Promise<Draft> {
        const draft = await this.draftModel
            .findOne({ _id: id, userId: new Types.ObjectId(userId) })
            .populate('businessId')
            .populate('recipientId')
            .exec();

        if (!draft) {
            throw new NotFoundException(`Draft with ID ${id} not found`);
        }
        return draft;
    }

    async update(id: string, updateDraftDto: UpdateDraftDto, userId: string): Promise<Draft> {
        const draft = await this.draftModel.findOneAndUpdate(
            { _id: id, userId: new Types.ObjectId(userId) },
            updateDraftDto,
            { new: true },
        )
            .populate('businessId')
            .populate('recipientId')
            .exec();

        if (!draft) {
            throw new NotFoundException(`Draft with ID ${id} not found`);
        }
        return draft;
    }

    async remove(id: string, userId: string): Promise<Draft> {
        const draft = await this.draftModel.findOneAndDelete({ _id: id, userId: new Types.ObjectId(userId) }).exec();
        if (!draft) {
            throw new NotFoundException(`Draft with ID ${id} not found`);
        }
        return draft;
    }
}
