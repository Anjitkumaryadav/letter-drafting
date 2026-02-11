import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) public userModel: Model<UserDocument>) { }

    async create(createUserDto: any): Promise<User> {
        const newUser = new this.userModel(createUserDto);
        return newUser.save();
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).select('+password').exec();
    }

    async findById(id: string): Promise<UserDocument | null> {
        return this.userModel.findById(id).exec();
    }

    async findPending(): Promise<User[]> {
        return this.userModel.find({ verifyAccount: false, admin: false, isDeleted: false }).sort({ createdAt: -1 }).exec();
    }

    async findActive(): Promise<User[]> {
        return this.userModel.find({ verifyAccount: true, isDeleted: false }).sort({ createdAt: -1 }).exec();
    }

    async findDeleted(): Promise<User[]> {
        return this.userModel.find({ isDeleted: true }).sort({ deletedAt: -1 }).exec();
    }

    async approve(id: string): Promise<User | null> {
        return this.userModel.findByIdAndUpdate(id, { verifyAccount: true }, { new: true }).exec();
    }

    async hold(id: string): Promise<User | null> {
        return this.userModel.findByIdAndUpdate(id, { isHeld: true }, { new: true }).exec();
    }

    async unhold(id: string): Promise<User | null> {
        return this.userModel.findByIdAndUpdate(id, { isHeld: false }, { new: true }).exec();
    }

    async softDelete(id: string): Promise<User | null> {
        // This is a soft delete
        return this.userModel.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }, { new: true }).exec();
    }

    async restore(id: string): Promise<User | null> {
        return this.userModel.findByIdAndUpdate(id, { isDeleted: false, deletedAt: null }, { new: true }).exec();
    }

    async delete(id: string): Promise<User | null> {
        return this.userModel.findByIdAndDelete(id).exec();
    }
}
