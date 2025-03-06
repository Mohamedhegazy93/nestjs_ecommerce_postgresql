
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
  import { Role } from './roles.enum';
  import * as dotenv from 'dotenv'; 
dotenv.config(); 

  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private reflector: Reflector
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException('you dont have token');
      }
      try {
        const payload = await this.jwtService.verifyAsync(
          token,
          {
            secret: process.env.JWT_SECRET
          }
          
        );
      
        // We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        request['user'] = payload;
  
        const requiredRoles = this.reflector.get<Role[]>('roles', context.getHandler());
        if (requiredRoles && !requiredRoles.includes(payload.role)) {
            throw new UnauthorizedException('you can not perform this action');
        }
  
      } 
      
      catch {
        throw new UnauthorizedException('not authorized to perofrm this action');
      }
      return true;
    }
    
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }
  
  