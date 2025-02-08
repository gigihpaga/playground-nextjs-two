import { NodeToolbar, Position, useHandleConnections, useNodesData, type Node, type NodeProps } from '@xyflow/react';

import type { PartiallyRequired } from '@/types/utilities';

import { NodeSchemabuilderInputTableProps, fieldsSchema, nodeSchemabuilderInputTableDataSchema, type Field } from './node-schemabuilder-input-table';
import { BaseShape } from '../base-shape';
import { Handle } from './handle';
import { useReactFlow } from '../../hooks/react-flow';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { z } from 'zod';

export const nodeSchemabuilderCombineSchema = nodeSchemabuilderInputTableDataSchema.pick({ fields: true, theme: true });
// export type NodeSchemabuilderCombineData = { fields: Field[] };
export type NodeSchemabuilderCombineData = z.infer<typeof nodeSchemabuilderCombineSchema>;

export type NodeSchemabuilderCombineProps = PartiallyRequired<Node<NodeSchemabuilderCombineData, 'NodeSchemabuilderCombine'>, 'type'>;

export function NodeSchemabuilderCombine({ ...props }: NodeProps<NodeSchemabuilderCombineProps>) {
    const { id, data } = props;
    const connections = useHandleConnections({ type: 'target' });

    const { updateNodeData, getNode } = useReactFlow();

    const idsNodeInConnections = connections.map((conn) => conn.source);
    const dataNodesInConnections = idsNodeInConnections
        .map((idNIC) => {
            const nodeData = getNode(idNIC)?.data;

            const dataValid = fieldsSchema.safeParse(nodeData);
            if (dataValid.success) {
                return dataValid.data.fields;
            } else {
                return [];
            }
        })
        .reduce((prev, curr, idx) => {
            curr.forEach((a, b) => {
                prev.push(a);
            });
            return prev;
        }, []);

    // console.log(`connection on NodeSchemabuilderCombine: id: ${id}`, connections);
    // console.log(`dataNodesInConnections on NodeSchemabuilderCombine: id: ${id}`, dataNodesInConnections);
    return (
        <>
            <BaseShape
                theme={data.theme}
                className="min-h-[100px] min-w-[100px] rounded-lg p-2 text-xs space-y-3"
            >
                <h2 className="text-sm mb-2">Schema combine</h2>
                <div>
                    <Table className="text-xs">
                        <TableCaption className="text-xs text-inherit">A list of properties schema </TableCaption>
                        <TableHeader className="">
                            <TableRow className=" [&>th]:h-fit [&>th]:py-2 [&>th]:text-inherit">
                                <TableHead className="w-[100px]">Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">is Required?</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="">
                            {dataNodesInConnections.length ? (
                                dataNodesInConnections.map((field) => (
                                    <TableRow
                                        className="[&>td]:h-fit [&>td]:py-2"
                                        key={field.id}
                                    >
                                        <TableCell className="font-medium">{field.name}</TableCell>
                                        <TableCell>{field.types}</TableCell>
                                        <TableCell className="text-right">{String(field.isRequired)}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell
                                        className="font-medium text-center"
                                        colSpan={3}
                                    >
                                        no data to display
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </BaseShape>
            <Handle
                type="target"
                position="top"
            />
            <Handle
                type="source"
                position="bottom"
                theme="green"
            />
        </>
    );
}
