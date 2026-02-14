import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from './schemas/contact.schema';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactsService {
    constructor(@InjectModel(Contact.name) private contactModel: Model<ContactDocument>) { }

    async create(createContactDto: CreateContactDto): Promise<Contact> {
        const newContact = new this.contactModel(createContactDto);
        return newContact.save();
    }

    async findAll(): Promise<Contact[]> {
        return this.contactModel.find().sort({ createdAt: -1 }).exec();
    }
}
