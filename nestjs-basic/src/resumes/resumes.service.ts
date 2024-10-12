import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateResumeDto, CreateUserCVDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name)
    private resumeModel: SoftDeleteModel<ResumeDocument>,
  ) {}

  async create(createResumeDto: CreateUserCVDto, user: IUser) {
    const { url, companyId, jobId } = createResumeDto;
    let newJob = await this.resumeModel.create({
      email: user.email,
      status: 'PENDING',
      url,
      userId: user._id,
      companyId,
      jobId,
      history: {
        status: 'PENDING',
        updatedAt: new Date(),
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return {
      _id: newJob?._id,
      createdAt: newJob?.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    filter.isDeleted = false;
    console.log(projection);
    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.resumeModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.resumeModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select(projection)
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
      throw new NotFoundException('Id is not valid');
    }
    let resume = await this.resumeModel.findById(id);
    if (!resume) {
      throw new NotFoundException('Resume is not valid');
    }
    return resume;
  }

  async findByUser(user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(user._id)) {
      throw new NotFoundException('Id is not valid');
    }
    let resume = await this.resumeModel.find({
      userId: user._id,
    });
    if (!resume) {
      throw new NotFoundException('Resume is not found');
    }
    console.log(resume);
    return resume;
  }

  async update(id: string, updateResumeDto: UpdateResumeDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Id is not valid');
    }
    let resume = await this.resumeModel.findById(id);
    if (!resume) {
      throw new NotFoundException('Resume is not found');
    }
    try {
      await this.resumeModel.updateOne(
        { _id: id },
        {
          ...updateResumeDto,
          $push: {
            history: {
              status: updateResumeDto.status,
              updatedAt: new Date(),
              updatedBy: {
                _id: user._id,
                email: user.email,
              },
            },
          },
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
      await this.resumeModel.updateOne(
        { _id: id },
        {
          deletedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      );

      return this.resumeModel.softDelete({ _id: id });
    } catch (err) {
      return { message: err };
    }
  }
}
