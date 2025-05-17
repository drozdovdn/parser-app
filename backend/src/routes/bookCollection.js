"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookCollection_1 = require("../controllers/bookCollection");
const bookCollectionRouter = (0, express_1.Router)();
bookCollectionRouter.get('/', bookCollection_1.getUserBookCollections);
bookCollectionRouter.delete('/:id', bookCollection_1.deleteBookCollection);
bookCollectionRouter.get('/:id', bookCollection_1.getBookCollectionById);
exports.default = bookCollectionRouter;
