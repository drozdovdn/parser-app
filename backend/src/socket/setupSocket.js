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
exports.setupSocket = setupSocket;
const puppeteer_1 = __importDefault(require("puppeteer"));
const socket_io_1 = require("socket.io");
const config_1 = require("../config");
const controllers_1 = require("./controllers");
const parsedBooksMap = new Map(); //тут спаршеные книги
const parsingState = new Map(); //тут состояние комнаты клиента
function setupSocket(server) {
    const io = new socket_io_1.Server(server, {
        path: '/socket.io',
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST'],
        },
    });
    io.on('connection', (socket) => {
        const userId = socket.handshake.auth.userId;
        if (!userId) {
            console.log('Ошибка: не передан userId, отключаем клиента');
            socket.disconnect();
            return;
        }
        const userRoom = `user_${userId}`;
        socket.join(userRoom);
        const books = parsedBooksMap.get(userId);
        const dataPage = parsingState.get(userId);
        console.log(`✅ Клиент ${socket.id} подключен к комнате ${userRoom}`);
        io.to(userRoom).emit(config_1.SOCKET_ENUMS.STATUS_UPDATE, {
            message: `Вы подключены к своей комнате!`,
        });
        io.to(userRoom).emit(config_1.SOCKET_ENUMS.PARSING_STATE, {
            success: true,
            data: parsingState.get(userId) || null,
            message: `Данные процесса парсинга`,
        });
        if (dataPage === null || dataPage === void 0 ? void 0 : dataPage.parsingStatus) {
            io.to(userRoom).emit(config_1.SOCKET_ENUMS.STATUS_UPDATE, {
                message: `🔄 Парсим страницу ${dataPage === null || dataPage === void 0 ? void 0 : dataPage.currentPage} из ${dataPage === null || dataPage === void 0 ? void 0 : dataPage.pages}`,
            });
        }
        if (books === null || books === void 0 ? void 0 : books.length) {
            io.to(userRoom).emit(config_1.SOCKET_ENUMS.PARSING_RESULT, {
                success: true,
                books: books,
                message: `Последние спаршеные данные!`,
            });
        }
        const allBooks = [];
        socket.on(config_1.SOCKET_ENUMS.PARSING_START, (data) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            console.log('startParsing DATA', data);
            parsingState.set(userId, data);
            const { url, pages } = data;
            const browser = yield puppeteer_1.default.launch({ headless: 'new' });
            const page = yield browser.newPage();
            if ((_a = parsingState.get(userId)) === null || _a === void 0 ? void 0 : _a.parsingStatus) {
                io.to(userRoom).emit(config_1.SOCKET_ENUMS.STATUS_UPDATE, { message: 'Начинаю парсить страницы...' });
            }
            else {
                io.to(userRoom).emit(config_1.SOCKET_ENUMS.STATUS_UPDATE, {
                    message: 'Парсинг остановлен, ниже отобразятся данны которые удалось спарсить',
                });
            }
            for (let pageNum = 0; pageNum < pages; pageNum++) {
                if (!((_b = parsingState.get(userId)) === null || _b === void 0 ? void 0 : _b.parsingStatus))
                    break; //выходим из парсинга
                parsingState.set(userId, Object.assign(Object.assign({}, data), { currentPage: pageNum + 1 }));
                const paramOperator = url.includes('?') ? '&' : '?';
                const pageUrl = `${url}${pageNum > 1 ? `${paramOperator}page=${pageNum}` : ''}`;
                io.to(userRoom).emit(config_1.SOCKET_ENUMS.STATUS_UPDATE, {
                    message: `🔄 Парсим страницу ${pageNum + 1} из ${data === null || data === void 0 ? void 0 : data.pages}`,
                });
                // await page.goto(pageUrl, { waitUntil: 'networkidle2' });
                console.log({ pageUrl });
                try {
                    yield page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 60000 });
                }
                catch (error) {
                    console.error('❌ Ошибка загрузки страницы:', pageUrl, error);
                    yield page.close();
                    continue; // пропускаем эту книгу
                }
                yield page.waitForSelector('[data-testid="art__title"]');
                const bookLinks = yield page.$$eval('[data-testid="art__title"]', (anchors) => anchors.map((a) => a.href));
                for (const bookUrl of bookLinks) {
                    if (!((_c = parsingState.get(userId)) === null || _c === void 0 ? void 0 : _c.parsingStatus))
                        break; //выходим из парсинга
                    const bookPage = yield browser.newPage();
                    console.log('=>', { bookUrl });
                    try {
                        yield bookPage.goto(bookUrl, { waitUntil: 'networkidle2', timeout: 60000 });
                    }
                    catch (error) {
                        console.error('❌ Ошибка загрузки страницы:', bookUrl, error);
                        yield bookPage.close();
                        continue; // пропускаем эту книгу
                    }
                    // await bookPage.goto(bookUrl, { waitUntil: 'networkidle2' });
                    yield bookPage.waitForSelector('[data-testid="book-characteristics__wrapper"]');
                    const bookData = yield bookPage.evaluate((bookUrl) => {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                        const getText = (selector) => { var _a, _b; return ((_b = (_a = document.querySelector(selector)) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || ''; };
                        const link = bookUrl;
                        const title = getText('h1[itemprop="name"]');
                        const author = getText('[data-testid="art__authorName"]');
                        const rating = ((_a = document.querySelector('[itemprop="ratingValue"]')) === null || _a === void 0 ? void 0 : _a.getAttribute('content')) || '';
                        const countRating = ((_b = document.querySelector('[itemprop="ratingCount"]')) === null || _b === void 0 ? void 0 : _b.getAttribute('content')) || '';
                        const price = getText('[data-testid="art__finalPrice"]');
                        const releaseDate = ((_d = (_c = Array.from(document.querySelectorAll('.CharacteristicsBlock_characteristic__4pi7v'))
                            .find((div) => { var _a; return (_a = div.textContent) === null || _a === void 0 ? void 0 : _a.includes('Дата выхода на Литрес'); })) === null || _c === void 0 ? void 0 : _c.querySelector('span:nth-child(2)')) === null || _d === void 0 ? void 0 : _d.textContent) || '';
                        const updateDate = ((_f = (_e = Array.from(document.querySelectorAll('.CharacteristicsBlock_characteristic__4pi7v'))
                            .find((div) => { var _a; return (_a = div.textContent) === null || _a === void 0 ? void 0 : _a.includes('Последнее обновление'); })) === null || _e === void 0 ? void 0 : _e.querySelector('span:nth-child(2)')) === null || _f === void 0 ? void 0 : _f.textContent) || '';
                        const startDate = ((_h = (_g = Array.from(document.querySelectorAll('.CharacteristicsBlock_characteristic__4pi7v'))
                            .find((div) => { var _a; return (_a = div.textContent) === null || _a === void 0 ? void 0 : _a.includes('Дата начала написания'); })) === null || _g === void 0 ? void 0 : _g.querySelector('span:nth-child(2)')) === null || _h === void 0 ? void 0 : _h.textContent) || '';
                        const reviewsCount = ((_j = Array.from(document.querySelectorAll('.BookFactoids_reviews__qzxey span'))[0]) === null || _j === void 0 ? void 0 : _j.textContent) || '';
                        return {
                            title,
                            author,
                            rating,
                            countRating,
                            price,
                            releaseDate,
                            updateDate,
                            startDate,
                            reviewsCount,
                            link,
                        };
                    }, bookUrl);
                    allBooks.push(bookData);
                    yield bookPage.close();
                }
            }
            yield browser.close();
            parsedBooksMap.set(userId, allBooks); // сохраняем результат по userId
            const state = parsingState.get(userId);
            if (state) {
                parsingState.set(userId, Object.assign(Object.assign({}, state), { parsingStatus: false }));
                io.to(userRoom).emit(config_1.SOCKET_ENUMS.PARSING_STATE, {
                    success: true,
                    data: parsingState.get(userId) || null,
                    message: `Данные процесса парсинга`,
                });
            }
            console.log({ allBooks });
            io.to(userRoom).emit(config_1.SOCKET_ENUMS.PARSING_RESULT, {
                success: true,
                books: allBooks,
                message: `✅ Сохранено ${allBooks.length} книг в памяти (не в базе)`,
            });
        }));
        socket.on(config_1.SOCKET_ENUMS.STATUS_SAVE_BOOKS, (_a) => __awaiter(this, [_a], void 0, function* ({ title }) {
            const books = parsedBooksMap.get(userId);
            console.log('save', books);
            if (!books || books.length === 0) {
                io.to(userRoom).emit(config_1.SOCKET_ENUMS.STATUS_UPDATE, {
                    message: '⚠️ Нет данных для сохранения. Сначала выполните парсинг.',
                });
                return;
            }
            try {
                yield (0, controllers_1.saveBooksToDatabase)(userId, title, books);
                io.to(userRoom).emit(config_1.SOCKET_ENUMS.STATUS_UPDATE, {
                    message: `✅ Книги успешно сохранены в базу данных.`,
                });
            }
            catch (error) {
                console.error('Ошибка при сохранении книг:', error);
                io.to(userRoom).emit(config_1.SOCKET_ENUMS.STATUS_UPDATE, {
                    message: '❌ Ошибка при сохранении книг в базу данных.',
                });
            }
        }));
    });
}
