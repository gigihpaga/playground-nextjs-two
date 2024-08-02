import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { action } from '@storybook/addon-actions';
import { Button } from './button';

const meta = {
    title: 'test/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        size: { control: 'select', options: ['default', 'sm', 'md', 'lg', 'xl', null, undefined] },
        color: { control: 'radio', options: ['default', 'primary', 'danger', 'warning', 'succes', null, undefined] },
    },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: 'Click Me',
        onClick: action('text-on-click'),
        disabled: false,
        // className: 'bg-yellow-500',
        size: 'default',
        color: 'primary',
    },
};

export const Disable: Story = {
    args: {
        children: 'Click Me',
        onClick: action('text-on-click'),
        disabled: true,
        className: '',
    },
};

export const Primary: Story = {
    args: {
        children: 'Click Me',
        onClick: action('text-on-click'),
        color: 'primary',
    },
};

export const Succes: Story = {
    args: {
        children: 'Click Me',
        onClick: action('text-on-click'),
        color: 'succes',
    },
};

export const Warning: Story = {
    args: {
        children: 'Click Me',
        onClick: action('text-on-click'),
        color: 'warning',
    },
};

export const Small: Story = {
    args: {
        children: 'Click Me',
        onClick: action('text-on-click'),
        size: 'sm',
    },
};

export const Medium: Story = {
    args: {
        children: 'Click Me',
        onClick: action('text-on-click'),
        size: 'md',
    },
};

export const Large: Story = {
    args: {
        children: 'Click Me',
        onClick: action('text-on-click'),
        size: 'lg',
    },
};

export const ExtraLarge: Story = {
    args: {
        children: 'Click Me',
        onClick: action('text-on-click'),
        size: 'xl',
    },
};
