import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Business, BusinessDocument } from './schemas/business.schema';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Injectable()
export class BusinessesService {
    constructor(@InjectModel(Business.name) private businessModel: Model<BusinessDocument>) { }

    async create(createBusinessDto: CreateBusinessDto, userId: string): Promise<Business> {
        const newBusiness = new this.businessModel({
            ...createBusinessDto,
            userId: new Types.ObjectId(userId),
        });
        return newBusiness.save();
    }

    async findAll(userId: string): Promise<Business[]> {
        return this.businessModel.find({ userId: new Types.ObjectId(userId) }).exec();
    }

    async findOne(id: string, userId: string): Promise<Business> {
        const business = await this.businessModel.findOne({ _id: id, userId: new Types.ObjectId(userId) }).exec();
        if (!business) {
            throw new NotFoundException(`Business with ID ${id} not found`);
        }
        return business;
    }

    async update(id: string, updateBusinessDto: UpdateBusinessDto, userId: string): Promise<Business> {
        const business = await this.businessModel.findOneAndUpdate(
            { _id: id, userId: new Types.ObjectId(userId) },
            updateBusinessDto,
            { new: true },
        ).exec();

        if (!business) {
            throw new NotFoundException(`Business with ID ${id} not found`);
        }
        return business;
    }

    async remove(id: string, userId: string): Promise<Business> {
        const business = await this.businessModel.findOneAndDelete({ _id: id, userId: new Types.ObjectId(userId) }).exec();
        if (!business) {
            throw new NotFoundException(`Business with ID ${id} not found`);
        }
        return business;
    }
}
