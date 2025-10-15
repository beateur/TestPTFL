import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateLeadDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  portfolioUrl?: string;

  @IsOptional()
  @IsString()
  goals?: string;
}
