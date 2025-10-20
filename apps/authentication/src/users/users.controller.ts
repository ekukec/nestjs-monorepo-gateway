import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './entities/user.entity';

@Controller()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @MessagePattern({ cmd: 'register_user' })
    async register(registerDto: RegisterUserDto): Promise<UserResponseDto> {
        const user = await this.usersService.register(registerDto);

        return this.mapToUserResponseDto(user);
    }

    @MessagePattern({ cmd: 'validate_user' })
    async validate(data: { email: string; password: string }): Promise<UserResponseDto> {
        const user = await this.usersService.validateUser(data.email, data.password);

        return this.mapToUserResponseDto(user);
    }

    @MessagePattern({ cmd: 'get_all_users' })
    async findAll(): Promise<UserResponseDto[]> {
        const users = await this.usersService.findAll();

        return users.map(user => this.mapToUserResponseDto(user));
    }

    private mapToUserResponseDto(user: User): UserResponseDto{
        return new UserResponseDto({
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    }
}