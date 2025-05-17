"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookCollectionModel = void 0;
const mongoose_1 = require("mongoose");
const bookSchema = new mongoose_1.Schema({
    title: String,
    author: String,
    rating: String,
    countRating: String,
    price: String,
    releaseDate: String,
    updateDate: String,
    startDate: String,
    reviewsCount: String,
    link: String,
});
const bookCollectionSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    books: [bookSchema],
    createdAt: {
        type: Date,
        default: Date.now, //Date.now() вызывать сразу функуцию не правильно
    },
});
exports.BookCollectionModel = (0, mongoose_1.model)('bookCollection', bookCollectionSchema);
