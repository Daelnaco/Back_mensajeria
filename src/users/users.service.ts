import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './schemas/dto/create-user.dto';
import { UpdateUserDto } from './schemas/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // 1) Verificar si el email ya existe
    const existingUser = await this.userModel.findOne({ email: createUserDto.email }).lean();
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    // 2) Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // 3) Crear y guardar el usuario
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    const saved = await newUser.save();

    // 4) Devolver user sin password
    const obj = saved.toObject();
    delete obj.password;
    return obj as User;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user as unknown as User;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // hashear si viene password nueva
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return updatedUser as unknown as User;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
  }
}
