'use server';

import path from 'path';
import { cwd } from 'process';
import { writeFile, readFile } from 'fs/promises';

import { z } from 'zod';

import { getErrorMessage } from '@/utils/get-error-message';
import { addTask, getTasksPagination } from '@/models/dev-task';
import { wait } from '@/utils/wait';
// import { getImportPackage } from '../playground/get-import-package';
import { inputNewTaskSchema, type InputNewTask } from '@/schemas/dev-task';
import { writeDataBuilding, readDataBuilding } from '@/app/dev/research/coc/queen-charge/_party/actions/building';
import {
    readBuildingOriginal,
    // downloadImage,
    main as buildingPreparationMain,
} from '@/app/dev/research/coc/queen-charge/_party/actions/building-preparation';
import { makeSource } from 'contentlayer/source-files';
import {
    comparePackageJson,
    getDiffFile,
    getFilesFromCommit,
    // getHistoryCommitOfFile,
    // getHistoryCommitOfFile2,
    getModifiedFiles,
    getUntrackedAndModifiedFiles,
    getUntrackedFiles,
    readFileOnLastCommit,
} from '@/server/git-command';
import { nodeShapeDataSchema } from '@/app/dev/research/flow/draw-schema-flow/_party/components/flow/node-shape';
import { generatePathTree } from '@/utils/transform-path';
import { getPathFileCurrentProject } from '@/utils/get-path-file-current-project';
const a = {};
export default a;

(async function main() {
    try {
        console.log('Im from CLI');
        // await testingTask();
        // testingValidationZod();
        // await buildingPreparationMain();
        // await fetchFadom();
        // testZodVariantThemeFlow();
        // testPathTree();
        // testFetchImageAndSaveAsFile();

        // console.log(await getImportPackage());
        // console.log(await getHistoryCommitOfFile(path.join(cwd(), 'tsconfig.json')));
        // console.log(await getFilesFromCommit('82fc3ff8e3aab9a431a09d34ef513995a72211af'));
        // console.log(await readFileOnLastCommit(path.join(cwd(), 'src/components/layout/data-nav.ts')));
        // console.log(await comparePackageJson());
        // console.log('getFileCurrentProject', await getPathFileCurrentProject());
        // console.log('win32', path.join(cwd(), 'src/lib/redux/root-reducer.ts'));
        // console.log('possix', path.posix.join(cwd(), 'src/lib/redux/root-reducer.ts'));
        // console.log('getHistoryCommitOfFile', await getHistoryCommitOfFile2(path.posix.join(cwd(), 'src/lib/redux/root-reducer.ts')));
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

function testZodVariantThemeFlow() {
    const node = {
        text: 's',
        theme: 'red',
        shapeType: 'square',
        abc: 'ss',
    };
    // gunakan passthrough agar properti object selain yang sudah didefinisikan dizod bisa masuk
    // const dataValid = nodeShapeDataSchema.passthrough().safeParse(node);
    const number = z.coerce.number();
    const dataValid = number.safeParse(node);
    if (!dataValid.success) {
        console.error('testZodVariantThemeFlow, faild', dataValid.error.flatten());
        return;
    } else {
        console.log('testZodVariantThemeFlow, sukses', dataValid.data);
    }
}

async function testPathTree() {
    const filePaths = await getUntrackedAndModifiedFiles();
    const filePathTrees = generatePathTree(filePaths.slice(100, 107));
    console.log(filePathTrees);
}

async function testFetchImageAndSaveAsFile() {
    // document.querySelector("div.jWMSo").querySelectorAll("img")[1].src // on https://unsplash.com
    const imageUrl =
        'https://images.unsplash.com/photo-1604646357333-ecb1f24b2d21?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D';
    const imageName = 'koran.jpeg';
    const imagePath = path.join(cwd(), 'public/images', imageName);

    const res = await fetch(imageUrl, {
        method: 'GET',
    });

    const bytes = await res.arrayBuffer();
    const buffer = new Uint8Array(bytes);
    await writeFile(imagePath, buffer);
    console.log(`open ${imagePath} to see the downloaded file`);
}
