import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    /* Handle, */ NodeToolbar,
    Position,
    useHandleConnections,
    useNodesData,
    useUpdateNodeInternals,
    type Node,
    type NodeProps,
} from '@xyflow/react';
import {
    ArrowDown,
    ArrowDown01Icon,
    ArrowDownIcon,
    ArrowLeftFromLineIcon,
    ChevronDown,
    FilePenLineIcon,
    Key,
    PlusIcon,
    SaveIcon,
    XIcon,
} from 'lucide-react';
import { TypeOf, z } from 'zod';

import { Cat, Dog, Fish, Rabbit, Turtle } from 'lucide-react';

import { textToPascalCase } from '@/utils/pretty-string';
import { cn } from '@/lib/classnames';
import { selectorDraw, shallow, useDrawStore } from '../../state/draw-store';
import { useReactFlow } from '../../hooks/react-flow';
import type { PartiallyRequired } from '@/types/utilities';

import { Handle } from './handle';
import { baseShapeVariants, baseShapeVariantsSchema } from '../base-shape';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const FieldTypePrimitive = ['string', 'boolean', 'number'] as const;

type FieldTypePrimitiveType = (typeof FieldTypePrimitive)[number];

const referenceName = z.string();

const FieldScema = z.array(
    z.object({
        id: z.string(),
        name: z.string(),
        types: z.array(z.enum(FieldTypePrimitive)).or(z.array(referenceName)) /* .or(z.array(z.string())) */,
        isRequired: z.boolean().default(true),
    })
);

export const nodeSchemabuilderInputTableDataSchema = z
    .object({
        title: z.string(),
        description: z.string().optional(),
        isBase: z.boolean().default(true),
        fields: FieldScema,
        references: z.array(
            z.object({
                name: z.string(),
                fields: FieldScema,
            })
        ),
    })
    .merge(baseShapeVariantsSchema.pick({ theme: true }));

const fieldNames = nodeSchemabuilderInputTableDataSchema.shape.fields.element.keyof();
export const fieldSchema = nodeSchemabuilderInputTableDataSchema.shape.fields.element;
export const fieldsSchema = nodeSchemabuilderInputTableDataSchema.pick({ fields: true });
export const _referenceSchema = nodeSchemabuilderInputTableDataSchema.pick({ references: true });
export const referenceSchema = nodeSchemabuilderInputTableDataSchema.shape.references;
type References = z.infer<typeof referenceSchema>;
export const _fields = nodeSchemabuilderInputTableDataSchema.shape.fields;
type Fields = z.infer<typeof fieldsSchema>;
export type Field = z.infer<typeof fieldSchema>;
type FieldName = z.infer<typeof fieldNames>;

type TableXXX = z.infer<typeof nodeSchemabuilderInputTableDataSchema> & {
    reference: {
        [keyName: string]: z.infer<typeof FieldScema>;
    };
};

export type NodeSchemabuilderInputTableData = z.infer<typeof nodeSchemabuilderInputTableDataSchema>;
export type NodeSchemabuilderInputTableProps = PartiallyRequired<Node<NodeSchemabuilderInputTableData, 'NodeSchemabuilderInputTable'>, 'type'>;

export function NodeSchemabuilderInputTable({ ...props }: NodeProps<NodeSchemabuilderInputTableProps>) {
    const { data, selected, id } = props;
    const { updateNodeData } = useDrawStore(selectorDraw, shallow);
    const { /*  updateNodeData, */ getNode } = useReactFlow();
    const updateNodeInternals = useUpdateNodeInternals();

    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    // const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(['react', 'angular']);
    // const [dataFieldEditable, setDataFieldEditable] = useState(transformArrayToObject(data.fields, 'id'));
    const [dataFieldEditable, setDataFieldEditable] = useState(data);

    const connections = useHandleConnections({ type: 'target' });

    useEffect(() => {
        if (connections && data.isBase === false) {
            const dataNodesInConnections = connections
                .map((conn) => conn.source)
                .reduce((acc, idInConnection) => {
                    const nodeData = getNode(idInConnection)?.data;
                    const dataValid = nodeSchemabuilderInputTableDataSchema.pick({ fields: true, title: true }).safeParse(nodeData);
                    if (dataValid.success) {
                        acc.push({
                            name: textToPascalCase(dataValid.data.title),
                            fields: dataValid.data.fields,
                        });
                    }

                    return acc;
                }, [] as References);
            updateNodeData(id, { references: dataNodesInConnections });
        } else {
            updateNodeData(id, { references: [] });
        }
    }, [connections, data.isBase, getNode, id, updateNodeData]);

    function handleAddRow() {
        const newData = {
            id: `field-${String(Date.now())}`,
            isRequired: true,
            name: '',
            types: ['string'],
        } satisfies NodeSchemabuilderInputTableData['fields'][number];

        setDataFieldEditable((prev) => ({ ...prev, fields: [...prev.fields, newData] }));
    }

    function handleDeleteRow(idField: string) {
        setDataFieldEditable((prev) => ({ ...prev, fields: prev.fields.filter((d) => d.id != idField) }));
    }

    function handleOnchange<Fn extends FieldName>(
        fieldName: Fn,
        idField: string,
        valueUpdated: Fn extends 'types' ? Field['types'][number] : Field[Fn]
    ) {
        /* 
        dataFieldEditable.current[field.name] = {
            ...dataFieldEditable.current[field.name],
            name: event.target.value,
        }; */

        /*
        setDataFieldEditable((prev) => {
            const newData = { ...prev[field.id] };
            newData.name = event.target.value;
            return {
                ...prev,
                [field.id]: { ...newData },
            };
        });
        */

        //? using map
        /*  setDataFieldEditable((prev) => {
            return prev.map((d) => {
                if (d.id === id) {
                    return { ...d, [fieldName]: textValue };
                }
                return d;
            });
        }); */

        //? using findIndex > Mutatate and Commit to State
        let newData = [...dataFieldEditable.fields]; // copy
        const indexField = newData.findIndex((d) => d.id === idField); // find index
        if (indexField === -1) return; // validation

        if (fieldName === 'types') {
            const OldTypes = newData[indexField].types;
            const isExist = OldTypes.some((oldType) => oldType === valueUpdated);
            if (isExist) {
                newData[indexField] = {
                    ...newData[indexField],
                    types: OldTypes.filter((oldType) => oldType !== valueUpdated), // delete element array by valueUpdated
                }; // mutatate value by fieldName: "type"
            } else {
                newData[indexField] = {
                    ...newData[indexField],
                    types: [...OldTypes, valueUpdated as FieldTypePrimitiveType], // add element array by valueUpdated
                }; // mutatate value by fieldName: "type"
            }
        } else {
            newData[indexField] = {
                ...newData[indexField],
                [fieldName]: valueUpdated,
            }; // mutatate value by fieldName
        }

        setDataFieldEditable((prev) => ({ ...prev, fields: newData })); // commit to state
    }

    function handleOnSave() {
        /* 
        if (!fields.current) return;
        updateLuffy(id, fields.current);
        const newFields = transformObjectToArray(dataFieldEditable, 'oldName').map((data) => {
            return {
                isRequired: data.isRequired,
                name: data.name,
                type: data.type,
            };
        });
        */
        /* 
        updateNodeData<'NodeSchemabuilderInputTable'>(id, {
            fields: newFields,
        });
         */
        updateNodeData<'NodeSchemabuilderInputTable'>(id, {
            title: dataFieldEditable.title,
            fields: dataFieldEditable.fields,
        });
        setIsEditMode(false);
    }

    return (
        <>
            <Card className={cn(baseShapeVariants({ theme: data.theme }), 'min-h-[100px] min-w-[100px] rounded-lg')}>
                <CardHeader className="p-3 space-y-1">
                    {isEditMode ? (
                        <Input
                            value={dataFieldEditable.title}
                            className="nodrag"
                            onChange={(event) => setDataFieldEditable((prev) => ({ ...prev, title: event.target.value }))}
                        />
                    ) : (
                        <CardTitle>{data.title}</CardTitle>
                    )}
                    <CardDescription className="text-xs">{data.description}</CardDescription>
                </CardHeader>
                <div className="px-3">
                    <div className="border-b pb-1 border-gray-300">
                        <div className="flex items-center py-1 space-x-2">
                            <label
                                htmlFor={`check-isbase-${id}`}
                                className="text-xs medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                is base?
                            </label>
                            <Checkbox
                                checked={Boolean(data.isBase)}
                                // checked={isBase}
                                className="size-3 [&_svg]:size-2"
                                id={`check-isbase-${id}`}
                                onCheckedChange={(state) => {
                                    updateNodeData<'NodeSchemabuilderInputTable'>(id, { isBase: Boolean(state) });
                                    updateNodeInternals(id);
                                }}
                            />
                        </div>
                    </div>
                </div>
                <CardContent className="p-3 pt-0">
                    {/* CRUD */}
                    <Table className="text-xs">
                        <TableCaption className="text-xs text-inherit">A list of properties schema {data.title}</TableCaption>
                        <TableHeader className="">
                            <TableRow className=" [&>th]:h-fit [&>th]:py-2 [&>th]:text-inherit">
                                <TableHead className="w-[100px]">Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">is Required?</TableHead>
                                {isEditMode && <TableHead className="text-right">Action</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody className="">
                            {dataFieldEditable.fields.map((field) => (
                                <TableRow
                                    className="[&>td]:h-fit [&>td]:py-2"
                                    key={field.id}
                                >
                                    {isEditMode ? (
                                        <>
                                            <TableCell>
                                                <Input
                                                    value={field.name}
                                                    className="nodrag"
                                                    name={field.name}
                                                    onChange={(event) => handleOnchange('name', field.id, event.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant="default">
                                                            {field.types.length ? (
                                                                <span className="text-xs font-normal">{field.types.join(' | ')}</span>
                                                            ) : (
                                                                <span>Select data type</span>
                                                            )}
                                                            <ChevronDown />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-80">
                                                        <div className="grid gap-4">
                                                            <div className="space-y-2">
                                                                <h4 className="font-medium leading-none">Types of {field.name}</h4>
                                                                <p className="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
                                                            </div>
                                                            <div className="grid gap-2">
                                                                {[...FieldTypePrimitive, ...data.references.map((d) => d.name)].map((type) => (
                                                                    <div
                                                                        key={type}
                                                                        className="grid grid-cols-6 items-center gap-4 [&>label]:col-span-2"
                                                                    >
                                                                        <Label htmlFor={`check-${type}-${field.name}`}>{type}</Label>
                                                                        <Checkbox
                                                                            className="nodrag"
                                                                            checked={field.types.some((t) => t === type)}
                                                                            onCheckedChange={(value) => handleOnchange('types', field.id, type)}
                                                                            id={`check-${type}-${field.name}`}
                                                                        />
                                                                        <Label htmlFor={`check-${type}-isarray-${field.name}`}>is Array?</Label>
                                                                        <Checkbox
                                                                            className="nodrag"
                                                                            id={`check-${type}-isarray-${field.name}`}
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center">
                                                    <Checkbox
                                                        className="nodrag"
                                                        checked={field.isRequired}
                                                        onCheckedChange={(value) => handleOnchange('isRequired', field.id, Boolean(value))}
                                                        id={`${field.id}-checkbox-isrequired`}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="nodrag size-7 p-2 "
                                                    title="delete row"
                                                    onClick={() => handleDeleteRow(field.id)}
                                                >
                                                    <XIcon className="size-4" />
                                                </Button>
                                            </TableCell>
                                        </>
                                    ) : (
                                        <>
                                            <TableCell className="font-medium">{field.name}</TableCell>
                                            <TableCell>{field.types.join(' | ')}</TableCell>
                                            <TableCell className="text-right">{String(field.isRequired)}</TableCell>
                                        </>
                                    )}
                                </TableRow>
                            ))}
                            {isEditMode && (
                                <TableRow
                                    data-action="add"
                                    className="hover:bg-transparent"
                                >
                                    <TableCell
                                        colSpan={4}
                                        className="text-right"
                                    >
                                        <Button
                                            size="sm"
                                            className="nodrag size-7 p-2 mr-2"
                                            title="add row"
                                            onClick={() => handleAddRow()}
                                        >
                                            <PlusIcon className="size-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <NodeToolbar
                isVisible={selected}
                position={Position.Top}
            >
                <div className="space-x-1">
                    {isEditMode === false ? (
                        <Button
                            size="icon"
                            className="h-fit w-fit p-[5px] text-xs"
                            title="edit"
                            onClick={() => setIsEditMode((prev) => !prev)}
                        >
                            <FilePenLineIcon className="size-4" />
                        </Button>
                    ) : (
                        <>
                            <Button
                                size="icon"
                                className="h-fit w-fit p-[5px] text-xs"
                                title="save"
                                onClick={() => handleOnSave()}
                            >
                                <SaveIcon className="size-4" />
                            </Button>
                            <Button
                                size="icon"
                                className="h-fit w-fit p-[5px] text-xs"
                                title="cancel"
                                onClick={() => {
                                    // console.log('3', dataFieldEditable.current);
                                    setDataFieldEditable(data);
                                    setIsEditMode(false);
                                }}
                            >
                                <ArrowLeftFromLineIcon className="size-4" />
                            </Button>
                        </>
                    )}
                </div>
            </NodeToolbar>
            {data.isBase === true ? null : (
                <Handle
                    // id={`hdl-trgt-${id}`}
                    type="target"
                />
            )}
            <Handle
                // id={`hdl-src-${id}`}
                type="source"
                position="right"
                theme="green"
            />
        </>
    );
}

type TableCrudProps = {
    idNode: NodeSchemabuilderInputTableProps['id'];
    // title: NodeSchemabuilderInputTableData['title'];
    dataField: NodeSchemabuilderInputTableData['fields'];
    isEditMode: boolean;
    onSave: (dataField: NodeSchemabuilderInputTableData['fields']) => void;
};

// function TableCrud({ idNode, dataField, isEditMode, onSave }: TableCrudProps) {return ();}
