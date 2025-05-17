import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Button } from 'components/button';
import React, { useState } from 'react';
import styled from 'styled-components';

import { useBookCollections, useDeleteBookCollection } from './api';
import { CollectionTable } from './table';

export const Archive: React.FC = () => {
  const { data, isLoading } = useBookCollections();
  const { mutate, isPending: isDeleting } = useDeleteBookCollection();
  const [opened, { open, close }] = useDisclosure(false);
  const [dataCollection, setDataCollection] = useState<{ id: string; title: string }>();

  const handleDelete = (id: string, title: string) => {
    setDataCollection({
      id,
      title,
    });
    open();
  };

  const deleteCollection = () => {
    mutate(dataCollection?.id || '');
    close();
  };

  return (
    <>
      <CollectionTable collections={data?.data?.data || []} onDelete={handleDelete} />
      <Modal opened={opened} onClose={close} title="Удалить коллекцию ?">
        <Title>{dataCollection?.title}</Title>
        <WrapperButtons>
          <Button onClick={deleteCollection} color="red">
            Удалить
          </Button>
          <Button className="ml-3" onClick={close} color="grey">
            Отмена
          </Button>
        </WrapperButtons>
      </Modal>
    </>
  );
};
const Title = styled.h2`
  text-align: center;
`;
const WrapperButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;
