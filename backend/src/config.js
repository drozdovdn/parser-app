"use strict";
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOCKET_ENUMS = exports.DB_ADDRESS = exports.JWT_SECRET = exports.PORT = void 0;
_a = process.env, _b = _a.PORT, exports.PORT = _b === void 0 ? 4000 : _b, _c = _a.JWT_SECRET, exports.JWT_SECRET = _c === void 0 ? 'JWT_SECRET' : _c, _d = _a.DB_ADDRESS, exports.DB_ADDRESS = _d === void 0 ? 'mongodb://localhost:27017/mydb' : _d;
exports.SOCKET_ENUMS = {
    PARSING_START: 'PARSING_START',
    PARSING_STATE: 'PARSING_STATE',
    PARSING_RESULT: 'PARSING_RESULT',
    STATUS_SAVE_BOOKS: 'STATUS_SAVE_BOOKS',
    STATUS_UPDATE: 'STATUS_UPDATE',
};
