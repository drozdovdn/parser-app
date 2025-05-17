import { Server as HTTPServer } from 'http';
import puppeteer from 'puppeteer';
import { Server, Socket } from 'socket.io';

import { SOCKET_ENUMS } from '../config';
import { Book, ParseParams } from '../types';
import { saveBooksToDatabase } from './controllers';

const parsedBooksMap = new Map<string, Book[]>(); //тут спаршеные книги
const parsingState = new Map<string, ParseParams>(); //тут состояние комнаты клиента

export function setupSocket(server: HTTPServer): void {
  const io = new Server(server, {
    path: '/socket.io',
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
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

    io.to(userRoom).emit(SOCKET_ENUMS.STATUS_UPDATE, {
      message: `Вы подключены к своей комнате!`,
    });

    io.to(userRoom).emit(SOCKET_ENUMS.PARSING_STATE, {
      success: true,
      data: parsingState.get(userId) || null,
      message: `Данные процесса парсинга`,
    });

    if (dataPage?.parsingStatus) {
      io.to(userRoom).emit(SOCKET_ENUMS.STATUS_UPDATE, {
        message: `🔄 Парсим страницу ${dataPage?.currentPage} из ${dataPage?.pages}`,
      });
    }

    if (books?.length) {
      io.to(userRoom).emit(SOCKET_ENUMS.PARSING_RESULT, {
        success: true,
        books: books,
        message: `Последние спаршеные данные!`,
      });
    }

    const allBooks: Book[] = [];

    socket.on(SOCKET_ENUMS.PARSING_START, async (data: ParseParams) => {
      console.log('startParsing DATA', data);
      parsingState.set(userId, data);

      const { url, pages } = data;

      const browser = await puppeteer.launch({
        headless: 'new' as any,
        args: ['--no-sandbox', '--disable-setuid-sandbox'], //не безопасно
      });
      const page = await browser.newPage();
      if (parsingState.get(userId)?.parsingStatus) {
        io.to(userRoom).emit(SOCKET_ENUMS.STATUS_UPDATE, { message: 'Начинаю парсить страницы...' });
      } else {
        io.to(userRoom).emit(SOCKET_ENUMS.STATUS_UPDATE, {
          message: 'Парсинг остановлен, ниже отобразятся данны которые удалось спарсить',
        });
      }

      for (let pageNum = 0; pageNum < pages; pageNum++) {
        if (!parsingState.get(userId)?.parsingStatus) break; //выходим из парсинга

        parsingState.set(userId, { ...data, currentPage: pageNum + 1 });
        const paramOperator = url.includes('?') ? '&' : '?';
        const pageUrl = `${url}${pageNum > 1 ? `${paramOperator}page=${pageNum}` : ''}`;

        io.to(userRoom).emit(SOCKET_ENUMS.STATUS_UPDATE, {
          message: `🔄 Парсим страницу ${pageNum + 1} из ${data?.pages}`,
        });

        // await page.goto(pageUrl, { waitUntil: 'networkidle2' });
        console.log({ pageUrl });
        try {
          await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 60000 });
        } catch (error) {
          console.error('❌ Ошибка загрузки страницы:', pageUrl, error);
          await page.close();
          continue; // пропускаем эту книгу
        }
        await page.waitForSelector('[data-testid="art__title"]');

        const bookLinks = await page.$$eval('[data-testid="art__title"]', (anchors) =>
          anchors.map((a) => (a as HTMLAnchorElement).href),
        );

        for (const bookUrl of bookLinks) {
          if (!parsingState.get(userId)?.parsingStatus) break; //выходим из парсинга

          const bookPage = await browser.newPage();
          console.log('=>', { bookUrl });
          try {
            await bookPage.goto(bookUrl, { waitUntil: 'networkidle2', timeout: 60000 });
          } catch (error) {
            console.error('❌ Ошибка загрузки страницы:', bookUrl, error);
            await bookPage.close();
            continue; // пропускаем эту книгу
          }

          // await bookPage.goto(bookUrl, { waitUntil: 'networkidle2' });
          await bookPage.waitForSelector('[data-testid="book-characteristics__wrapper"]');

          const bookData: Book = await bookPage.evaluate((bookUrl) => {
            const getText = (selector: string) => document.querySelector(selector)?.textContent?.trim() || '';
            const link = bookUrl;
            const title = getText('h1[itemprop="name"]');
            const author = getText('[data-testid="art__authorName"]');
            const rating = document.querySelector('[itemprop="ratingValue"]')?.getAttribute('content') || '';
            const countRating = document.querySelector('[itemprop="ratingCount"]')?.getAttribute('content') || '';
            const price = getText('[data-testid="art__finalPrice"]');
            const releaseDate =
              Array.from(document.querySelectorAll('.CharacteristicsBlock_characteristic__4pi7v'))
                .find((div) => div.textContent?.includes('Дата выхода на Литрес'))
                ?.querySelector('span:nth-child(2)')?.textContent || '';
            const updateDate =
              Array.from(document.querySelectorAll('.CharacteristicsBlock_characteristic__4pi7v'))
                .find((div) => div.textContent?.includes('Последнее обновление'))
                ?.querySelector('span:nth-child(2)')?.textContent || '';
            const startDate =
              Array.from(document.querySelectorAll('.CharacteristicsBlock_characteristic__4pi7v'))
                .find((div) => div.textContent?.includes('Дата начала написания'))
                ?.querySelector('span:nth-child(2)')?.textContent || '';
            const reviewsCount =
              Array.from(document.querySelectorAll('.BookFactoids_reviews__qzxey span'))[0]?.textContent || '';

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
          await bookPage.close();
        }
      }

      await browser.close();

      parsedBooksMap.set(userId, allBooks); // сохраняем результат по userId

      const state = parsingState.get(userId);
      if (state) {
        parsingState.set(userId, { ...state, parsingStatus: false });

        io.to(userRoom).emit(SOCKET_ENUMS.PARSING_STATE, {
          success: true,
          data: parsingState.get(userId) || null,
          message: `Данные процесса парсинга`,
        });
      }
      console.log({ allBooks });
      io.to(userRoom).emit(SOCKET_ENUMS.PARSING_RESULT, {
        success: true,
        books: allBooks,
        message: `✅ Сохранено ${allBooks.length} книг в памяти (не в базе)`,
      });
    });
    socket.on(SOCKET_ENUMS.STATUS_SAVE_BOOKS, async ({ title }: { title: string }) => {
      const books = parsedBooksMap.get(userId);
      console.log('save', books);
      if (!books || books.length === 0) {
        io.to(userRoom).emit(SOCKET_ENUMS.STATUS_UPDATE, {
          message: '⚠️ Нет данных для сохранения. Сначала выполните парсинг.',
        });
        return;
      }

      try {
        await saveBooksToDatabase(userId, title, books);
        io.to(userRoom).emit(SOCKET_ENUMS.STATUS_UPDATE, {
          message: `✅ Книги успешно сохранены в базу данных.`,
        });
      } catch (error) {
        console.error('Ошибка при сохранении книг:', error);
        io.to(userRoom).emit(SOCKET_ENUMS.STATUS_UPDATE, {
          message: '❌ Ошибка при сохранении книг в базу данных.',
        });
      }
    });
  });
}
