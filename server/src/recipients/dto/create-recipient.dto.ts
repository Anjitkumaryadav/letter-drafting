import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRecipientDto {
    @ApiProperty({ description: 'Organization or Person Name' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiPropertyOptional({ description: 'Managing Director or specific contact person' })
    @IsOptional()
    @IsString()
    contactPerson?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    address: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    phone?: string;
}
