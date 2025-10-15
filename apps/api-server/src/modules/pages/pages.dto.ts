import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

class SectionDto {
  @IsString()
  type!: string;

  @IsOptional()
  data?: Record<string, unknown>;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;
}

export class UpsertPageDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsBoolean()
  @IsOptional()
  isHidden?: boolean;

  @ValidateNested({ each: true })
  @Type(() => SectionDto)
  @IsArray()
  sections!: SectionDto[];
}
