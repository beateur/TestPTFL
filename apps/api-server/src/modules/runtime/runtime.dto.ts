import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ResolveHostQueryDto {
  @IsString()
  @IsNotEmpty()
  host!: string;
}

export class RuntimeEventDto {
  @IsString()
  @IsNotEmpty()
  event!: string;

  @IsOptional()
  payload?: Record<string, unknown>;
}

export class RuntimeContactDto {
  @IsString()
  @IsNotEmpty()
  artistId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  message!: string;
}
