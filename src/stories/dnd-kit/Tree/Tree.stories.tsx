import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { SortableTree } from './SortableTree';
// import './components/TreeItem/TreeItem.module.css';
// import '../_party/components/Item/Item.module.css';
// import '../_party/components/Item/components/Action/Action.module.css';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'Dnd-Kit/Tree/Sortable',
    component: SortableTree,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
} satisfies Meta<typeof SortableTree>;

export default meta;
type Story = StoryObj<typeof meta>;

const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <div
            style={{
                maxWidth: 600,
                padding: 10,
                margin: '0 auto',
                marginTop: '10%',
            }}
        >
            {children}
        </div>
    );
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const AllFeatures = () => (
    <Wrapper>
        <SortableTree
            collapsible
            indicator
            removable
        />
    </Wrapper>
);

export const BasicSetup: Story = {
    args: {},
};

export const DropIndicator = () => (
    <Wrapper>
        <SortableTree indicator />
    </Wrapper>
);

export const Collapsible = () => (
    <Wrapper>
        <SortableTree collapsible />
    </Wrapper>
);

export const RemovableItems = () => (
    <Wrapper>
        <SortableTree removable />
    </Wrapper>
);
