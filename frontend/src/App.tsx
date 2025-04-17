import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import styled from 'styled-components';

import { Routing } from './core/routes';
import { socket } from './core/socket';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // отключает повторы для useQuery
    },
    mutations: {
      retry: false, // отключает повторы для useMutation
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Content>
        <Routing />
      </Content>
    </QueryClientProvider>
  );
}

export default App;

const Content = styled.div`
  padding: 20px;
`;
