import { getStore, type WorkspaceId, type GitTopicFlowState, updateStore } from '../lib/commit-topic-flow-idb';

export async function getAllWorkspace() {
    return await getStore();
}

export function getAllWorkspaceSync(callback: (store: GitTopicFlowState) => void) {
    getAllWorkspace()
        .then((store) => callback(store))
        .catch((err) => {
            throw err;
        });
}

export async function getWorkspace(id: WorkspaceId) {
    const allWorkspace = await getStore();
    const exist = allWorkspace[id] as GitTopicFlowState[string] | undefined;
    if (exist) {
        return exist;
    } else {
        return {
            edge: [],
            node: [],
        } satisfies GitTopicFlowState[string];
    }
}

export async function getWorkspaceIds() {
    const allWorkspace = await getStore();
    return Object.keys(allWorkspace);
}

export async function addWorkspace(workspace: { id: WorkspaceId } & GitTopicFlowState[string]) {
    return await updateStore((oldWorkspace) => {
        const ids = Object.keys(oldWorkspace);
        const idIsExist = ids.some((id) => id === workspace.id);
        if (idIsExist) {
            console.warn(`cannot adding workspace with id: ${workspace.id}, because the id is exist`);
            return oldWorkspace;
        } else {
            return { ...oldWorkspace, [workspace.id]: { node: workspace.node, edge: workspace.edge } };
        }
    });
}

export async function updateWorkspace(workspace: { id: WorkspaceId } & GitTopicFlowState[string]) {
    return await updateStore((oldWorkspace) => {
        const ids = Object.keys(oldWorkspace);
        const idIsExist = ids.some((id) => id === workspace.id);
        if (idIsExist) {
            return { ...oldWorkspace, [workspace.id]: { node: workspace.node, edge: workspace.edge } } satisfies GitTopicFlowState;
        } else {
            console.warn(`cannot update workspace with id: ${workspace.id}, because the id not is exist`);
            return oldWorkspace;
        }
    });
}

export async function addOrUpdateWorkspace(workspace: { id: WorkspaceId } & GitTopicFlowState[string]) {
    const ids = await getWorkspaceIds();
    const idIsExist = ids.some((id) => id === workspace.id);
    let isSucces = false;
    if (idIsExist) {
        isSucces = await updateWorkspace({ id: workspace.id, node: workspace.node, edge: workspace.edge });
    } else {
        isSucces = await addWorkspace({ id: workspace.id, node: workspace.node, edge: workspace.edge });
    }
    return isSucces;
}

export async function deleteWorkspace(id: WorkspaceId) {
    return await updateStore((oldWorkspace) => {
        const ids = Object.keys(oldWorkspace);
        const idIsExist = ids.some((idWorkspace) => idWorkspace === id);
        if (idIsExist) {
            // implement delete key by id
            const { [id]: removedWorkspace, ...newWorkspace } = oldWorkspace;
            return newWorkspace;
        } else {
            console.warn(`cannot delete workspace with id: ${id}, because the id not is exist`);
            return oldWorkspace;
        }
    });
}
