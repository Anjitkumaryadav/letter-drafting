import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Check verification (skip for admins)
        if (!user.verifyAccount && !user.admin) {
            throw new UnauthorizedException('Your account has not been approved yet.');
        }

        const payload = { email: user.email, sub: user._id, admin: user.admin };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                admin: user.admin,
                verifyAccount: user.verifyAccount
            },
        };
    }

    async register(registerDto: RegisterDto) {
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        // Force critical fields to false
        const user = await this.usersService.create({
            ...registerDto,
            password: hashedPassword,
            verifyAccount: false,
            admin: false,
        });

        // Do not auto-login
        return {
            message: "Registration successful. Your account is pending approval by admin."
        };
    }
}
