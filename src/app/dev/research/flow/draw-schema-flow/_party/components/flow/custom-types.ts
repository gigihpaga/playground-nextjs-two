import { PartiallyOptional } from '@/types/utilities';

import React from 'react';
import type { EdgeTypes, NodeTypes, BuiltInNode, BuiltInEdge, Node, Edge, NodeProps, EdgeProps } from '@xyflow/react';
import { GetKeys } from '@/types/utilities';
import { CardCommited } from '@/app/dev/research/git/flow-stagging-file/_party/components/flow';

import { NodeShape, type NodeShapeProps } from './node-shape';
import { NodeMindMap, type NodeMindMapProps } from './node-mindmap';
import { NodeLuffy, type NodeLuffyProps } from './node-luffy';
import { NodeComputingcolorNumberInput, type NodeComputingcolorNumberInputProps } from './node-computingcolor-numberinput';
import { NodeComputingcolorColorpreview, type NodeComputingcolorColorpreviewProps } from './node-computingcolor-colorpreview';
import { NodeComputingcolorLightness, type NodeComputingcolorLightnessProps } from './node-computingcolor-lightness';
import { NodeComputingcolorLog, type NodeComputingcolorLogProps } from './node-computingcolor-log';

import type { OmitUndefined, PartiallyRequired, Prettyfy, ShapeCondition } from '@/types/utilities';

import { EdgeMinMap, type EdgeMinMapProps } from './edge-mindmap';
import { EdgeWithDeleteButton1, type EdgeWithDeleteButton1Props } from './edge-with-delete-button-1';
import { EdgeWithLabel1, EdgeWithLabel1Props } from './edge-with-label-1';
import { EdgeWithLabelStartend1, EdgeWithLabelStartend1Props } from './edge-with-label-startend-1';
import { NodeSchemabuilderInputTable, type NodeSchemabuilderInputTableProps } from './node-schemabuilder-input-table';
import { NodeSchemabuilderModifier, type NodeSchemabuilderModifierProps } from './node-schemabuilder-modifier';
import { NodeSchemabuilderCombine, type NodeSchemabuilderCombineProps } from './node-schemabuilder-combine';
import { NodeGroup, type NodeGroupProps } from './node-group';
import { NodeText, type NodeTextProps } from './node-text';

// type MyNode<NodeData extends Record<string, unknown> = Record<string, unknown>, NodeType = NodeVariants> = Node<NodeData, NodeType>;

type CustomNodeTypePopulation =
    // | BuiltInNode
    // | Node
    | NodeLuffyProps
    // | NodeMindMapProps
    // | NodeComputingcolorNumberInputProps
    // | NodeComputingcolorColorpreviewProps
    // | NodeComputingcolorLightnessProps
    | NodeShapeProps
    // | NodeComputingcolorLogProps
    | NodeSchemabuilderInputTableProps
    | NodeSchemabuilderModifierProps
    | NodeSchemabuilderCombineProps
    | NodeGroupProps
    | NodeTextProps;

export type CustomNodeType = BuiltInNode | CustomNodeTypePopulation /* & { type: NodeVariants } */;
// export type NodeVariants = GetKeys<typeof nodeTypes>;
export type NodeVariants = CustomNodeTypePopulation['type'];

export type SelectCustomNode<
    Key extends NodeVariants = NodeVariants,
    Obj extends CustomNodeTypePopulation = CustomNodeTypePopulation,
> = ShapeCondition<Obj, Key>;

// "NodeTypesList" adalah re-type dari "NodeTypes" @xyflow/react
type NodeTypesList = Record<NodeVariants, React.ComponentType<NodeProps & { data: any; type: any }>>;

export const nodeTypes: NodeTypesList = {
    NodeLuffy,
    NodeShape,
    // NodeMindMap,
    // NodeComputingcolorNumberInput,
    // NodeComputingcolorColorpreview,
    // NodeComputingcolorLightness,
    // NodeComputingcolorLog,
    // CardCommited,
    NodeSchemabuilderInputTable,
    NodeSchemabuilderModifier,
    NodeSchemabuilderCombine,
    NodeGroup,
    NodeText,
} satisfies NodeTypes;

//! Edge
type CustomEdgeTypePopulation = EdgeWithDeleteButton1Props | EdgeWithLabel1Props | EdgeMinMapProps | EdgeWithLabelStartend1Props;

export type CustomEdgeType = BuiltInEdge | CustomEdgeTypePopulation /* Edge */;

// export type EdgeVariants = GetKeys<typeof edgeTypes>;
export type EdgeVariants = CustomEdgeTypePopulation['type'];

export type SelectCustomEdge<
    Key extends EdgeVariants = EdgeVariants,
    Obj extends CustomEdgeTypePopulation = CustomEdgeTypePopulation,
> = ShapeCondition<Obj, Key>;

// "EdgeTypesList" adalah re-type dari "EdgeTypes" @xyflow/react
type EdgeTypesList = Record<EdgeVariants, React.ComponentType<EdgeProps & { data: any; type: any }>>;

export const edgeTypes: EdgeTypesList = {
    EdgeMinMap,
    EdgeWithDeleteButton1,
    EdgeWithLabel1,
    EdgeWithLabelStartend1,
} satisfies EdgeTypes;
