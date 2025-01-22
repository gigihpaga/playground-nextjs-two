import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { action } from '@storybook/addon-actions';

import { ButtonCopy } from '@/components/ui/custom/button-copy';

/**
 * click button for copy data
 */
const meta: Meta<typeof ButtonCopy> = {
    title: 'components/ui/button-copy',
    component: ButtonCopy,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        data: { control: 'text' },
        className: { control: 'text' },
        disabled: { control: 'boolean', type: 'boolean' },
        size: { control: 'radio', options: ['default', 'sm', 'lg', 'icon', null, undefined] },
        variant: { control: 'radio', options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', null, undefined] },
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    name: 'button copy with animation frammer',
    args: {
        title: 'click me for copy data',
        data: 'saya hasil copy',
        children: undefined,
        asChild: false,
        className: 'mr-1 size-4 [&_.btn-copy-icon-wrapper]:size-[10px] [&_svg]:size-[10px] rounded',
        disabled: false,
        onClick: action('text-on-click'),
    },
    render: (args) => (
        <ButtonCopy
            title={args.title}
            data={args.data}
            className={args.className}
        />
    ),
};
