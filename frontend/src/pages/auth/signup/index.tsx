import { Button } from 'components/button';
import { PasswordInput } from 'components/inputs/password';
import { TextInput } from 'components/inputs/text';
import React from 'react';
import { useForm } from 'react-hook-form';
import { NavLink } from 'react-router';
import styled from 'styled-components';

import { RequestBodyType, useRegister } from '../api';

export const Signup: React.FC = () => {
  const { setValue, watch } = useForm<RequestBodyType>();
  const data = watch();
  const { mutate } = useRegister();
  const onSubmit = () => {
    mutate(data);
  };
  const isDisabled = !data?.login || !data?.password;

  return (
    <Content className="shadow-lg">
      <Title>Регистрация</Title>
      <TextInput
        label="Логин"
        value={data?.login}
        onChange={(e) => setValue('login', e.target.value)}
      />
      <PasswordInput
        className="mt-3"
        label="Пароль"
        value={data?.password}
        onChange={(e) => setValue('password', e.target.value)}
      />
      <Wrapper>
        <Button disabled={isDisabled} fullWidth onClick={onSubmit}>
          Зарегистрироваться
        </Button>
      </Wrapper>
      <WrapperLink>
        <Link to="/auth/signin">Авторизация</Link>
      </WrapperLink>
    </Content>
  );
};
const Link = styled(NavLink)`
  font-size: 14px;
`;
const Wrapper = styled.div`
  margin: 30px auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
`;
const WrapperLink = styled(Wrapper)`
  margin: 10px auto 0;
  &:hover {
    text-decoration: underline;
  }
`;
const Title = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 30px;
  text-align: center;
`;
const Content = styled.div`
  width: 500px;
  padding: 50px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
`;
