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

  const [status, setStatus] = useState<string[]>([]);
  const [result, setResult] = useState<any[]>([]);

  useEffect(() => {
    // socket.on('status', (msg) => {
    //   setStatus((prev) => [...prev, msg]);
    // });
    //
    // socket.on('result', (books) => {
    //   setResult(books);
    // });
    //
    // return () => {
    //   socket.off('status');
    //   socket.off('result');
    // };
  }, []);

  const onSubmit = () => {
    console.log({ data });
    // socket.emit('start_parse', {
    //   url: data.url,
    //   pages: data.pages,
    // });
    socket.emit('message', data.pages);
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
        <div>
          <h3>Статус:</h3>
          <ul>
            {status.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Результат:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
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
