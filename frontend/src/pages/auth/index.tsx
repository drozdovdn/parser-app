import React from 'react';
import { Outlet } from 'react-router';
import styled from 'styled-components';

export const Auth: React.FC = () => {
  return (
    <Content>
      <Outlet />
    </Content>
  );
};

const Content = styled.div``;
