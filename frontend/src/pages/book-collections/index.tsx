import React from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';

import { useBookCollection } from '../archive/api';
import { BookTable } from './table';

export const BookCollections: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useBookCollection(id || '');
  console.log(data);
  return (
    <>
      <WrapperTitle>
        <InfoTitle>Коллекция:</InfoTitle>
        <Title>{data?.title || 'Заголовок'}</Title>
      </WrapperTitle>

      <BookTable books={data?.books || []} />
    </>
  );
};

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
`;

const InfoTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: darkgrey;
  margin-right: 10px;
`;

const WrapperTitle = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;
