"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.loginUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const user_1 = require("../models/user");
const loginUser = (req, res, next) => {
    const { login, password } = req.body;
    return user_1.UserModel.findUserByCredentials(login, password)
        .then((user) => {
        const token = jsonwebtoken_1.default.sign({ _id: user._id }, config_1.JWT_SECRET, {
            expiresIn: '7d',
        }); //7d
        res
            .cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true })
            .send({ _id: user._id })
            .end(); // сохраняем в cookie на 7 дней
    })
        .catch(next);
};
exports.loginUser = loginUser;
const createUser = (req, res, next) => {
    const _a = req.body, { password } = _a, body = __rest(_a, ["password"]);
    return bcryptjs_1.default
        .hash(password, 10)
        .then((hash) => user_1.UserModel.create(Object.assign({ password: hash }, body)))
        .then(({ _id, login }) => {
        res.status(201).send({ _id, login });
    })
        .catch(next);
};
exports.createUser = createUser;
