import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ) {}


    
    async signIn(email: string, password: string) {
        const user = await this.userService.findOneBy(email);
        if (!user) throw new NotFoundException(`User  not found`);
        if (user.password !== password) throw new UnauthorizedException(`Invalid credentials`);
        const payload = { id: user.id, email: user.email };
        return {
            token: this.jwtService.sign(payload)
        };
    }
}
