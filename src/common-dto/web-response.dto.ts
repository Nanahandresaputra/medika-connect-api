import { IsInt, IsOptional, IsString } from "class-validator";

export class WebResponseDto<T> {
    @IsInt()
    status: number

    @IsOptional()
    data?: T

    @IsString()
    messge: string;
}