import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('businesses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('businesses')
export class BusinessesController {
    constructor(private readonly businessesService: BusinessesService) { }

    @Post()
    create(@Body() createBusinessDto: CreateBusinessDto, @Request() req) {
        return this.businessesService.create(createBusinessDto, req.user.userId);
    }

    @Get()
    findAll(@Request() req) {
        return this.businessesService.findAll(req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        return this.businessesService.findOne(id, req.user.userId);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateBusinessDto: UpdateBusinessDto, @Request() req) {
        return this.businessesService.update(id, updateBusinessDto, req.user.userId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.businessesService.remove(id, req.user.userId);
    }
}
