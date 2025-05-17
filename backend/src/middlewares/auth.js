"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const unauthorized_error_1 = __importDefault(require("../errors/unauthorized-error"));
exports.default = (req, res, next) => {
    var _a;
    if (!((_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a.jwt)) {
        throw new unauthorized_error_1.default('Необходима авторизация');
    }
    const token = req.cookies.jwt;
    let payload;
    try {
        payload = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
    }
    catch (err) {
        throw new unauthorized_error_1.default('Необходима авторизация');
    }
    req.user = payload; // записываем пейлоуд в объект запроса
    return next(); // пропускаем запрос дальше
};
