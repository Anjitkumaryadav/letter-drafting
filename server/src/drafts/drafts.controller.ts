import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { DraftsService } from './drafts.service';
import { CreateDraftDto } from './dto/create-draft.dto';
import { UpdateDraftDto } from './dto/update-draft.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('drafts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('drafts')
export class DraftsController {
    constructor(private readonly draftsService: DraftsService) { }

    @Post()
    create(@Body() createDraftDto: CreateDraftDto, @Request() req) {
        return this.draftsService.create(createDraftDto, req.user.userId);
    }

    @Get()
    findAll(@Request() req) {
        return this.draftsService.findAll(req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        return this.draftsService.findOne(id, req.user.userId);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDraftDto: UpdateDraftDto, @Request() req) {
        return this.draftsService.update(id, updateDraftDto, req.user.userId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.draftsService.remove(id, req.user.userId);
    }
}
