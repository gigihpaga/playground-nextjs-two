import type { RootState } from '@/lib/redux/store';
import { createSlice, createSelector, current, nanoid, type PayloadAction } from '@reduxjs/toolkit';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

import { type FileGit } from '@/utils/transform-path';
import { type UntrackedAndModifiedFile } from '@/server/git-command';

export type Topic = {
    id: string;
    title: string;
    description?: string;
    isCommited: boolean;
    color: `#${string}`;
    files: FileGit<UntrackedAndModifiedFile>[];
};

export type Dependency = {
    id: string;
    title: string;
    isNew: boolean;
};

export type WorkspaceTopic = {
    id: string;
    title: string;
    description?: string;
    createAt: string /* Date */;
    topics: Topic[];
    dependencys: Dependency[];
};

export type CommitTopicCollectionState = {
    workspaceTopics: WorkspaceTopic[];
    workspaceTopicActive: null | WorkspaceTopic['id'];
};

const initialState: CommitTopicCollectionState = {
    workspaceTopics: [
        // {
        //     id: 'workspace-1a',
        //     title: 'test workspace',
        //     description: 'ini workpace 1',
        //     createAt: '14/10/2024',
        //     topics: [
        //         { id: 'topic-1', title: 'topic satu', description: 'ini topic satu', color: '#0f0', files: [] },
        //         { id: 'topic-2', title: 'topic dua', description: 'ini topic dua', color: '#10f', files: [] },
        //         { id: 'topic-3', title: 'topic tiga', description: 'ini topic tiga', color: '#e79718', files: [] },
        //     ],
        // },
    ],
    workspaceTopicActive: /* 'workspace-1a' */ null,
};

function sortedArray<T extends Record<string, unknown>, K extends keyof T>(arr: T[], key: K, opts?: Intl.CollatorOptions) {
    return arr.slice().sort((a, b) => String(a[key]).localeCompare(String(b[key]), undefined, opts));
}

const gitCommitTopicCollectionSlice = createSlice({
    name: 'git:commit-topic-collection',
    initialState: initialState,
    reducers: {
        //* Workspace
        addWorkspace: {
            reducer: (state, action: PayloadAction<WorkspaceTopic>) => {
                state.workspaceTopics.push(action.payload);
            },
            prepare: (params: Pick<WorkspaceTopic, 'title' | 'description'> & { id?: string }) => {
                // const dateObj = new Date();
                // const date1 = dateObj.toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'medium', hour12: false });
                const date2 = format(new Date(), 'dd/MM/yyyy, HH:mm:ss');
                const { id, title, description } = params;
                const newData: WorkspaceTopic = {
                    id: id ? id : 'CTC_' + nanoid(),
                    topics: [],
                    dependencys: [],
                    createAt: date2,
                    title: title,
                    description: description,
                };
                return { payload: newData };
            },
        },
        updateWorkspace: (state, action: PayloadAction<{ data: WorkspaceTopic; workspaceId: WorkspaceTopic['id'] }>) => {
            const workspaceIndex = state.workspaceTopics.findIndex((workspace) => workspace.id === action.payload.workspaceId);

            if (workspaceIndex !== -1) {
                state.workspaceTopics[workspaceIndex] = {
                    ...state.workspaceTopics[workspaceIndex],
                    ...action.payload.data,
                };
            }
        },
        deleteWorkspace: (state, action: PayloadAction<{ workspaceId: WorkspaceTopic['id'] }>) => {
            const newCommitTopicCollection = state.workspaceTopics.filter((commitTopic) => commitTopic.id !== action.payload.workspaceId);
            return {
                ...state,
                workspaceTopics: newCommitTopicCollection,
            } satisfies CommitTopicCollectionState;
        },
        setWorkspaceActive: (state, action: PayloadAction<WorkspaceTopic['id'] | null>) => {
            return {
                ...state,
                workspaceTopicActive: action.payload,
            } satisfies CommitTopicCollectionState;
        },
        //? Commit Topic
        addTopic: {
            reducer: (state, action: PayloadAction<{ data: Topic; CommitTopicCollectionId: WorkspaceTopic['id'] }>) => {
                const collectionIndex = state.workspaceTopics.findIndex((ctc) => ctc.id === action.payload.CommitTopicCollectionId);
                if (collectionIndex !== -1) {
                    state.workspaceTopics[collectionIndex].topics.push(action.payload.data);
                }
            },
            prepare: (CommitTopicCollectionId: WorkspaceTopic['id']) => {
                const newData: Topic = {
                    id: 'T_' + nanoid(),
                    title: 'new topic',
                    color: '#ff0000',
                    isCommited: false,
                    files: [],
                };
                return { payload: { data: newData, CommitTopicCollectionId: CommitTopicCollectionId } };
            },
        },
        importTopic: (state, action: PayloadAction<{ data: Topic | Topic[]; commitTopicCollectionId: WorkspaceTopic['id'] }>) => {
            const { data, commitTopicCollectionId } = action.payload;
            const workspace = state.workspaceTopics.find((w) => w.id === state.workspaceTopicActive);
            const _workspace = state.workspaceTopics.find((w) => w.id === commitTopicCollectionId);
            if (_workspace) {
                if (Array.isArray(data)) {
                    _workspace.topics = data;
                } else {
                    _workspace.topics.push(data);
                }
            }
        },
        updateTopic: (state, action: PayloadAction<{ data: Topic; topicId: Topic['id'] }>) => {
            const workspaceIndex = state.workspaceTopics.findIndex((ctc) => ctc.id === state.workspaceTopicActive);
            if (workspaceIndex !== -1) {
                const topicIndex = state.workspaceTopics[workspaceIndex].topics.findIndex((t) => t.id === action.payload.topicId);
                if (topicIndex !== -1) {
                    state.workspaceTopics[workspaceIndex].topics[topicIndex] = {
                        ...state.workspaceTopics[workspaceIndex].topics[topicIndex],
                        ...action.payload.data,
                    };
                }
            }
            /*//* optimise
                const { data, topicId } = action.payload;
                const workspace = state.workspaceTopics.find((w) => w.id === state.workspaceTopicActive);

                if (workspace) {
                    const topicIndex = workspace.topics.findIndex((t) => t.id === topicId);
                    if (topicIndex !== -1) {
                        workspace.topics[topicIndex] = { ...workspace.topics[topicIndex], ...data };
                    }
                }
             */
        },
        deleteTopic: (state, action: PayloadAction<{ topicId: Topic['id'] }>) => {
            const collectionIndex = state.workspaceTopics.findIndex((ctc) => ctc.id === state.workspaceTopicActive);

            if (collectionIndex !== -1) {
                const topicIndex = state.workspaceTopics[collectionIndex].topics.findIndex((t) => t.id === action.payload.topicId);

                if (topicIndex !== -1) {
                    const newTopics = state.workspaceTopics[collectionIndex].topics.filter((t) => t.id !== action.payload.topicId);
                    state.workspaceTopics[collectionIndex].topics = newTopics;
                }
            }
        },
        reorderTopic: (state, action: PayloadAction<{ dataTopics: Topic[] }>) => {
            const workspaceIndex = state.workspaceTopics.findIndex((wst) => wst.id === state.workspaceTopicActive);

            if (workspaceIndex !== -1) {
                state.workspaceTopics[workspaceIndex].topics = action.payload.dataTopics;
            }
        },
        //* File
        addFile: (
            state,
            action: PayloadAction<{ file: FileGit<UntrackedAndModifiedFile> | FileGit<UntrackedAndModifiedFile>[]; topicId: Topic['id'] }>
        ) => {
            const collection = state.workspaceTopics.find((ctc) => ctc.id === state.workspaceTopicActive);
            if (collection) {
                const topic = collection.topics.find((t) => t.id === action.payload.topicId);
                if (topic) {
                    const payloadFile = action.payload.file;
                    let filesOnHand = topic.files;
                    if (Array.isArray(payloadFile)) {
                        payloadFile.forEach((filePayload) => {
                            const isExist = filesOnHand.some((fileOnHand) => fileOnHand.pathWithRoot === filePayload.pathWithRoot);
                            if (isExist === false) {
                                // add
                                filesOnHand.push(filePayload);
                            }
                        });
                    } else {
                        const isExist = filesOnHand.some((file) => file.pathWithRoot === payloadFile.pathWithRoot);
                        if (isExist === false) {
                            // add
                            filesOnHand.push(payloadFile);
                        }
                    }
                    // sorted
                    const sortedFiles = sortedArray(filesOnHand, 'counterFile', { numeric: true });
                    filesOnHand = sortedFiles;
                }
            }
        },
        deleteFile: (
            state,
            action: PayloadAction<{
                topicId: Topic['id'];
                pathWithRoot: FileGit<UntrackedAndModifiedFile>['pathWithRoot'] | FileGit<UntrackedAndModifiedFile>['pathWithRoot'][];
            }>
        ) => {
            const collection = state.workspaceTopics.find((ctc) => ctc.id === state.workspaceTopicActive);
            if (collection) {
                const topic = collection.topics.find((topic) => topic.id === action.payload.topicId);
                if (topic) {
                    const pathFile = action.payload.pathWithRoot;
                    if (Array.isArray(pathFile)) {
                        topic.files = topic.files.filter((foh) => !pathFile.some((pf) => foh.pathWithRoot === pf));
                    } else {
                        topic.files = topic.files.filter((foh) => foh.pathWithRoot !== pathFile);
                    }
                    // sorted
                    topic.files = sortedArray(topic.files, 'counterFile', { numeric: true });
                }
            }
        },
        //* Dependency
        addDependency: (state, action: PayloadAction<Pick<Dependency, 'title'>>) => {
            const workspaceIndex = state.workspaceTopics.findIndex((workspace) => workspace.id === state.workspaceTopicActive);
            if (workspaceIndex !== -1) {
                if (state.workspaceTopics[workspaceIndex].dependencys === undefined) {
                    state.workspaceTopics[workspaceIndex].dependencys = [];
                    state.workspaceTopics[workspaceIndex].dependencys.push({
                        id: 'DPC_' + nanoid(),
                        title: action.payload.title,
                        isNew: false,
                    });
                } else {
                    state.workspaceTopics[workspaceIndex].dependencys.push({
                        id: 'DPC_' + nanoid(),
                        title: action.payload.title,
                        isNew: false,
                    });
                }
            }
        },
        importDependency: (state, action: PayloadAction<{ data: Dependency | Dependency[]; commitTopicCollectionId: WorkspaceTopic['id'] }>) => {
            const { data, commitTopicCollectionId } = action.payload;
            const _workspace = state.workspaceTopics.find((w) => w.id === commitTopicCollectionId);
            if (_workspace) {
                if (Array.isArray(data)) {
                    _workspace.dependencys = data;
                } else {
                    _workspace.dependencys.push(data);
                }
            }
        },
        deleteDependency: (state, action: PayloadAction<{ depedencyId: Dependency['id'] }>) => {
            const workspaceIndex = state.workspaceTopics.findIndex((workspace) => workspace.id === state.workspaceTopicActive);
            if (workspaceIndex !== -1) {
                if (state.workspaceTopics[workspaceIndex].dependencys !== undefined) {
                    const newDepedencys = state.workspaceTopics[workspaceIndex].dependencys.filter((d) => d.id !== action.payload.depedencyId);
                    state.workspaceTopics[workspaceIndex].dependencys = newDepedencys;
                }
            }
        },
        updateDependency: (state, action: PayloadAction<{ depedencyId: Dependency['id']; data: Dependency }>) => {
            const workspaceIndex = state.workspaceTopics.findIndex((workspace) => workspace.id === state.workspaceTopicActive);
            if (workspaceIndex !== -1) {
                if (state.workspaceTopics[workspaceIndex].dependencys !== undefined) {
                    const dependencyIndex = state.workspaceTopics[workspaceIndex].dependencys.findIndex((d) => d.id === action.payload.depedencyId);
                    if (dependencyIndex !== -1) {
                        state.workspaceTopics[workspaceIndex].dependencys[dependencyIndex] = {
                            ...state.workspaceTopics[workspaceIndex].dependencys[dependencyIndex],
                            ...action.payload.data,
                        };
                    }
                }
            }
        },
    },
});

export const gitCommitTopicCollectionReducer = gitCommitTopicCollectionSlice.reducer;

export const {
    addWorkspace,
    updateWorkspace,
    deleteWorkspace,
    setWorkspaceActive,
    addTopic,
    importTopic,
    updateTopic,
    deleteTopic,
    reorderTopic,
    addFile,
    deleteFile,
    addDependency,
    importDependency,
    updateDependency,
    deleteDependency,
} = gitCommitTopicCollectionSlice.actions;

export function getAllWorkspaceTopic(state: RootState) {
    return state.gitCommitTopicCollection.workspaceTopics;
}

export const getWorkspaceTopic = createSelector(
    [
        getAllWorkspaceTopic,
        function (state: RootState, workspaceTopicId?: WorkspaceTopic['id'] | null) {
            return workspaceTopicId;
        },
    ],
    (workspaceTopics, workspaceTopicId) => {
        return workspaceTopics.find((w) => w.id === workspaceTopicId);
    }
);

export function getWorkspaceTopicActive(state: RootState) {
    return state.gitCommitTopicCollection.workspaceTopicActive;
}

export function getCommitTopicCollection(state: RootState, commitCollectionId: WorkspaceTopic['id'] | null) {
    if (typeof commitCollectionId !== 'string') return null;
    const commitCollection = state.gitCommitTopicCollection.workspaceTopics.find((ctc) => ctc.id === commitCollectionId);
    if (!commitCollection) return null;
    return commitCollection;
}

export const getTopics = createSelector(
    [
        getAllWorkspaceTopic,
        function (state: RootState, workspaceTopicId: WorkspaceTopic['id'] | null) {
            return workspaceTopicId;
        },
    ],
    (commitTopicCollections, workspaceTopicId) => {
        if (typeof workspaceTopicId === 'string') {
            const commitTopicCollection = commitTopicCollections.find((ctc) => ctc.id === workspaceTopicId);
            if (!commitTopicCollection) return [];

            return commitTopicCollection.topics;
        } else {
            return [];
        }
    }
);

export const getAllTopics = createSelector(
    [
        getAllWorkspaceTopic,
        getWorkspaceTopicActive,
        function (state: RootState) {
            return state;
        },
    ],
    (workspaceTopics, workspaceActive, state) => {
        if (typeof workspaceActive === 'string') {
            const workspace = workspaceTopics.find((wst) => wst.id === workspaceActive);
            if (!workspace) return [];

            const topics = workspace.topics;
            return topics;
        } else {
            return [];
        }
    }
);

export const getTopic = createSelector(
    [
        getAllWorkspaceTopic,
        getWorkspaceTopicActive,
        function (state: RootState, topicId: Topic['id'] | null) {
            return topicId;
        },
    ],
    (workspaceTopics, workspaceActive, topicId) => {
        if (typeof topicId === 'string') {
            const commitTopicCollection = workspaceTopics.find((ctc) => ctc.id === workspaceActive);
            if (!commitTopicCollection) return undefined;

            const topic = commitTopicCollection.topics.find((topic) => topic.id === topicId);
            return topic;
        } else {
            return undefined;
        }
    }
);

export const getDependency = createSelector(
    [
        getAllWorkspaceTopic,
        getWorkspaceTopicActive,
        function (state: RootState, dependencyId: Dependency['id'] | null) {
            return dependencyId;
        },
    ],
    (workspaceTopics, workspaceActive, dependencyId) => {
        if (typeof dependencyId === 'string') {
            const commitTopicCollection = workspaceTopics.find((ctc) => ctc.id === workspaceActive);
            if (!commitTopicCollection) return undefined;

            const dependency = commitTopicCollection.dependencys.find((dependency) => dependency.id === dependencyId);
            return dependency;
        } else {
            return undefined;
        }
    }
);

export const getTopicInFile = createSelector(
    [
        getAllWorkspaceTopic,
        getWorkspaceTopicActive,
        function (state: RootState, pathWithRoot?: FileGit<UntrackedAndModifiedFile>['pathWithRoot']) {
            return pathWithRoot;
        },
    ],
    (workspaceTopics, workspaceActive, pathWithRoot) => {
        const workspace = workspaceTopics.find((ctc) => ctc.id === workspaceActive);
        type TopicInFileAdapter = {
            [filePath: FileGit<UntrackedAndModifiedFile>['pathWithRoot']]: Pick<Topic, 'id' | 'color' | 'title'>[];
        };
        let topicInFileAdapter: TopicInFileAdapter = {};

        if (!workspace) {
            return topicInFileAdapter;
        } else {
            workspace.topics.forEach((topic) => {
                topic.files.forEach((file) => {
                    if (topicInFileAdapter[file.pathWithRoot] === undefined) {
                        topicInFileAdapter[file.pathWithRoot] = [];
                    }
                    const isExist = topicInFileAdapter[file.pathWithRoot].some((t) => t.id === topic.id);
                    if (!isExist) {
                        topicInFileAdapter[file.pathWithRoot].push({ id: topic.id, color: topic.color, title: topic.title });
                    }
                });
            });
            return topicInFileAdapter;
        }
    }
);

export const getAllFileInWorkspace = createSelector(
    [
        getAllWorkspaceTopic,
        getWorkspaceTopicActive,
        function (state: RootState) {
            return state;
        },
    ],
    (workspaceTopics, workspaceActive, state) => {
        const workspace = workspaceTopics.find((ctc) => ctc.id === workspaceActive);

        let files: Topic['files'] = [];

        if (!workspace) {
            return files;
        } else {
            workspace.topics.forEach((topic) => {
                topic.files.forEach((file) => {
                    const isExist = files.some((f) => f.pathWithRoot === file.pathWithRoot);
                    if (!isExist) {
                        files.push(file);
                    }
                });
            });
            return files;
        }
    }
);

export const getAllDependencys = createSelector(
    [
        getAllWorkspaceTopic,
        getWorkspaceTopicActive,
        function (state: RootState) {
            return state;
        },
    ],
    (workspaceTopics, workspaceActive, state) => {
        if (typeof workspaceActive === 'string') {
            const workspace = workspaceTopics.find((wst) => wst.id === workspaceActive);
            if (!workspace) return [];

            const dependencys = workspace.dependencys;
            return dependencys;
        } else {
            return [];
        }
    }
);
