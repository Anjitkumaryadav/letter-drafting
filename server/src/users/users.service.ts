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
        return this.userModel.find({ verifyAccount: false, admin: false }).sort({ createdAt: -1 }).exec();
    }

    async approve(id: string): Promise<User | null> {
        return this.userModel.findByIdAndUpdate(id, { verifyAccount: true }, { new: true }).exec();
    }

    async delete(id: string): Promise<User | null> {
        return this.userModel.findByIdAndDelete(id).exec();
    }
}
