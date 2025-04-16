import React from 'react';
import styled from 'styled-components';

import { Routing } from './core/routes';

function App() {
  return (
    <Content>
      <Routing />
    </Content>
  );
}

export default App;

const Content = styled.div`
  padding: 20px;
`;
