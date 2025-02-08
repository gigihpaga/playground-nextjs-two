import { useEffect, useMemo } from 'react';
import { useHandleConnections, useNodesData, type Node, type NodeProps } from '@xyflow/react';
import { CircleHelp } from 'lucide-react';

import type { PartiallyRequired } from '@/types/utilities';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { selectorDraw, shallow, useDrawStore } from '../../state/draw-store';
import { useReactFlow } from '../../hooks/react-flow';
import { type NodeSchemabuilderInputTableProps, type Field, nodeSchemabuilderInputTableDataSchema } from './node-schemabuilder-input-table';
import { BaseShape } from '../base-shape';
import { Handle } from './handle';
import { z } from 'zod';

export const nodeSchemabuilderModifierSchema = nodeSchemabuilderInputTableDataSchema.pick({ fields: true, theme: true });

// export type NodeSchemabuilderModifierData = { fields: Field[] };
export type NodeSchemabuilderModifierData = z.infer<typeof nodeSchemabuilderModifierSchema>;

export type NodeSchemabuilderModifierProps = PartiallyRequired<Node<NodeSchemabuilderModifierData, 'NodeSchemabuilderModifier'>, 'type'>;

export function NodeSchemabuilderModifier({ ...props }: NodeProps<NodeSchemabuilderModifierProps>) {
    const { id, data: nodeDataBuilderModifier } = props;
    const connections = useHandleConnections({ type: 'target' });

    /** //? untuk update data, masih menggunakan "updateNodeData" dari useReactFlow(),
     *  * dan untuk get data masih menggunakan "useNodesData" dari hook bawaan react-flow.
     *  ! kalo pakai fuction yang dibuat sendiri menggunakan zustand masih terdapat bug:
     *  ! 1. yaitu infinity re-render saat akan membuat connection, untuk masalah ini bisa diatasi dengan menggunakan useMemo
     *  ! 2. saat 2 node sudah terhubung, dan node "source" membuat perubahan, perubahan tidak memicu rerender ke node "target", alhasil data tidak syncro
     *  * dengan menggunakan "updateNodeData" dari useReactFlow() dan useNodesData() bawaan, semua masalah teratasi. tapi masih pengan manage state secara mandiri :(
     */
    // const { getNodeData, updateNodeData } = useDrawStore(selectorDraw, shallow);
    // const nodesData = useMemo(() => getNodeData<'NodeSchemabuilderInputTable'>(connections?.[0]?.source), [connections, getNodeData]);

    const { updateNodeData } = useReactFlow();
    const nodesDataInputTable = useNodesData<NodeSchemabuilderInputTableProps>(connections?.[0]?.source);

    useEffect(() => {
        if (nodesDataInputTable && nodesDataInputTable?.data?.fields) {
            updateNodeData(id, { fields: nodesDataInputTable.data.fields });
        } else {
            updateNodeData(id, { fields: [] });
        }
    }, [id, nodesDataInputTable, updateNodeData]);

    function isExist(idFieldInputTable: string) {
        return nodeDataBuilderModifier.fields.some((dbm) => dbm.id == idFieldInputTable);
    }

    return (
        <>
            <BaseShape
                theme={nodeDataBuilderModifier.theme}
                className="min-h-[100px] min-w-[100px] rounded-lg p-2 text-xs space-y-3"
            >
                <h2 className="text-sm mb-2">Schema modifier</h2>
                {nodesDataInputTable && nodesDataInputTable?.data?.fields ? (
                    <ul className="space-y-1">
                        {nodesDataInputTable.data.fields.map((field) => (
                            <li
                                key={field.id}
                                className="flex items-center space-x-2"
                            >
                                <Checkbox
                                    checked={isExist(field.id)}
                                    className="size-3 [&_svg]:size-2"
                                    id={`field-${field}-${field.name}`}
                                    onCheckedChange={(state) => {
                                        if (state === true) {
                                            updateNodeData(id, { fields: [...nodeDataBuilderModifier.fields, field] });
                                        } else {
                                            updateNodeData(id, { fields: nodeDataBuilderModifier.fields.filter((dbm) => dbm.id != field.id) });
                                        }
                                    }}
                                />
                                <label
                                    htmlFor={`field-${field}-${field.name}`}
                                    className="text-xs medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {field.name}
                                </label>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div>No Field</div>
                )}
                <div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                title="help"
                                className="size-fit p-[2px] rounded-full"
                            >
                                <CircleHelp className="size-[10px] " />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="size-fit px-2 py-[6px]">
                            <p style={{ fontSize: '10px' }}>node untuk pick field dari schema</p>
                        </PopoverContent>
                    </Popover>
                </div>
            </BaseShape>
            <Handle
                onChange={(e) => {
                    console.log('e', e);
                }}
            />

            <Handle
                type="source"
                position="right"
                theme="green"
            />
        </>
    );
}
