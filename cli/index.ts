'use server';

import { z } from 'zod';

import { getErrorMessage } from '@/utils/get-error-message';
import { addTask, getTasksPagination } from '@/models/dev-task';
import { newTaskSchema, type newTask } from '@/schemas/dev-task';
const a = {};
export default a;

(async function main() {
    try {
        console.log('Im from CLI');
        // await testingTask();
        // testingValidationZod();
    } catch (error) {
        console.log(`CLI ERROR: ${getErrorMessage(error)}`, error);
    }
})();

function testingValidationZod() {
    const toNumber = z.number().or(z.string()).pipe(z.coerce.number());
    const validNumber = toNumber.safeParse(null);

    const toNumber2 = z.coerce.number();
    const validNumber2 = toNumber2.safeParse('56');

    const date = new Date('06-25-2024');
    console.log(date, typeof date);

    if (validNumber2.success) {
        console.log(validNumber2.data, typeof validNumber2.data);
        console.log(100);
        console.log('200');
    } else {
        console.log(validNumber2.error);
    }
}

async function testingTask() {
    const tasks = await getTasksPagination(4, undefined);
    console.log(tasks);
}
