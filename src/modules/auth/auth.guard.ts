import {CanActivate, ExecutionContext, Injectable, UnauthorizedException }  from "@nestjs/common"
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from    'express';
import { IS_PUBLIC_KEY } from "./auth-public-strategy";


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractToken(request);

        if (!token) {
            throw new UnauthorizedException('Unauthorized access');
        }

        try {
            const payload = this.jwtService.verify(token,{
                secret:process.env.JWT_SECRET
            });
            request.user = payload;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Unauthorized access');
        }
    }

    private extractToken(request: Request): string | undefined {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            throw new UnauthorizedException('Authorization header missing');
        }
    
        const [type, token] = authHeader.split(' ');
        if (type !== 'Bearer' || !token) {
            throw new UnauthorizedException('Invalid token format');
        }
    
        return token;
    }
}

