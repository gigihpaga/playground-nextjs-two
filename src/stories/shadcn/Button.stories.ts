import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { action } from '@storybook/addon-actions';
import { Button } from '@/components/ui/button';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'components/ui/Button',
    component: Button,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        className: { control: 'text' },
        disabled: { control: 'boolean', type: 'boolean' },
        size: { control: 'radio', options: ['default', 'sm', 'lg', 'icon', null, undefined] },
        variant: { control: 'radio', options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', null, undefined] },
    },
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
    // args: { onClick: fn(), className: '' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
    args: {
        children: 'Click Me',
        asChild: false,
        onClick: action('text-on-click'),
        disabled: false,
        className: 'bg-yellow-500',
    },
};

export const Large: Story = {
    args: {
        size: 'lg',
        children: 'Click Me',
    },
};

export const Small: Story = {
    args: {
        size: 'sm',
        children: 'Click Me',
    },
};

export const Icon: Story = {
    args: {
        size: 'icon',
        children: 'Click Me',
    },
};

export const destructive: Story = {
    args: {
        variant: 'destructive',
        children: 'Click Me',
    },
};
export const ghost: Story = {
    args: {
        variant: 'ghost',
        children: 'Click Me',
    },
};
export const link: Story = {
    args: {
        variant: 'link',
        children: 'Click Me',
    },
};
export const outline: Story = {
    args: {
        variant: 'outline',
        children: 'Click Me',
    },
};
export const secondary: Story = {
    args: {
        variant: 'secondary',
        children: 'Click Me',
    },
};
