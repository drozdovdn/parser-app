import { Button } from 'components/button';
import React from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router';
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
        <Button onClick={logout}>Выйти</Button>
      </Header>
      <Outlet />
    </Content>
  );
};

const Content = styled.div`
  padding: 20px;
`;
const Header = styled.header`
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
