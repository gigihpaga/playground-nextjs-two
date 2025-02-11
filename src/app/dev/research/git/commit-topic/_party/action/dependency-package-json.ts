'use server';
import { comparePackageJson, type ComparePackageJson } from '@/server/git-command';

export type DependencyInPackageJson = ComparePackageJson['dependencies'][number];

export async function getDependencyPackageJson() {
    return await comparePackageJson();
}
