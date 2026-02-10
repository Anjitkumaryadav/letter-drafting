import { Controller, Get, Patch, Delete, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('pending')
    async getPendingUsers(@Request() req) {
        if (!req.user.admin) {
            throw new ForbiddenException('Admin access required');
        }
        return this.usersService.findPending();
    }

    @Patch(':id/approve')
    async approveUser(@Param('id') id: string, @Request() req) {
        if (!req.user.admin) {
            throw new ForbiddenException('Admin access required');
        }
        return this.usersService.approve(id);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string, @Request() req) {
        if (!req.user.admin) {
            throw new ForbiddenException('Admin access required');
        }
        return this.usersService.delete(id);
    }
}
