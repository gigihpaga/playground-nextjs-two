'use client';
import React, { useState } from 'react';
import { type NodeTypes, type Node, useReactFlow } from '@xyflow/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReloadIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/classnames';
import { createCommitedSchema, type createCommitedSchemaType } from '../schemas/commited';

import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

type CreateCommitedDialogProps = {
    setNodes2: React.Dispatch<React.SetStateAction<Node[]>>;
};

export function CreateCommitedDialog({ setNodes2 }: CreateCommitedDialogProps) {
    const [open, setOpen] = useState(false);
    const { addNodes, setNodes, getNode, getNodes } = useReactFlow();

    const form = useForm<createCommitedSchemaType>({
        resolver: zodResolver(createCommitedSchema),
        defaultValues: {
            message: '',
        },
    });

    // using setNode() from useReactFlow() it not works 🚫
    function handleOnSubmit(data: createCommitedSchemaType) {
        // alert(JSON.stringify(data, null, 4));
        const location = Math.random() * 1000;

        const nodeGroup = getNode('5-group-c');
        if (nodeGroup) {
            const nodeGroups = getNodes().filter((node) => node.type?.includes('Group'));
            setNodes(nodeGroups);
            let nodeChilds = getNodes().filter((node) => !node.type?.toLowerCase().includes('group'));
            addNodes(nodeChilds);
            // nodeChilds.push(newNode);
            const finalNodes = [...nodeGroups, ...nodeChilds];

            addNodes({
                id: `${nodeGroups.length + nodeChilds.length + 1}-commited`,
                data: { message: data.message },
                type: 'CardCommited',
                position: { x: nodeGroup.position.x + 10, y: nodeGroup.position.y + 10 },

                parentId: '5-group-c',
                // extent: 'parent',
            });
            // setNodes(finalNodes);
        }

        setOpen(false);
    }

    // using setNode() from useReactFlow() it not works 🚫
    function handleOnSubmit2(data: createCommitedSchemaType) {
        const GROUP_ID = '1-group-c';
        const nodeGroup = getNode(GROUP_ID);
        const allNodes = getNodes();

        if (nodeGroup) {
            console.log(`${GROUP_ID}  ketemu`);
            addNodes({
                id: `${allNodes.length + 1}-new-data`,
                data: { message: data.message },
                type: 'CardCommited',
                position: { x: nodeGroup.position.x + 10, y: nodeGroup.position.y + 10 },
                parentId: GROUP_ID,
                // extent: 'parent',
            });
        } else {
            console.log(`${GROUP_ID} TIDAK ketemu`);
        }
    }

    // using setNode() from useReactFlow() it not works 🚫
    function handleOnSubmit3(data: createCommitedSchemaType) {
        const GROUP_ID = '2-group-commited';
        setNodes((prevs) => {
            const group = prevs.find((node) => node.id === GROUP_ID);
            if (group) {
                return [
                    ...prevs,
                    {
                        id: `${prevs.length + 1}-new-data`,
                        data: { message: data.message },
                        type: 'CardCommited',
                        position: { x: 0, y: 0 },
                        parentNode: GROUP_ID,
                        extent: 'parent',
                    },
                ];
            } else {
                console.error(`handleOnSubmit3: ${GROUP_ID} not found`);
                return prevs;
            }
        });
        setOpen(false);
    }

    /**
     * using setNode() from useNodesState() it works ✅
     * jika aplikasi flow ada nesting (Sub Flows),
     * harus menggunakan setNodes() dari useNodesState(),
     * kalo menggunakan setNodes() dari useReactFlow() akan ada error, "parrentId not found"
     *
     * itu terjadi karena instance yang berbeda, jadi nilai nodes akan berbeda juga
     * useReactFlow() digunakan untuk "uncontrolled" flow, digunakan bersama <ReactFlowProvider/>
     * useNodesState() digunakan untuk "controlled" flow, cukup digunakan bersama <ReactFlow/>
     *
     * tapi jika aplikasi tidak nesting (sub-flow), setNodes() dari useReactFlow() tetap masih bisa digunakan
     */
    function handleOnSubmit4(data: createCommitedSchemaType) {
        const GROUP_ID = '2-group-commited';
        setNodes2((prevs) => {
            const group = prevs.find((node) => node.id === GROUP_ID);
            if (group) {
                return [
                    ...prevs,
                    {
                        id: `${prevs.length + 1}-new-data`,
                        data: { message: data.message },
                        type: 'CardCommited',
                        position: { x: 0, y: 0 },
                        parentId: GROUP_ID,
                        extent: 'parent',
                    },
                ];
            } else {
                console.error(`handleOnSubmit4: ${GROUP_ID} not found`);
                return prevs;
            }
        });
        setOpen(false);
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(state) => {
                setOpen(state);
                form.reset();
            }}
        >
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    className="h-7"
                >
                    Add commited
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex gap-2">Add commited message</DialogTitle>
                    <DialogDescription>Add a task to your collection. You can add as many tasks as you want to a collection.</DialogDescription>
                </DialogHeader>
                <div className="gap-4 py-4">
                    <Form {...form}>
                        <form
                            className="space-y-4 flex flex-col"
                            onSubmit={form.handleSubmit((d) => handleOnSubmit4(d))}
                        >
                            <FormField
                                name="message"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                rows={5}
                                                placeholder="Task content here"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </div>
                <DialogFooter>
                    <Button
                        disabled={form.formState.isSubmitting}
                        size="sm"
                        onClick={form.handleSubmit((d) => handleOnSubmit4(d))}
                    >
                        Confirm
                        {form.formState.isSubmitting && <ReloadIcon className="size-4 animate-spin ml-2" />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
