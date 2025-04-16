import { TextInput } from 'components/inputs/text';
import React from 'react';
import styled from 'styled-components';

export const Parser: React.FC = () => {
  return (
    <Content>
      <Header>PARSER LITREST</Header>
      <TextInput placeholder="https://www.litres.ru" />
    </Content>
  );
};

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
