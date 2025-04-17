import bcrypt from 'bcryptjs';
import { Document, Model, Schema, model } from 'mongoose';

import UnauthorizedError from '../errors/unauthorized-error';

export interface IUser {
  login: string;
  password: string;
}

interface IUserModel extends Model<IUser> {
  findUserByCredentials: (login: string, password: string) => Promise<Document<unknown, any, IUser>>;
}

const userSchema = new Schema<IUser, IUserModel>({
  login: {
    type: String,
    unique: true,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  password: {
    type: String,
    required: true,
    select: false, //запрет на возвращение has пароля
  },
});

userSchema.static('findUserByCredentials', function findUserByCredentials(login: string, password: string) {
  return this.findOne({ login })
    .select('+password') //возвращаем пароль из базы, так как в схеме возврат заблокирован
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные логин или пароль');
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnauthorizedError('Неправильные логин или пароль');
        }

        return user;
      });
    });
});

export const UserModel = model<IUser, IUserModel>('user', userSchema);
