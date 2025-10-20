import { Injectable, ConflictException, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { NetworkingService } from '../../../../common/networking/networking.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly networkingService: NetworkingService, private jwtService: JwtService) {}

  async register(registerDto: RegisterUserDto): Promise<UserResponseDto> {
    try {
      const response = await this.networkingService.sendToAuth<UserResponseDto>(
        { cmd: 'register_user' },
        registerDto,
      );
      return response;
    } catch (error) {
      this.handleMicroserviceError(error);
    }
  }

  async login(loginDto: LoginUserDto): Promise<AuthResponseDto> {
    try {
      const user = await this.networkingService.sendToAuth<UserResponseDto>(
        { cmd: 'validate_user' },
        {
          email: loginDto.email, 
          password: loginDto.password
        },
      );

      const payload = { 
        sub: user.id, 
        email: user.email,
        name: user.name,
      };

      const accessToken = this.jwtService.sign(payload);

      return new AuthResponseDto({
        accessToken,
        user,
      });
    } catch (error) {
      this.handleMicroserviceError(error);
    }
  }


  async getAllUsers(): Promise<UserResponseDto[]> {
    try {
      const response = await this.networkingService.sendToAuth<UserResponseDto[]>(
        { cmd: 'get_all_users' },
        {},
      );
      return response;
    } catch (error) {
      this.handleMicroserviceError(error);
    }
  }

  private handleMicroserviceError(error: any): never {
    if (error.statusCode) {
      switch (error.statusCode) {
        case 409:
          throw new ConflictException(error.message);
        case 404:
          throw new NotFoundException(error.message);
        case 400:
          throw new BadRequestException(error.message);
        default:
          throw new InternalServerErrorException(error.message);
      }
    }
    
    throw new InternalServerErrorException('An error occurred while processing your request');
  }
}