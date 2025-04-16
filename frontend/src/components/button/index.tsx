import { Button as BaseButton, ButtonProps } from '@mantine/core';
import React from 'react';

type Props = ButtonProps;

export const Button: React.FC<Props> = (props) => {
  return <BaseButton {...props} />;
};
