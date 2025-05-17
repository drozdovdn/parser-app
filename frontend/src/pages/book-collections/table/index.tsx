import { Box, Center, Group, ScrollArea, Table, Text, UnstyledButton } from '@mantine/core';
import { IconChevronDown, IconChevronUp, IconSelector } from '@tabler/icons-react';
import React, { useState } from 'react';

type Book = {
  _id: string;
  title: string;
  author: string;
  rating: string;
  countRating: string;
  price: string;
  releaseDate: string;
  updateDate: string;
  startDate: string;
  reviewsCount: string;
  link: string;
};

type Props = {
  books: Book[];
};

type SortState = {
  sortBy: keyof Book;
  reverse: boolean;
};

function sortBooks(books: Book[], sortBy: keyof Book, reverse: boolean): Book[] {
  return [...books].sort((a, b) => {
    const aVal = a[sortBy] || '';
    const bVal = b[sortBy] || '';
    return reverse
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
    <UnstyledButton onClick={onSort} style={{ width: '100%' }}>
      <Group justify="space-between" gap="xs">
        <Text fw={500} size="sm">
          {children}
        </Text>
        <Center>
          <Icon size={14} />
        </Center>
      </Group>
    </UnstyledButton>
  );
}

export function BookTable({ books }: Props) {
  const [sortState, setSortState] = useState<SortState | null>(null);

  const setSorting = (field: keyof Book) => {
    setSortState((prev) => {
      if (prev?.sortBy === field) {
        return { sortBy: field, reverse: !prev.reverse };
      }
      return { sortBy: field, reverse: false };
    });
  };

  const sortedBooks = sortState ? sortBooks(books, sortState.sortBy, sortState.reverse) : books;

  return (
    <Box h="80vh" style={{ display: 'flex', flexDirection: 'column' }}>
      <ScrollArea style={{ flex: 1 }}>
        <Table withColumnBorders striped highlightOnHover>
          <Table.Thead>
            <Table.Tr
              style={{
                position: 'sticky',
                top: 0,
                backgroundColor: 'white',
                zIndex: 1,
              }}
            >
              <Table.Th>
                <ThSortable
                  sorted={sortState?.sortBy === 'title'}
                  reversed={!!sortState?.reverse}
                  onSort={() => setSorting('title')}
                >
                  Название
                </ThSortable>
              </Table.Th>
              <Table.Th>
                <ThSortable
                  sorted={sortState?.sortBy === 'author'}
                  reversed={!!sortState?.reverse}
                  onSort={() => setSorting('author')}
                >
                  Автор
                </ThSortable>
              </Table.Th>
              <Table.Th>
                <ThSortable
                  sorted={sortState?.sortBy === 'rating'}
                  reversed={!!sortState?.reverse}
                  onSort={() => setSorting('rating')}
                >
                  Рейтинг
                </ThSortable>
              </Table.Th>
              <Table.Th>
                <ThSortable
                  sorted={sortState?.sortBy === 'countRating'}
                  reversed={!!sortState?.reverse}
                  onSort={() => setSorting('countRating')}
                >
                  Оценок
                </ThSortable>
              </Table.Th>
              <Table.Th>
                <ThSortable
                  sorted={sortState?.sortBy === 'reviewsCount'}
                  reversed={!!sortState?.reverse}
                  onSort={() => setSorting('reviewsCount')}
                >
                  Отзывы
                </ThSortable>
              </Table.Th>
              <Table.Th>
                <ThSortable
                  sorted={sortState?.sortBy === 'releaseDate'}
                  reversed={!!sortState?.reverse}
                  onSort={() => setSorting('releaseDate')}
                >
                  Дата выхода
                </ThSortable>
              </Table.Th>
              <Table.Th>Ссылка</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {sortedBooks.map((book) => (
              <Table.Tr key={book._id}>
                <Table.Td>{book.title}</Table.Td>
                <Table.Td>{book.author}</Table.Td>
                <Table.Td>{book.rating}</Table.Td>
                <Table.Td>{book.countRating}</Table.Td>
                <Table.Td>{book.reviewsCount}</Table.Td>
                <Table.Td>{book.releaseDate || book.updateDate || book.startDate || '—'}</Table.Td>
                <Table.Td>
                  <a href={book.link} target="_blank" rel="noopener noreferrer">
                    Открыть
                  </a>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Box>
  );
}
