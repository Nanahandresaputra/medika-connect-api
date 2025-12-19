import {
  Controller, Get, Post,
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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies } from 'src/casl/policies.decorator';
import {
  Action,
  AppAbility,
} from 'src/casl/casl-ability.factory/casl-ability.factory';
import { UsersPolicies } from 'src/casl/policies.entity';

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
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, UsersPolicies),
  )
  @Get()
  findAll(
    @Query('page') page:string,
    @Query('limit') limit:string,
    @Query('roleUser') roleUser: 'admin' | 'customer',
    @Query('search') search:string,
  ) {
    return this.userService.findAll({page: +page, limit: +limit, roleUser, search});
  }


  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, UsersPolicies),
  )
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Delete, UsersPolicies),
  )
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
