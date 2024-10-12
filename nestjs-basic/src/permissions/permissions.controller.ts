import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from 'src/users/users.interface';
import { Public, ResponseMessage, User } from 'src/decorator/customize';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @ResponseMessage('Create a new permission')
  @Post()
  create(
    @Body() createPermissionDto: CreatePermissionDto,
    @User() user: IUser,
  ) {
    return this.permissionsService.create(createPermissionDto, user);
  }

  @ResponseMessage('Fetch a list permission with paginate')
  @Get()
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.permissionsService.findAll(+currentPage, +limit, qs);
  }

  @ResponseMessage('Get a permission')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @ResponseMessage('Get list permissions')
  @Post('by-users')
  getpermissionsByUser(@User() user: IUser) {
    return this.permissionsService.findByUser(user);
  }

  @ResponseMessage('Update a permission')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatepermissionDto: UpdatePermissionDto,
    @User() user: IUser,
  ) {
    return this.permissionsService.update(id, updatepermissionDto, user);
  }

  @ResponseMessage('Delete a permission')
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.permissionsService.remove(id, user);
  }
}