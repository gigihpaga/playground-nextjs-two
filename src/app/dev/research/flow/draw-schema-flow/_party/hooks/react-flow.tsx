import { useReactFlow as useReactFlowOriginal } from '@xyflow/react';
import type { CustomEdgeType, CustomNodeType } from '../components/flow/custom-types';

export function useReactFlow() {
    return useReactFlowOriginal<CustomNodeType, CustomEdgeType>();
}
