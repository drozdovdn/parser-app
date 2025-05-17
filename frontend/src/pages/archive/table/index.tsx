import {
  ActionIcon,
  Box,
  Button,
  Center,
  Collapse,
  Group,
  ScrollArea,
  Table,
  Text,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import {
  IconChevronDown,
  IconChevronRight,
  IconChevronUp,
  IconSelector,
  IconTrash,
} from '@tabler/icons-react';
import React, { useState } from 'react';
import { Link } from 'react-router';

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

type Collection = {
  _id: string;
  title: string;
  createdAt: string;
  books: Book[];
};

type Props = {
  collections: Collection[];
  onDelete?: (collectionId: string, title: string) => void;
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

export function CollectionTable({ collections, onDelete }: Props) {
  const [openedRows, setOpenedRows] = useState<Record<string, boolean>>({});
  const [sortStates, setSortStates] = useState<Record<string, SortState>>({});

  const toggleRow = (id: string) => {
    setOpenedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const setSorting = (collectionId: string, field: keyof Book) => {
    setSortStates((prev) => {
      const current = prev[collectionId];
      const isSameField = current?.sortBy === field;
      return {
        ...prev,
        [collectionId]: {
          sortBy: field,
          reverse: isSameField ? !current.reverse : false,
        },
      };
    });
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <ScrollArea>
      <Table withTableBorder withColumnBorders striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: 40 }} />
            <Table.Th>Название коллекции</Table.Th>
            <Table.Th>Дата создания</Table.Th>
            <Table.Th style={{ width: 50 }}>Удалить</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {collections.map((collection) => {
            const sortState = sortStates[collection._id];
            const sortedBooks = sortState?.sortBy
              ? sortBooks(collection.books, sortState.sortBy, sortState.reverse)
              : collection.books;

            return (
              <React.Fragment key={collection._id}>
                <Table.Tr>
                  <Table.Td>
                    <Button variant="subtle" size="xs" onClick={() => toggleRow(collection._id)}>
                      <Center>
                        {openedRows[collection._id] ? (
                          <IconChevronDown size={16} />
                        ) : (
                          <IconChevronRight size={16} />
                        )}
                      </Center>
                    </Button>
                  </Table.Td>

                  <Table.Td>
                    <Tooltip label="Открыть коллекцию в отдельной вкладке">
                      <Link to={`/parser/archive/${collection?._id}`}> {collection.title}</Link>
                    </Tooltip>
                  </Table.Td>

                  <Table.Td>{formatDate(collection.createdAt)}</Table.Td>

                  <Table.Td>
                    <Tooltip label="Удалить коллекцию">
                      <ActionIcon
                        color="red"
                        variant="light"
                        onClick={() => onDelete?.(collection._id, collection.title)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Table.Td>
                </Table.Tr>

                <Table.Tr>
                  <Table.Td colSpan={4} style={{ padding: 0, border: 'none' }}>
                    <Collapse in={openedRows[collection._id]}>
                      <Box p="md" pt={0}>
                        <Table withColumnBorders striped highlightOnHover>
                          <Table.Thead>
                            <Table.Tr>
                              <Table.Th>
                                <ThSortable
                                  sorted={sortState?.sortBy === 'title'}
                                  reversed={!!sortState?.reverse}
                                  onSort={() => setSorting(collection._id, 'title')}
                                >
                                  Название
                                </ThSortable>
                              </Table.Th>
                              <Table.Th>
                                <ThSortable
                                  sorted={sortState?.sortBy === 'author'}
                                  reversed={!!sortState?.reverse}
                                  onSort={() => setSorting(collection._id, 'author')}
                                >
                                  Автор
                                </ThSortable>
                              </Table.Th>
                              <Table.Th>
                                <ThSortable
                                  sorted={sortState?.sortBy === 'rating'}
                                  reversed={!!sortState?.reverse}
                                  onSort={() => setSorting(collection._id, 'rating')}
                                >
                                  Рейтинг
                                </ThSortable>
                              </Table.Th>
                              <Table.Th>
                                <ThSortable
                                  sorted={sortState?.sortBy === 'countRating'}
                                  reversed={!!sortState?.reverse}
                                  onSort={() => setSorting(collection._id, 'countRating')}
                                >
                                  Оценок
                                </ThSortable>
                              </Table.Th>
                              <Table.Th>
                                <ThSortable
                                  sorted={sortState?.sortBy === 'reviewsCount'}
                                  reversed={!!sortState?.reverse}
                                  onSort={() => setSorting(collection._id, 'reviewsCount')}
                                >
                                  Отзывы
                                </ThSortable>
                              </Table.Th>
                              <Table.Th>
                                <ThSortable
                                  sorted={sortState?.sortBy === 'releaseDate'}
                                  reversed={!!sortState?.reverse}
                                  onSort={() => setSorting(collection._id, 'releaseDate')}
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
                                <Table.Td>
                                  {book.releaseDate || book.updateDate || book.startDate || '—'}
                                </Table.Td>
                                <Table.Td>
                                  <a href={book.link} target="_blank" rel="noopener noreferrer">
                                    Открыть
                                  </a>
                                </Table.Td>
                              </Table.Tr>
                            ))}
                          </Table.Tbody>
                        </Table>
                      </Box>
                    </Collapse>
                  </Table.Td>
                </Table.Tr>
              </React.Fragment>
            );
          })}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
