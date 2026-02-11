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

    @Get('active')
    async getActiveUsers(@Request() req) {
        if (!req.user.admin) {
            throw new ForbiddenException('Admin access required');
        }
        return this.usersService.findActive();
    }

    @Get('deleted')
    async getDeletedUsers(@Request() req) {
        if (!req.user.admin) {
            throw new ForbiddenException('Admin access required');
        }
        return this.usersService.findDeleted();
    }

    @Patch(':id/approve')
    async approveUser(@Param('id') id: string, @Request() req) {
        if (!req.user.admin) {
            throw new ForbiddenException('Admin access required');
        }
        return this.usersService.approve(id);
    }

    @Patch(':id/hold')
    async holdUser(@Param('id') id: string, @Request() req) {
        if (!req.user.admin) {
            throw new ForbiddenException('Admin access required');
        }
        return this.usersService.hold(id);
    }

    @Patch(':id/unhold')
    async unholdUser(@Param('id') id: string, @Request() req) {
        if (!req.user.admin) {
            throw new ForbiddenException('Admin access required');
        }
        return this.usersService.unhold(id);
    }

    @Patch(':id/restore')
    async restoreUser(@Param('id') id: string, @Request() req) {
        if (!req.user.admin) {
            throw new ForbiddenException('Admin access required');
        }
        return this.usersService.restore(id);
    }

    @Delete(':id/soft')
    async softDeleteUser(@Param('id') id: string, @Request() req) {
        if (!req.user.admin) {
            throw new ForbiddenException('Admin access required');
        }
        return this.usersService.softDelete(id);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string, @Request() req) {
        if (!req.user.admin) {
            throw new ForbiddenException('Admin access required');
        }
        return this.usersService.delete(id);
    }
}
