import { IsNotEmpty, IsOptional, IsString, IsUrl, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBusinessDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    address: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUrl()
    website?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    headerImage?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    footerImage?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    logoUrl?: string; // Kept for backward compatibility

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    sealUrl?: string;
}
