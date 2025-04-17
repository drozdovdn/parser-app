import { Button as BaseButton, ButtonProps } from '@mantine/core';
import React from 'react';
import { ComponentPropsWithoutRef } from 'react';

type Props = ButtonProps & ComponentPropsWithoutRef<'button'>;

export const Button: React.FC<Props> = (props) => {
  return <BaseButton {...props} />;
};
