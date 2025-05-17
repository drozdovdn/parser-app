import { Button } from 'components/button';
import React from 'react';
import { Link, Navigate, Outlet, useNavigate } from 'react-router';
import styled from 'styled-components';

export const ParserLayout: React.FC = () => {
  const navigate = useNavigate();

  const isAuthenticated = Boolean(localStorage.getItem('userId'));

  const logout = () => {
    if (isAuthenticated) {
      localStorage.removeItem('userId');
      navigate('/auth');
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <Content>
      <Header>
        <Navbar>
          <LinkWrapper>
            <Link to="/parser">Парсер</Link>
          </LinkWrapper>
          <LinkWrapper>
            <Link to="/parser/archive">Архив</Link>
          </LinkWrapper>
        </Navbar>
        <Button onClick={logout}>Выйти</Button>
      </Header>
      <Outlet />
    </Content>
  );
};
const LinkWrapper = styled.li`
  &:not(:last-child) {
    margin-right: 20px;
  }
`;
const Navbar = styled.nav`
  display: flex;
  align-items: center;
`;

const Content = styled.div`
  padding: 20px;
`;
const Header = styled.header`
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
