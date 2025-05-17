"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
const auth_1 = require("./controllers/auth");
const auth_2 = __importDefault(require("./middlewares/auth"));
const errors_1 = require("./middlewares/errors");
const logger_1 = require("./middlewares/logger");
const routes_1 = require("./routes");
const bookCollection_1 = __importDefault(require("./routes/bookCollection"));
const setupSocket_1 = require("./socket/setupSocket");
dotenv_1.default.config();
mongoose_1.default.connect(config_1.DB_ADDRESS).then(() => console.log('Connected DB!'));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
(0, setupSocket_1.setupSocket)(server);
app.use(express_1.default.json()); // для собирания JSON-формата
app.use(express_1.default.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
app.use((0, cookie_parser_1.default)());
app.use(logger_1.requestLogger);
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.post('/signin', (0, celebrate_1.celebrate)({
    body: celebrate_1.Joi.object().keys({
        login: celebrate_1.Joi.string().required(),
        password: celebrate_1.Joi.string().required(),
    }),
}), auth_1.loginUser);
app.post('/signup', (0, celebrate_1.celebrate)({
    body: celebrate_1.Joi.object().keys({
        login: celebrate_1.Joi.string().required(),
        password: celebrate_1.Joi.string().required(),
    }),
}), auth_1.createUser);
app.use(auth_2.default);
app.use('/users', routes_1.userRouter);
app.use('/book-collections', bookCollection_1.default);
// --- ERRORS ---
app.use((0, celebrate_1.errors)());
app.use(errors_1.errorsNotFound);
app.use(errors_1.errorsServer);
server.listen(+config_1.PORT, () => {
    console.log(`Сервер запушен на порту  ${config_1.PORT}`);
});
