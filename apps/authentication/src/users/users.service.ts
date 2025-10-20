import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async register(registerDto: RegisterUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findByEmail(
      registerDto.email,
    );
    if (existingUser) {
      throw new RpcException({
        statusCode: 409,
        message: 'User with this email already exists',
        error: 'Conflict',
      });
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    return this.usersRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
    });
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findByEmailWithPassword(email);

    if (!user) {
      throw new RpcException({
        statusCode: 404,
        message: 'User with this email does not exists',
        error: 'Not Found',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized',
      });
    }

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }
}
