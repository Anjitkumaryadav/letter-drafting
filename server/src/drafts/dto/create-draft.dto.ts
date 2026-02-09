import { IsOptional, IsString, IsMongoId, IsDateString, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDraftDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsMongoId()
    businessId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsMongoId()
    recipientId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    refNo?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    date?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    subject?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    content?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    status?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    includeSeal?: boolean;
}
