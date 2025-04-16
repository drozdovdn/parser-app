import { PasswordInput as BasePasswordInput, PasswordInputProps } from '@mantine/core';
import React from 'react';

type Props = PasswordInputProps;

export const PasswordInput: React.FC<Props> = (props) => {
  return <BasePasswordInput {...props} />;
};
