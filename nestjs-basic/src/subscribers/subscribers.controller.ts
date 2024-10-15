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
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { IUser } from 'src/users/users.interface';
import { Public, ResponseMessage, User } from 'src/decorator/customize';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @ResponseMessage('Create a new subscriber')
  @Post()
  create(
    @Body() createSubscriberDto: CreateSubscriberDto,
    @User() user: IUser,
  ) {
    return this.subscribersService.create(createSubscriberDto, user);
  }

  @Public()
  @ResponseMessage('Fetch a list subscriber with paginate')
  @Get()
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.subscribersService.findAll(+currentPage, +limit, qs);
  }

  @Public()
  @ResponseMessage('Get a subscriber')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscribersService.findOne(id);
  }

  @ResponseMessage('Update a subscriber')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubscriberDto: UpdateSubscriberDto,
    @User() user: IUser,
  ) {
    return this.subscribersService.update(id, updateSubscriberDto, user);
  }

  @ResponseMessage('Delete a subscriber')
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.subscribersService.remove(id, user);
  }
}
