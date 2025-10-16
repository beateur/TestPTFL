import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';

export enum PageStatusDto {
  Draft = 'draft',
  Published = 'published'
}

export class SectionDto {
  @IsOptional()
  @IsString()
  id?: string;

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

  @IsOptional()
  @IsString()
  seoDescription?: string;

  @IsBoolean()
  @IsOptional()
  isHidden?: boolean;

  @IsOptional()
  @IsEnum(PageStatusDto)
  status?: PageStatusDto;

  @ValidateNested({ each: true })
  @Type(() => SectionDto)
  @IsArray()
  sections!: SectionDto[];
}

export class PatchPageDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;

  @IsOptional()
  @IsBoolean()
  isHidden?: boolean;

  @IsOptional()
  @IsEnum(PageStatusDto)
  status?: PageStatusDto;

  @ValidateNested({ each: true })
  @Type(() => SectionDto)
  @IsArray()
  @IsOptional()
  sections?: SectionDto[];
}
