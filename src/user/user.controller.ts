import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies } from 'src/casl/policies.decorator';
import {
  Action,
  AppAbility,
} from 'src/casl/casl-ability.factory/casl-ability.factory';
import { UsersPolicies } from 'src/casl/policies.entity';
import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { RequestCreateUserDto } from './dto/request-create-user.dto';
import { WebFilterDto } from 'src/common-dto/web-filter.dto';
import { RequestUpdateUserDto } from './dto/request-update-user.dto';
import { WebResponseDto } from 'src/common-dto/web-response.dto';
import { ResponseUserDto } from './dto/response-user.dto';

@UseGuards(AuthGuard)
@UseGuards(PoliciesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, UsersPolicies),
  )
  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() createUserDto: RequestCreateUserDto) : Promise<WebResponseDto>  {
    return this.userService.create(createUserDto);
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, UsersPolicies),
  )
  @Get()
  // @ApiQuery({ name: 'page', required: false })
  // @ApiQuery({ name: 'limit', required: false })
  // @ApiQuery({ name: 'roleUser', required: false })
  // @ApiQuery({ name: 'search', required: false })
  findAll(@Query() filterDto: WebFilterDto) : Promise<ResponseUserDto[]>  {
    return this.userService.findAll(filterDto);
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, UsersPolicies),
  )
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateUserDto: RequestUpdateUserDto) : Promise<WebResponseDto>  {
    return this.userService.update(+id, updateUserDto);
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Delete, UsersPolicies),
  )
  @Delete(':id')
  remove(@Param('id') id: string) : Promise<WebResponseDto>  {
    return this.userService.remove(+id);
  }
}
