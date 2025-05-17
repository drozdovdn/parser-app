"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorsNotFound = exports.errorsServer = void 0;
const no_found_error_1 = __importDefault(require("../errors/no-found-error"));
const errorsServer = (err, req, res, next) => {
    const { statusCode = 500, message } = err;
    if (err.code === 11000) {
        //если пользователь которого хотим создать уже существует
        res.status(409).send({ message: 'Данный пользователь уже существует' });
    }
    if (err.message.includes('failed')) {
        res.status(400).send({ message: err.message });
    }
    res.status(statusCode).send({
        message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    });
};
exports.errorsServer = errorsServer;
const errorsNotFound = (req, res, next) => {
    const err = new no_found_error_1.default('Ничего не найдено');
    next(err);
};
exports.errorsNotFound = errorsNotFound;
