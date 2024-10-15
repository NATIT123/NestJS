import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber, SubscriberDocument } from './schemas/subscriber.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<SubscriberDocument>,
  ) {}

  async create(createSubcriberDto: CreateSubscriberDto, userCreated: IUser) {
    const { name, skills, email } = createSubcriberDto;
    const isExist = await this.subscriberModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException('Email is exist');
    }
    let newSubscriber = await this.subscriberModel.create({
      name,
      skills,
      email,
      createdBy: {
        _id: userCreated._id,
        email: userCreated.email,
      },
    });
    return {
      _id: newSubscriber._id,
      createdAt: newSubscriber.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    filter.isDeleted = false;
    console.log(filter);
    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.subscriberModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.subscriberModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result: result,
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id is not valid');
    }
    let Subcriber = await this.subscriberModel.findById(id);
    if (!Subcriber) {
      throw new BadRequestException('Subcriber is not valid');
    }
    return { Subcriber };
  }

  async update(
    id: string,
    updateSubcriberDto: UpdateSubscriberDto,
    user: IUser,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Id is not valid');
    }
    let Subcriber = await this.subscriberModel.findById(id);
    if (!Subcriber) {
      throw new NotFoundException('Subcriber is not found');
    }
    try {
      await this.subscriberModel.updateOne(
        { _id: id },
        {
          ...updateSubcriberDto,
          updatedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      );
    } catch (err) {
      return err;
    }
    return { message: true };
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { message: 'Id is not valid' };
    }
    try {
      await this.subscriberModel.updateOne(
        { _id: id },
        {
          deletedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      );

      return this.subscriberModel.softDelete({ _id: id });
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
