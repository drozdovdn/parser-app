import { Button } from 'components/button';
import { TextInput } from 'components/inputs/text';
import { socket } from 'core/socket';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

type BodyParserProps = {
  url: string;
  pages: number;
};

export const Parser: React.FC = () => {
  const { watch, setValue } = useForm<BodyParserProps>({
    defaultValues: {
      url: 'https://www.litres.ru/new/',
      pages: 5,
    },
  });

  const data = watch();

  const [status, setStatus] = useState('');
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect(); // Подключаем сокет, если он еще не подключен
    }

    // Слушаем обновления статуса
    socket.on('statusUpdate', (data) => {
      setStatus(data.message);
    });

    // Очистка при размонтировании
    return () => {
      socket.off('statusUpdate');
    };
  }, []);

  const onSubmit = () => {
    console.log({ data });
    // socket.emit('start_parse', {
    //   url: data.url,
    //   pages: data.pages,
    // });
    // socket.emit('message', data.pages);

    // Отправляем запрос на сервер
    socket.emit('startParsing', { baseUrl: data.url, pages: data.pages });

    // Получаем результат парсинга
    socket.on('parsingResult', (data) => {
      console.log('parsingResult', data);
      if (data.success) {
        setBooks(data.books);
        setStatus(data.message);
      } else {
        setStatus('❌ Ошибка при парсинге');
      }
    });
  };

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
      <TextInput
        label="Колличество стариц"
        className="mb-3"
        value={data.pages}
        onChange={(e) => setValue('pages', +e.target.value)}
      />
      <Button onClick={onSubmit}>Запустить парсинг</Button>
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
