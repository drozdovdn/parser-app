"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = require("mongoose");
const unauthorized_error_1 = __importDefault(require("../errors/unauthorized-error"));
const userSchema = new mongoose_1.Schema({
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
userSchema.static('findUserByCredentials', function findUserByCredentials(login, password) {
    return this.findOne({ login })
        .select('+password') //возвращаем пароль из базы, так как в схеме возврат заблокирован
        .then((user) => {
        if (!user) {
            throw new unauthorized_error_1.default('Неправильные логин или пароль');
        }
        return bcryptjs_1.default.compare(password, user.password).then((matched) => {
            if (!matched) {
                throw new unauthorized_error_1.default('Неправильные логин или пароль');
            }
            return user;
        });
    });
});
exports.UserModel = (0, mongoose_1.model)('user', userSchema);
