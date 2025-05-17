"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookCollectionById = exports.deleteBookCollection = exports.getUserBookCollections = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bookCollection_1 = require("../models/bookCollection");
const getUserBookCollections = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    return bookCollection_1.BookCollectionModel.find({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id })
        .then((collections) => {
        res.status(200).json({ success: true, data: collections });
    })
        .catch(next);
});
exports.getUserBookCollections = getUserBookCollections;
const deleteBookCollection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const collectionId = req.params.id;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!mongoose_1.default.Types.ObjectId.isValid(collectionId)) {
            res.status(400).json({ message: 'Неверный ID коллекции' });
        }
        return bookCollection_1.BookCollectionModel.findOneAndDelete({
            _id: collectionId,
            user: userId, // чтобы нельзя было удалить чужую коллекцию
        })
            .then((deleted) => {
            if (!deleted) {
                res.status(404).json({ message: 'Коллекция не найдена или не принадлежит вам' });
            }
            res.status(200).json({ success: true, message: 'Коллекция успешно удалена' });
        })
            .catch(next);
    }
    catch (error) {
        next(error);
    }
});
exports.deleteBookCollection = deleteBookCollection;
const getBookCollectionById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const collectionId = req.params.id;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!mongoose_1.default.Types.ObjectId.isValid(collectionId)) {
            res.status(400).json({ message: 'Неверный ID коллекции' });
        }
        return yield bookCollection_1.BookCollectionModel.findOne({
            _id: collectionId,
            user: userId,
        })
            .then((collection) => {
            if (!collection) {
                res.status(404).json({ message: 'Коллекция не найдена или не принадлежит вам' });
            }
            res.status(200).json({ success: true, data: collection });
        })
            .catch(next);
    }
    catch (error) {
        next(error);
    }
});
exports.getBookCollectionById = getBookCollectionById;
