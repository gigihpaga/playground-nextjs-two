import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { withActions } from '@storybook/addon-actions/decorator';
import { action } from '@storybook/addon-actions';

import { DialogWithFramer } from '@/stories/components/dialog';

/**
 * reference:
 * - [dnd-kit stories](https://github.com/clauderic/dnd-kit/blob/master/stories/1%20-%20Core/Draggable/1-Draggable.story.tsx)
 */
const meta: Meta<typeof DialogWithFramer> = {
    title: 'components/ui/dialog-with-framer',
    component: DialogWithFramer,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <DialogWithFramer />,
};
