import { TextInput as BaseTextInput, TextInputProps } from '@mantine/core';
import React from 'react';

type Props = TextInputProps;

export const TextInput: React.FC<Props> = (props) => {
  return <BaseTextInput {...props} />;
};
