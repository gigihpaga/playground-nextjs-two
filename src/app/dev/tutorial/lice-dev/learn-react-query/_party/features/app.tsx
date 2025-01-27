'use client';

import { FormEvent, useState, useEffect } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon, SquarePenIcon, Trash2Icon, XIcon } from 'lucide-react';

import {
    InputDeleteTask,
    InputUpdateTask,
    inputDeleteTaskSchema,
    inputNewTaskSchema,
    inputUpdateTaskSchema,
    type InputNewTask,
} from '@/schemas/dev-task';
import type {
    ApiGetTasks,
    ApiAddTask,
    ApiAddTaskResponse,
    ApiUpdateTaskResponse,
    ApiUpdateTask,
    ApiDeleteTaskResponse,
    ApiDeleteTask,
} from '@/app/api/dev/task/route';
import { cn } from '@/lib/classnames';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function App() {
    return (
        <section className="grid grid-cols-3 gap-x-8 gap-y-4 py-4">
            <FormTaskAdd />
            <TableTask />
        </section>
    );
}

function FormTaskAdd() {
    const queryClient = useQueryClient();
    const addTaskMutation = useMutation({
        mutationFn: addTask,
        onSuccess() {
            /**
             * bisa di taruh disini atau bisa juga ditaruh form > addTaskMutation.mutate
             */
            // queryClient.invalidateQueries({ queryKey: ['lice-dev-task'] });
        },
    });

    function handleOnSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.target as HTMLFormElement; // atau kalo gak mau pakai as gunakan e.currentTarget daripada e.target
        const formData = new FormData(form);
        const task = formDataNormalize(formData);
        const taskValid = inputNewTaskSchema.safeParse(task);

        if (taskValid.success) {
            void addTaskMutation.mutate(taskValid.data, {
                onSuccess() {
                    form.reset();
                    queryClient.invalidateQueries({ queryKey: ['lice-dev-task'] });
                },
            });
        } else {
            console.error(`taskValid Error:\n${taskValid.error.issues.map((err) => `${err.path[0].toString()} - ${err.message}`).join('\n')}`);
            window.alert(taskValid.error.issues.map((err) => `${err.path[0].toString()} - ${err.message}`).join('\n'));
        }
    }

    return (
        <FormTask
            key="form-task-add"
            handleOnSubmit={handleOnSubmit}
            isPending={addTaskMutation.isPending}
        />
    );
}

function TableTask() {
    const [pageNum, setPageNum] = useState(1);
    const queryClient = useQueryClient();
    const { data, isPending, isFetching, error } = useQuery({
        queryKey: ['lice-dev-task', pageNum],
        queryFn: () => getTasks(pageNum),
        // refetchInterval: 1000 * 5, // 3 detik
        // staleTime: 1000 * 3,
        // gcTime: 1000 * 3, // history query bertahan selama 3 detik, setelah 3 detik history query akan di hapus dari cache
    });
    const deleteTaskMutation = useMutation({
        mutationFn: deleteTask,
    });
    return (
        <div
            className="col-span-2 _h-[80vh] border flex flex-col p-6 rounded-xl"
            aria-description="table task"
        >
            <h1 className="text-xl mb-4 font-semibold">List Tasks</h1>
            <div className="flex flex-col flex-1 ">
                <div className="h-[60vh] overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Id</TableHead>
                                <TableHead>Collection Id</TableHead>
                                <TableHead>Content</TableHead>
                                <TableHead>Expires At</TableHead>
                                <TableHead>Done</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isPending || isFetching ? (
                                <TableRow>
                                    {Array.from({ length: 5 }).map((_, idx) => (
                                        <TableCell key={idx}>
                                            <Skeleton className="w-16 h-4 bg-zinc-300 rounded-md" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ) : error ? (
                                <TableRow className="text-destructive">
                                    <TableCell>{error.message}</TableCell>
                                </TableRow>
                            ) : (
                                data?.data?.map((task) => (
                                    <TableRow key={task.id}>
                                        <TableCell>{task.id}</TableCell>
                                        <TableCell>{task.collectionId}</TableCell>
                                        <TableCell>{task.content}</TableCell>
                                        <TableCell>{task.expiresAt ? format(task.expiresAt, 'dd/MM/yyyy') : ''}</TableCell>
                                        <TableCell>{task.done.toString()}</TableCell>
                                        <TableCell className="space-x-1">
                                            <DialogFormTaskUpdate
                                                task={{
                                                    id: task.id,
                                                    content: task.content,
                                                    expiresAt: task.expiresAt ?? undefined,
                                                }}
                                            />

                                            <Button
                                                size="icon"
                                                className="size-5"
                                                onClick={() => {
                                                    //
                                                    const taskValid = inputDeleteTaskSchema.safeParse({ id: task.id });

                                                    if (taskValid.success) {
                                                        deleteTaskMutation.mutate(taskValid.data, {
                                                            onSuccess() {
                                                                queryClient.invalidateQueries({ queryKey: ['lice-dev-task'] });
                                                            },
                                                        });
                                                    } else {
                                                        console.error(
                                                            `taskValid Error:\n${taskValid.error.issues.map((err) => `${err.path[0].toString()} - ${err.message}`).join('\n')}`
                                                        );
                                                    }
                                                    //
                                                }}
                                            >
                                                <Trash2Icon className="size-3" />
                                            </Button>
                                        </TableCell>
                                        {/*
                                        <TableCell>
                                            {new Intl.NumberFormat('id', {
                                                style: 'currency',
                                                currency: 'idr',
                                                maximumFractionDigits: 0,
                                            }).format(task.price)}
                                        </TableCell>
                                         */}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
                <Pagination className="justify-end _self-end mt-4">
                    <PaginationContent>
                        <PaginationItem>
                            <Button
                                size="icon"
                                className="size-8"
                                onClick={() => setPageNum((prev) => prev - 1)}
                                disabled={pageNum === 1}
                            >
                                <ChevronLeftIcon className="size-4" />
                            </Button>
                        </PaginationItem>
                        <PaginationItem>
                            {data?.metadata.totalPage ? (
                                <div className="space-x-1">
                                    {Array.from({ length: data.metadata.totalPage }).map((_, idx) => (
                                        <Button
                                            size="sm"
                                            disabled={isPending || isFetching}
                                            onClick={() => setPageNum(idx + 1)}
                                            className={cn(idx + 1 === pageNum && 'text-purple-500 underline font-bold', 'select-none')}
                                            key={idx + 1}
                                        >
                                            {idx + 1}
                                        </Button>
                                    ))}
                                </div>
                            ) : null}
                        </PaginationItem>
                        <PaginationItem>
                            <Button
                                size="icon"
                                className="size-8"
                                onClick={() => setPageNum((prev) => prev + 1)}
                                disabled={!data?.metadata.hasNextPage}
                            >
                                <ChevronRightIcon className="size-4" />
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}

type DialogFormTaskUpdateProps = {
    task: InputUpdateTask;
};

function DialogFormTaskUpdate({ task }: DialogFormTaskUpdateProps) {
    const queryClient = useQueryClient();
    const updateTaskMutation = useMutation({
        mutationFn: updateTask,
    });

    function handleOnSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.target as HTMLFormElement; // atau kalo gak mau pakai as gunakan e.currentTarget daripada e.target
        const formData = new FormData(form);
        formData.append('id', task.id.toString());
        const formTask = formDataNormalize(formData);
        const taskValid = inputUpdateTaskSchema.safeParse(formTask);

        if (taskValid.success) {
            updateTaskMutation.mutate(taskValid.data, {
                onSuccess() {
                    form.reset();
                    queryClient.invalidateQueries({ queryKey: ['lice-dev-task'] });
                },
            });
        } else {
            console.error(`taskValid Error:\n${taskValid.error.issues.map((err) => `${err.path[0].toString()} - ${err.message}`).join('\n')}`);
            window.alert(taskValid.error.issues.map((err) => `${err.path[0].toString()} - ${err.message}`).join('\n'));
        }
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    size="icon"
                    className="size-5"
                >
                    <SquarePenIcon className="size-3" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <div className="flex justify-end">
                    <AlertDialogCancel
                        size="icon"
                        variant="outline"
                        className="size-7 "
                    >
                        <XIcon className="size-4" />
                    </AlertDialogCancel>
                </div>
                <FormTask
                    key="form-task-edit"
                    task={task}
                    handleOnSubmit={handleOnSubmit}
                    isPending={updateTaskMutation.isPending}
                />
            </AlertDialogContent>
        </AlertDialog>
    );
}

type FormTaskProps = {
    task?: InputUpdateTask;
    handleOnSubmit: (e: FormEvent<HTMLFormElement>) => void;
    isPending: boolean;
};

function FormTask({ task, handleOnSubmit, isPending }: FormTaskProps) {
    return (
        <Card
            className="h-max"
            aria-description="form task"
        >
            <CardHeader>
                <CardTitle>{task ? 'Edit' : 'Add'} Task</CardTitle>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={(e) => handleOnSubmit(e)}
                    className="space-y-4"
                >
                    <div className="space-y-2">
                        <Label htmlFor="content">Content :</Label>
                        <Input
                            type="text"
                            id="content"
                            name="content"
                            placeholder="learning react query"
                            defaultValue={task?.content}
                        />
                    </div>
                    {task ? null : (
                        <div className="space-y-2">
                            <Label htmlFor="collectionId">Collection Id :</Label>
                            <Input
                                type="number"
                                min={1}
                                id="collectionId"
                                name="collectionId"
                                placeholder="99"
                                defaultValue={undefined}
                            />
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="price">Expires At :</Label>
                        <Input
                            defaultValue={task?.expiresAt ? format(task.expiresAt, 'yyyy-MM-dd') : undefined}
                            type="date"
                            id="expiresAt"
                            name="expiresAt"
                        />
                    </div>
                    {/* 
                    <div className="space-y-2">
                        <Label htmlFor="category">Category :</Label>
                        <Select name="category">
                            <SelectTrigger>
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="makanan">Makanan</SelectItem>
                                <SelectItem value="minuman">Minuman</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     */}
                    <div className="text-end">
                        <Button
                            type="submit"
                            disabled={isPending}
                        >
                            Submit
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

async function validationResponseApi(response: Response) {
    if (!response.ok) {
        const errorMessageApi = await response
            .json()
            .then((resJson) => {
                if (typeof resJson === 'object' && 'message' in resJson) {
                    return `fail to fetching taskss: ${resJson.message}`;
                } else {
                    return undefined;
                }
            })
            .catch(() => undefined);
        if (errorMessageApi) {
            throw Error(errorMessageApi);
        } else {
            throw Error(`fail to get tasks: ${response.status} - ${response.statusText}`);
        }
    }
}

function formDataNormalize(dataForm: FormData) {
    /**
     * input    => {content: 'learning react', collectionId: '1', expiresAt: ''}
     * output   => {content: 'learning react', collectionId: '1'}
     */
    return Object.entries(Object.fromEntries(dataForm)).reduce(
        (acc, current, idx, data) => {
            if (current[1]) {
                return { ...acc, [current[0]]: current[1] };
            } else {
                return { ...acc };
            }
        },
        // eslint-disable-next-line no-undef
        {} as Record<string, FormDataEntryValue>
    );
}

async function getTasks(pageNum: number) {
    const response = await fetch(`/api/dev/task?pgnum=${pageNum}`, { method: 'GET' });
    await validationResponseApi(response);
    return (await response.json()) as ApiGetTasks;
}

async function addTask(task: InputNewTask) {
    const response = (await fetch('/api/dev/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
    })) as ApiAddTaskResponse;

    if (response.ok) {
        return (await response.json()) as ApiAddTask;
    }
}

async function updateTask(task: InputUpdateTask) {
    const response = (await fetch('/api/dev/task', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
    })) as ApiUpdateTaskResponse;

    if (response.ok) {
        return (await response.json()) as ApiUpdateTask;
    }
}
async function deleteTask(task: InputDeleteTask) {
    const response = (await fetch('/api/dev/task', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
    })) as ApiDeleteTaskResponse;

    if (response.ok) {
        return (await response.json()) as ApiDeleteTask;
    }
}
