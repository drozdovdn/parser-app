"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ForbiddenError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 403;
    }
}
exports.default = ForbiddenError;
