import { IsOptional, IsString } from 'class-validator';

export class CreateArtistDto {
  @IsString()
  accountId!: string;

  @IsString()
  displayName!: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  theme?: string;
}
