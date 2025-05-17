import { Button } from 'components/button';
import { NumberInput } from 'components/inputs/number';
import { TextInput } from 'components/inputs/text';
import { SOCKET_ENUMS, socket } from 'core/socket';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

import { BookTable } from '../../features/table';

type BodyParserProps = {
  url: string;
  pages: string | number;
  parsingStatus: boolean;
  currentPage: number;
};
const parseUrl = 'https://www.litres.ru';

export const Parser: React.FC = () => {
  const { watch, setValue, reset } = useForm<BodyParserProps>({
    defaultValues: {
      url: parseUrl,
      pages: 1,
      currentPage: 1,
      parsingStatus: false,
    },
  });

  const data = watch();

  const [validUrl, setValidUrl] = useState<boolean>(true);
  const [status, setStatus] = useState('');
  const [titleSave, setTitleSave] = useState('');
  const [parsingStatus, setParsingStatus] = useState<string>();
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect(); // Подключаем сокет, если он еще не подключен
    }

    // Слушаем обновления статуса
    socket.on(SOCKET_ENUMS.STATUS_UPDATE, (data) => {
      setParsingStatus(data.message);
    });

    // Слушаем parsingState
    socket.on(SOCKET_ENUMS.PARSING_STATE, (data) => {
      if (data?.data) {
        reset(data?.data);
      }

      // console.log('parsingState', data);
    });

    // Получаем результат парсинга
    socket.on(SOCKET_ENUMS.PARSING_RESULT, (data) => {
      // console.log(SOCKET_ENUMS.PARSING_RESULT, data);
      if (data?.success) {
        data?.books && setBooks(data.books);
        setStatus(data.message);
      } else {
        setStatus('❌ Ошибка при парсинге');
      }
    });

    // Очистка при размонтировании
    return () => {
      socket.off(SOCKET_ENUMS.STATUS_UPDATE);
      socket.off(SOCKET_ENUMS.PARSING_RESULT);
      socket.off(SOCKET_ENUMS.PARSING_STATE);
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
    socket.emit(SOCKET_ENUMS.PARSING_START, {
      ...data,
      currentPage: +data?.pages > 1 ? 1 : 0,
      parsingStatus: true,
    });
  };

  const handleSave = () => {
    socket.emit(SOCKET_ENUMS.STATUS_SAVE_BOOKS, {
      title: titleSave || new Date().toISOString(),
    });
  };

  const onStopParsing = () => {
    socket.emit(SOCKET_ENUMS.PARSING_START, { ...data, parsingStatus: false });
  };

  const handleOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setValidUrl(e.target.value.startsWith(parseUrl));
  };
  const nameBtn = !!data?.parsingStatus ? 'Идет парсинг...' : 'Запустить парсинг';
  const errorMessage = !validUrl ? `URL должен начинаться с ${parseUrl}` : undefined;
  console.log({ books });
  return (
    <Content>
      <Header>PARSER LITREST</Header>
      <TextInput
        disabled={!!data?.parsingStatus}
        error={errorMessage}
        onBlur={handleOnBlur}
        onFocus={() => setValidUrl(true)}
        label="URL строки с фильрами"
        placeholder="Введи URL для парсинга"
        className="mb-3"
        value={data.url}
        onChange={(e) => setValue('url', e.target.value)}
      />
      <NumberInput
        disabled={!!data?.parsingStatus}
        label="Колличество стариц"
        className="mb-3"
        value={data.pages}
        onChange={(v) => setValue('pages', v)}
      />
      <WrapperButton>
        <Button disabled={!validUrl || !!data?.parsingStatus || !data?.pages} onClick={onSubmit}>
          {nameBtn}
        </Button>
        {data?.parsingStatus && <Button onClick={onStopParsing}>Остановить парсинг</Button>}
      </WrapperButton>
      {!data?.parsingStatus && books?.length ? (
        <WrapperSave>
          <TextInput
            label="Название распаршеной коллекции книг"
            placeholder="Введи название"
            className="mb-3"
            value={titleSave}
            onChange={(e) => setTitleSave(e.target.value)}
          />
          <Info>
            Введи название чтобы различать потом коллекции или по дефолту будет текущая дата
            сохранения
          </Info>
          <Button onClick={handleSave}>Сохранить в базу</Button>
        </WrapperSave>
      ) : null}
      <Body>
        <p>{parsingStatus}</p>
        <BookTable data={books} />
      </Body>
    </Content>
  );
};
const WrapperSave = styled.div`
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #dedede;
  margin-top: 10px;
  margin-bottom: 10px;
`;
const Info = styled.div`
  font-size: 13px;
  margin-bottom: 10px;
  color: darkgrey;
`;
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
