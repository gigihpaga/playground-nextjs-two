import { Edge, Node } from '@xyflow/react';
import type { Dependency, Topic, CommitTopicCollectionState, WorkspaceTopic } from '../state/commit-topic-collection-slice';
import { type GitTopicFlowState } from '../lib/commit-topic-flow-idb';
import { type CustomeNodeTypes } from '../features/section-flow-topic';

type NodeEgeState = GitTopicFlowState[keyof GitTopicFlowState];

/**
 * function digunakan untuk `update` state react `flow` saat initial (pertama kali render)
 * - `[state redux]` + </state indexeddb/> ==update==> **(state flow)**
 * - disini yang menjadi acuan data yaitu `[state redux]`, </state indexeddb/> hanya di ambil data flow nya saja, e.g: (data position)
 * 
 * - poin
 * > 1. hapus dan update isi node
 * >> 1. jika pada </state indexeddb/> ada data "B" tetapi pada `[state redux]` tidak ada data "B" maka hapus data "B" 
 * >> 2. semua data dari </state indexeddb/> (yang sudah difilter dari poin `1.1`) harus diperbarui isi node sesuai dengan `[state redux]` (node dengan type topic / depedency)
 * > 2. jika pada `[state redux]` ada data "A" tetapi pada </state indexeddb/> tidak ada data "A" maka buat baru data "A"
 
 */
export function getSyncReduxXIndexedDB(
    stateRedux: {
        workspaceActive: NonNullable<CommitTopicCollectionState['workspaceTopicActive']>;
        topic: Topic[];
        depedency: Dependency[];
    },
    stateIndexedDB: GitTopicFlowState
) {
    const emptyReturn: NodeEgeState = { node: [], edge: [] };

    let dataIndexedDB = stateIndexedDB[stateRedux.workspaceActive];

    if (!dataIndexedDB) {
        dataIndexedDB = emptyReturn;
    }

    const _idsTopic = new Set(stateRedux.topic.map((t) => t.id));
    const _idsDepedency = new Set(stateRedux.depedency.map((d) => d.id));
    // @ts-ignore
    const _idsNodeRedux = new Set<string>([..._idsTopic, ..._idsDepedency]);
    const _idsNodesIndexedDB = new Set(dataIndexedDB.node.map((n) => n.id));
    const _idsNodesReduxInIndexedDB = _idsNodeRedux.intersection(_idsNodesIndexedDB);
    const _idsNodesReduxNotInIndexedDB = _idsNodeRedux.difference(_idsNodesIndexedDB);

    const nodesReduxInIndexedDB = dataIndexedDB.node
        // poin 1.1
        .filter((n1) => _idsNodesReduxInIndexedDB.has(n1.id))
        // poin 1.2
        .map((n2) => {
            if ((n2?.type as CustomeNodeTypes) === 'topic-node') {
                const topicUpdated = stateRedux.topic.find((t) => t.id === n2.id);
                if (!topicUpdated) return n2;
                return {
                    ...n2,
                    data: {
                        title: topicUpdated.title,
                        description: topicUpdated.description,
                        color: topicUpdated.color as string,
                        isCommited: topicUpdated.isCommited,
                    },
                } satisfies Node;
            } else if ((n2?.type as CustomeNodeTypes) === 'dependency-node') {
                const depedencyUpdated = stateRedux.depedency.find((d) => d.id === n2.id);
                if (!depedencyUpdated) return n2;
                return {
                    ...n2,
                    data: {
                        title: depedencyUpdated.title,
                        isNew: depedencyUpdated.isNew,
                    },
                } satisfies Node;
            } else {
                return n2;
            }
        });

    // poin 2
    const nodesTopicReduxNotInIndexedDB: Node[] = stateRedux.topic
        .filter((t1) => _idsNodesReduxNotInIndexedDB.has(t1.id))
        .map(
            (t2, idx) =>
                ({
                    id: t2.id,
                    data: {
                        title: t2.title,
                        description: t2.description,
                        color: t2.color as string,
                        isCommited: t2.isCommited,
                    },
                    position: { x: 0, y: (idx + 1) * 65 },
                    type: 'topic-node',
                }) satisfies Node
        );

    // poin 2
    const nodesDepedencyReduxNotInIndexedDB: Node[] = stateRedux.depedency
        .filter((d1) => _idsNodesReduxNotInIndexedDB.has(d1.id))
        .map(
            (d2, idx) =>
                ({
                    id: d2.id,
                    data: {
                        title: d2.title,
                        isNew: d2.isNew,
                    },
                    position: { x: (idx + 1) * 50, y: -50 },
                    type: 'dependency-node',
                }) satisfies Node
        );

    return {
        node: [...nodesReduxInIndexedDB, ...nodesTopicReduxNotInIndexedDB, ...nodesDepedencyReduxNotInIndexedDB],
        edge: dataIndexedDB.edge.filter((e) => _idsNodeRedux.has(e.target) && _idsNodeRedux.has(e.source)),
    } satisfies NodeEgeState;
}

/**
 * function digunakan untuk `update` data **(state flow)** & </state indexeddb/> agar UI syncron
 * - `[state redux]` + **(state flow)**  ==update==> **(state flow)** & </state indexeddb/>
 * @param stateRedux
 * @param stateReactFlow
 */
export function getSyncReduxXReactFlow(stateRedux: { topic: Topic[]; depedency: Dependency[] }, stateReactFlow: { node: Node[]; edge: Edge[] }) {
    const _idsTopic = new Set(stateRedux.topic.map((t) => t.id));
    const _idsDepedency = new Set(stateRedux.depedency.map((d) => d.id));

    const _idsNodesRedux = new Set<string>([..._idsTopic, ..._idsDepedency]);
    const _idsNodesReactFlow = new Set(stateReactFlow.node.map((n) => n.id));
    const _idsNodesReduxInReactFlow = _idsNodesRedux.intersection(_idsNodesReactFlow);
    const _idsNodesReduxNotInReactFlow = _idsNodesRedux.difference(_idsNodesReduxInReactFlow);

    const nodesReduxInReactFlow = stateReactFlow.node
        // poin 1.1
        .filter((n1) => _idsNodesReduxInReactFlow.has(n1.id))
        // poin 1.2
        .map((n2) => {
            if ((n2?.type as CustomeNodeTypes) === 'topic-node') {
                const topicUpdated = stateRedux.topic.find((t) => t.id === n2.id);
                if (!topicUpdated) return n2;
                return {
                    ...n2,
                    data: {
                        title: topicUpdated.title,
                        description: topicUpdated.description,
                        color: topicUpdated.color as string,
                        isCommited: topicUpdated.isCommited,
                    },
                } satisfies Node;
            } else if ((n2?.type as CustomeNodeTypes) === 'dependency-node') {
                const depedencyUpdated = stateRedux.depedency.find((d) => d.id === n2.id);
                if (!depedencyUpdated) return n2;
                return {
                    ...n2,
                    data: {
                        title: depedencyUpdated.title,
                        isNew: depedencyUpdated.isNew,
                    },
                } satisfies Node;
            } else {
                return n2;
            }
        });

    // poin 2
    const nodesTopicReduxNotInReactFlow: Node[] = stateRedux.topic
        .filter((t1) => _idsNodesReduxNotInReactFlow.has(t1.id))
        .map(
            (t2, idx) =>
                ({
                    id: t2.id,
                    data: {
                        title: t2.title,
                        description: t2.description,
                        color: t2.color as string,
                        isCommited: t2.isCommited,
                    },
                    position: { x: 0, y: (idx + 1) * 65 },
                    type: 'topic-node',
                }) satisfies Node
        );

    // poin 2
    const nodesDepedencyReduxNotInReactFlow: Node[] = stateRedux.depedency
        .filter((d1) => _idsNodesReduxNotInReactFlow.has(d1.id))
        .map(
            (d2, idx) =>
                ({
                    id: d2.id,
                    data: {
                        title: d2.title,
                        isNew: d2.isNew,
                    },
                    position: { x: (idx + 1) * 50, y: -50 },
                    type: 'dependency-node',
                }) satisfies Node
        );

    return {
        node: [...nodesReduxInReactFlow, ...nodesTopicReduxNotInReactFlow, ...nodesDepedencyReduxNotInReactFlow],
        edge: stateReactFlow.edge,
    } satisfies NodeEgeState;
}
