'use server';

import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { cwd } from 'process';

import { getErrorMessage } from '@/utils/get-error-message';
import { DATA_BUILDING_PATH, readJsonFile, writeJsonFile } from './building-preparation';
import { DataBuildings } from '../types';

export async function readDataBuilding() {
    const data = await readJsonFile<DataBuildings>(DATA_BUILDING_PATH);
    return data;
}

export async function writeDataBuilding(data: DataBuildings) {
    await writeJsonFile(DATA_BUILDING_PATH, data);
}
