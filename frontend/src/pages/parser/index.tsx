import { Button } from 'components/button';
import { NumberInput } from 'components/inputs/number';
import { TextInput } from 'components/inputs/text';
import { socket } from 'core/socket';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

type BodyParserProps = {
  url: string;
  pages: string | number;
  parsingStatus: boolean;
  currentPage: number;
};

export const Parser: React.FC = () => {
  const { watch, setValue, reset } = useForm<BodyParserProps>({
    defaultValues: {
      url: 'https://www.litres.ru/new/',
      pages: 1,
      currentPage: 1,
      parsingStatus: false,
    },
  });

  const data = watch();

  const [status, setStatus] = useState('');
  const [parsingStatus, setParsingStatus] = useState<Record<string, any>>();
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect(); // Подключаем сокет, если он еще не подключен
    }

    // Слушаем обновления статуса
    socket.on('statusUpdate', (data) => {
      setStatus(data.message);
    });

    // Слушаем parsingState
    socket.on('parsingState', (data) => {
      if (data?.data) {
        reset(data?.data);
      }

      console.log('parsingState', data);
    });

    // Получаем результат парсинга
    socket.on('parsingResult', (data) => {
      console.log('parsingResult', data);
      if (data?.success) {
        data?.books && setBooks(data.books);
        setStatus(data.message);
      } else {
        setStatus('❌ Ошибка при парсинге');
      }
    });

    // Очистка при размонтировании
    return () => {
      socket.off('statusUpdate');
      socket.off('parsingResult');
      socket.off('parsingState');
      socket.disconnect();
    };
  }, []);

  const onSubmit = () => {
    console.log({ data });
    // socket.emit('start_parse', {
    //   url: data.url,
    //   pages: data.pages,
    // });
    // socket.emit('message', data.pages);

    setValue('parsingStatus', true);
    // Отправляем запрос на сервер
    socket.emit('startParsing', {
      ...data,
      currentPage: +data?.pages > 1 ? 1 : 0,
      parsingStatus: true,
    });
  };

  const onStopParsing = () => {
    socket.emit('startParsing', { ...data, parsingStatus: false });
  };

  const nameBtn = !!data?.parsingStatus ? 'Идет парсинг...' : 'Запустить парсинг';
  return (
    <Content>
      <Header>PARSER LITREST</Header>
      <TextInput
        label="URL строки с фильрами"
        className="mb-3"
        placeholder="https://www.litres.ru"
        value={data.url}
        onChange={(e) => setValue('url', e.target.value)}
      />
      <NumberInput
        label="Колличество стариц"
        className="mb-3"
        value={data.pages}
        onChange={(v) => setValue('pages', v)}
      />
      <WrapperButton>
        <Button disabled={!!data?.parsingStatus} onClick={onSubmit}>
          {nameBtn}
        </Button>
        {data?.parsingStatus && <Button onClick={onStopParsing}>Остановить парсинг</Button>}
      </WrapperButton>
      <Body>
        <p>{status}</p>
        <ul>
          {books.map((book, index) => (
            <li key={index}>
              <strong>{book.title}</strong> by {book.author} - {book.rating} stars
            </li>
          ))}
        </ul>
      </Body>
    </Content>
  );
};

const WrapperButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Body = styled.div`
  margin-top: 50px;
`;
const Content = styled.div`
  padding-top: 100px;
  max-width: 60%;
  margin: 0 auto;
`;
const Header = styled.header`
  padding: 10px;
  font-size: 24px;
  text-align: center;
`;
