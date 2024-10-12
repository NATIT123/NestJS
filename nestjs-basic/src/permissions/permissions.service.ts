import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,
  ) {}
  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const { name, apiPath, method, module } = createPermissionDto;
    const isExist = await this.permissionModel.findOne({ apiPath, method });
    if (isExist) {
      throw new BadRequestException(
        `Permission with apiPath=${apiPath},method=${method} is exist`,
      );
    }
    let newPermission = await this.permissionModel.create({
      name,
      apiPath,
      method,
      module,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return {
      _id: newPermission?._id,
      createdAt: newPermission?.createdAt,
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
    const totalItems = (await this.permissionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.permissionModel
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
    let Permission = await this.permissionModel.findById(id);
    if (!Permission) {
      throw new NotFoundException('Permission is not valid');
    }
    return Permission;
  }

  async findByUser(user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(user._id)) {
      throw new NotFoundException('Id is not valid');
    }
    let Permission = await this.permissionModel.find({
      userId: user._id,
    });
    if (!Permission) {
      throw new NotFoundException('Permission is not found');
    }
    console.log(Permission);
    return Permission;
  }

  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
    user: IUser,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Id is not valid');
    }
    let Permission = await this.permissionModel.findById(id);
    if (!Permission) {
      throw new NotFoundException('Permission is not found');
    }

    const isExist = await this.permissionModel.findOne({
      apiPath: updatePermissionDto.apiPath,
      method: updatePermissionDto.method,
    });
    if (isExist) {
      throw new BadRequestException(
        `Permission with apiPath=${updatePermissionDto.apiPath},method=${updatePermissionDto.method} is exist`,
      );
    }
    try {
      await this.permissionModel.updateOne(
        { _id: id },
        {
          ...updatePermissionDto,
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
      await this.permissionModel.updateOne(
        { _id: id },
        {
          deletedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      );

      return this.permissionModel.softDelete({ _id: id });
    } catch (err) {
      return { message: err };
    }
  }
}
