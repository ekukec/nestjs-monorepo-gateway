import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class RegisterUserDto {
    @ApiProperty({
        description: 'User email address',
        example: 'john.doe@example.com',
    })
    @IsEmail({}, {message: 'Please provide a valid email address'})
    email: string;
    
    @ApiProperty({
        description: 'User password (minimum 8 characters)',
        example: 'Password123',
        minLength: 8,
    })
    @IsString()
    @MinLength(8, {message: 'Password must be at least 8 characters long'})
    @MaxLength(32, {message: 'Password must not exceed 32 characters'})
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
        {
            message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        }
    )
    password: string;
    
    @ApiProperty({
        description: 'User full name',
        example: 'John Doe',
    })
    @IsString()
    @MaxLength(100)
    name: string;
}