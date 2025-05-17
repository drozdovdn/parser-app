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
exports.updateUser = exports.getCurrentUser = exports.getUserId = exports.getUsers = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const no_found_error_1 = __importDefault(require("../errors/no-found-error"));
const user_1 = require("../models/user");
const getUsers = (req, res, next) => user_1.UserModel.find({})
    .then((users) => {
    res.send(users);
})
    .catch(next);
exports.getUsers = getUsers;
const getUserId = (req, res, next) => user_1.UserModel.findById(req.params.userId)
    .then((user) => {
    if (!user) {
        throw new no_found_error_1.default('Запрашиваемый пользователь не найден');
    }
    res.send(user);
})
    .catch(next);
exports.getUserId = getUserId;
const getCurrentUser = (req, res, next) => {
    var _a;
    return user_1.UserModel.findById((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id)
        .then((user) => {
        if (!user) {
            throw new no_found_error_1.default('Запрашиваемый пользователь не найден');
        }
        res.send(user);
    })
        .catch(next);
};
exports.getCurrentUser = getCurrentUser;
const updateUser = (req, res, next) => {
    var _a;
    const _b = req.body, { password } = _b, body = __rest(_b, ["password"]);
    if (password) {
        return bcryptjs_1.default
            .hash(password, 10)
            .then((hash) => {
            var _a;
            return user_1.UserModel.findByIdAndUpdate((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id, Object.assign({ password: hash }, body), { new: true, runValidators: true })
                .then((user) => res.send(user))
                .catch(next);
        })
            .catch(next);
    }
    return user_1.UserModel.findByIdAndUpdate((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id, body, { new: true, runValidators: true })
        .then((user) => res.send(user))
        .catch(next);
};
exports.updateUser = updateUser;
