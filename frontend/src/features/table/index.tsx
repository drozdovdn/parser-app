import { Center, Group, ScrollArea, Table, Text, UnstyledButton } from '@mantine/core';
import { IconChevronDown, IconChevronUp, IconSelector } from '@tabler/icons-react';
import React, { useState } from 'react';

type Book = {
  author: string;
  countRating: string;
  link: string;
  price: string;
  rating: string;
  releaseDate: string;
  reviewsCount: string;
  startDate: string;
  title: string;
  updateDate: string;
};

type BookTableProps = {
  data: Book[];
};

function sortData(data: Book[], sortBy: keyof Book, reversed: boolean) {
  return [...data].sort((a, b) => {
    const aVal = a[sortBy] || '';
    const bVal = b[sortBy] || '';
    return reversed
      ? String(bVal).localeCompare(String(aVal), 'ru', { numeric: true })
      : String(aVal).localeCompare(String(bVal), 'ru', { numeric: true });
  });
}

function ThSortable({
  children,
  sorted,
  reversed,
  onSort,
}: {
  children: React.ReactNode;
  sorted: boolean;
  reversed: boolean;
  onSort: () => void;
}) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;

  return (
    <Table.Th>
      <UnstyledButton onClick={onSort} style={{ width: '100%' }}>
        <Group justify="space-between">
          <Text fw={500} size="sm">
            {children}
          </Text>
          <Center>
            <Icon size={14} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

export function BookTable({ data }: BookTableProps) {
  const [sortBy, setSortBy] = useState<keyof Book | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const sortedData = sortBy ? sortData(data, sortBy, reverseSortDirection) : data;

  const setSorting = (field: keyof Book) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  return (
    <ScrollArea>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <ThSortable
              sorted={sortBy === 'title'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('title')}
            >
              Название
            </ThSortable>
            <ThSortable
              sorted={sortBy === 'author'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('author')}
            >
              Автор
            </ThSortable>
            <ThSortable
              sorted={sortBy === 'rating'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('rating')}
            >
              Рейтинг
            </ThSortable>
            <ThSortable
              sorted={sortBy === 'countRating'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('countRating')}
            >
              Оценок
            </ThSortable>
            <ThSortable
              sorted={sortBy === 'reviewsCount'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('reviewsCount')}
            >
              Отзывов
            </ThSortable>
            <ThSortable
              sorted={sortBy === 'releaseDate'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('releaseDate')}
            >
              Дата выхода
            </ThSortable>
            <Table.Th>Ссылка</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {sortedData.map((row, index) => (
            <Table.Tr key={index}>
              <Table.Td>{row.title}</Table.Td>
              <Table.Td>{row.author}</Table.Td>
              <Table.Td>{row.rating}</Table.Td>
              <Table.Td>{row.countRating}</Table.Td>
              <Table.Td>{row.reviewsCount}</Table.Td>
              <Table.Td>{row.releaseDate}</Table.Td>
              <Table.Td>
                <a href={row.link} target="_blank" rel="noopener noreferrer">
                  Перейти
                </a>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
