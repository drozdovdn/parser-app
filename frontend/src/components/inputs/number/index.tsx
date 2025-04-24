import { NumberInput as BaseInput, NumberInputProps } from '@mantine/core';
import React from 'react';

type Props = NumberInputProps;

export const NumberInput: React.FC<Props> = (props) => {
  return <BaseInput {...props} />;
};
