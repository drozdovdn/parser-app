import { Button } from 'components/button';
import { PasswordInput } from 'components/inputs/password';
import { TextInput } from 'components/inputs/text';
import React from 'react';
import { NavLink } from 'react-router';
import styled from 'styled-components';

export const Signin: React.FC = () => {
  return (
    <Content className="shadow-lg">
      <Title>Авторизация</Title>
      <TextInput label="Логин" />
      <PasswordInput className="mt-3" label="Пароль" />
      <Wrapper>
        <Button fullWidth>Войти</Button>
      </Wrapper>
      <WrapperLink>
        <Link to="/auth/signup">Регистрация</Link>
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
