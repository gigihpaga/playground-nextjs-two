import { NextResponse, type NextRequest } from 'next/server';

import { getTasks, getTasksPagination, addTask, updateTask, deleteTask } from '@/models/dev-task';
import { inputNewTaskSchema, type InputNewTask, inputUpdateTaskSchema, type InputUpdateTask, inputDeleteTaskSchema } from '@/schemas/dev-task';

import { standartErrorApiResponse } from '@/utils/standart-error-api-response';
import type { PrismaError, ZodError, UnkowError } from '@/utils/serialize-error-message';

type NonUndefined<T> = T extends undefined ? never : T;
export type ApiGetTasks = Awaited<ReturnType<typeof getTasksPagination>>;
export type ApiAddTask = Awaited<ReturnType<typeof addTask>>;
export type ApiUpdateTask = Awaited<ReturnType<typeof updateTask>>;
export type ApiDeleteTask = Awaited<ReturnType<typeof deleteTask>>;
export type ApiErrorResponse = PrismaError | ZodError | UnkowError;
export type ApiAddTaskResponse = NonUndefined<Awaited<ReturnType<typeof POST>>>;
export type ApiUpdateTaskResponse = NonUndefined<Awaited<ReturnType<typeof PATCH>>>;
export type ApiDeleteTaskResponse = NonUndefined<Awaited<ReturnType<typeof DELETE>>>;

export async function GET(req: NextRequest): Promise<NextResponse<ApiGetTasks | ApiErrorResponse>> {
    try {
        const { searchParams } = new URL(req.url),
            pagenum = searchParams.get('pgnum'),
            pagetake = searchParams.get('pgtake');

        const pagenumValid = !pagenum || isNaN(Number(pagenum)) ? undefined : Number(pagenum),
            pagetakeValid = !pagetake || isNaN(Number(pagetake)) ? undefined : { take: Number(pagetake) };

        const tasks = await getTasksPagination(pagenumValid, pagetakeValid);
        return NextResponse.json(tasks);
    } catch (error) {
        return standartErrorApiResponse(error);
    }
}

export async function POST(req: NextRequest): Promise<NextResponse<ApiAddTask | ApiErrorResponse>> {
    try {
        const { searchParams } = new URL(req.url);
        const data = await req
            .json()
            .then((d: unknown) => d)
            .catch(() => undefined);

        const dataValid = inputNewTaskSchema.parse(data);

        const tasks = await addTask(dataValid);
        return NextResponse.json(tasks);
    } catch (error) {
        return standartErrorApiResponse(error);
    }
}

export async function PATCH(req: NextRequest): Promise<NextResponse<ApiUpdateTask | ApiErrorResponse>> {
    try {
        const data = await req
            .json()
            .then((d: unknown) => d)
            .catch(() => undefined);

        const dataValid = inputUpdateTaskSchema.parse(data);

        const tasks = await updateTask(dataValid);
        return NextResponse.json(tasks);
    } catch (error) {
        return standartErrorApiResponse(error);
    }
}

export async function DELETE(req: NextRequest): Promise<NextResponse<ApiDeleteTask | ApiErrorResponse>> {
    try {
        const data = await req
            .json()
            .then((d: unknown) => d)
            .catch(() => undefined);

        const dataValid = inputDeleteTaskSchema.parse(data);

        const tasks = await deleteTask(dataValid);
        return NextResponse.json(tasks);
    } catch (error) {
        return standartErrorApiResponse(error);
    }
}
