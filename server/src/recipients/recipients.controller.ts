import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { RecipientsService } from './recipients.service';
import { CreateRecipientDto } from './dto/create-recipient.dto';
import { UpdateRecipientDto } from './dto/update-recipient.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('recipients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('recipients')
export class RecipientsController {
    constructor(private readonly recipientsService: RecipientsService) { }

    @Post()
    create(@Body() createRecipientDto: CreateRecipientDto, @Request() req) {
        return this.recipientsService.create(createRecipientDto, req.user.userId);
    }

    @Get()
    findAll(@Request() req) {
        return this.recipientsService.findAll(req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        return this.recipientsService.findOne(id, req.user.userId);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateRecipientDto: UpdateRecipientDto, @Request() req) {
        return this.recipientsService.update(id, updateRecipientDto, req.user.userId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.recipientsService.remove(id, req.user.userId);
    }
}
