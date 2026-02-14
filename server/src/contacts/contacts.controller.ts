import { Controller, Get, Post, Body, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('contacts')
export class ContactsController {
    constructor(private readonly contactsService: ContactsService) { }

    @Post()
    async create(@Body() createContactDto: CreateContactDto) {
        return this.contactsService.create(createContactDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Request() req) {
        if (!req.user.admin) {
            throw new ForbiddenException('Admin access required');
        }
        return this.contactsService.findAll();
    }
}
