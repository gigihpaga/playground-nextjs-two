'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useReactFlow, type Edge } from '@xyflow/react';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { getPakageInFileByTopic, type PakageInFile } from '../action/package-from-file';
import { getAllDependencys, getAllTopics, type Topic, type Dependency } from '../state/commit-topic-collection-slice';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TableDependencyTopicSummary, TableTopicDependencySummary } from './table-depedency-groupby-topic';
import { useServerActionQuery } from '@/hooks/use-server-action-query';
import { Button } from '@/components/ui/button';

type DialogCreateWorkspaceTopicActualProps = {
    trigger: ReactNode;
};

export function DialogListDepedencyTopicGrouping({ trigger }: DialogCreateWorkspaceTopicActualProps) {
    const [open, setOpen] = useState<boolean>(false);

    function handleOpenChange(state: boolean) {
        setOpen(state);
    }

    return (
        <Dialog
            open={open}
            onOpenChange={handleOpenChange}
        >
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="flex flex-col _sm:max-w-[425px] h-[90vh] max-h-[90vh] max-w-[90vw] overflow-hidden gap-1">
                <DialogHeader>
                    <DialogTitle className="flex gap-2">List depedency group by commit</DialogTitle>
                    <DialogDescription>List dependencys in flow.</DialogDescription>
                </DialogHeader>
                <DependencyTables dialogStateIsOpen={open} />
            </DialogContent>
        </Dialog>
    );
}

type PopulationDependencyGroupByCommitWithDependencyInFile = Awaited<
    ReturnType<typeof getPakageInFileByTopic<ReturnType<typeof createPopulationDependencyGroupByTopic>[number]>>
>[number];

async function getPopulationDependencyGroupByCommitWithDependencyInFile(topicsInRedux: Topic[], dependencysInRedux: Dependency[], allEdges: Edge[]) {
    const populationDependencyGroupByCommit = createPopulationDependencyGroupByTopic({
        topicsInRedux: topicsInRedux,
        dependencysInRedux: dependencysInRedux,
        // nodeTopics: getNodes().filter((node) => node.type === 'topic-node'),
        // nodeDependencys: getNodes().filter((node) => node.type === 'dependency-node'),
        allEdges: allEdges,
    });

    const _populationDependencyGroupByCommitWithDependencyInFile = (await getPakageInFileByTopic(populationDependencyGroupByCommit)).sort((a, b) =>
        a.title.localeCompare(b.title)
    );

    // setpopulationDependencyGroupByCommitWithDependencyInFile(_populationDependencyGroupByCommitWithDependencyInFile);
    return _populationDependencyGroupByCommitWithDependencyInFile;
}

function DependencyTables({ dialogStateIsOpen }: { dialogStateIsOpen: boolean }) {
    const dispatch = useAppDispatch();
    const { getNodes, getEdges } = useReactFlow();
    const topicsInRedux = useAppSelector(getAllTopics);
    const dependencysInRedux = useAppSelector(getAllDependencys);

    const {
        data: populationDependencyGroupByCommitWithDependencyInFile,
        isError,
        isLoading,
        refetch,
    } = useServerActionQuery(() => getPopulationDependencyGroupByCommitWithDependencyInFile(topicsInRedux, dependencysInRedux, getEdges()), [], {
        enabled: dialogStateIsOpen === true,
    });

    console.log('populationDependencyGroupByCommitWithDependencyInFile', populationDependencyGroupByCommitWithDependencyInFile);

    return (
        <div
            aria-description="Dependency tables wrapper"
            className="flex flex-col flex-1 overflow-hidden gap-1 py-4 px-2 border border-border rounded-md"
        >
            {/* <div className="border border-border rounded-md p-2 space-y-2">
                <h4 className="text-sm font-bold">Filter</h4>
                <div className="flex gap-x-2 items-end justify-between">
                    <div className="flex gap-x-2 items-center">
                        <span className="text-xs">Status:</span>
                        <RadioGroup
                            value={dependencyStatus}
                            // defaultValue="all"
                            onValueChange={(value: 'all' | 'new' | 'old') => handleRadioStatusChange(value)}
                            className="w-fit border border-border rounded-md [&>button:first-child]:!-mr-[3px] [&>button:last-child]:!-ml-[3px] _[&>button[aria-checked='true']:after]:!bg-purple-400"
                        >
                            <RadioGroupItem
                                value="all"
                                id="all"
                                title="all"
                                className="!min-w-fit !h-fit !w-[40px] !py-[4px] !px-[6px] !border !border-border text-white"
                            >
                                <span>all</span>
                            </RadioGroupItem>
                            <RadioGroupItem
                                value="new"
                                id="new"
                                title="new"
                                className="!min-w-fit !h-fit !w-[40px] !py-[4px] !px-[6px]"
                            >
                                <span>new</span>
                            </RadioGroupItem>
                            <RadioGroupItem
                                value="old"
                                id="old"
                                title="old"
                                className="!min-w-fit !h-fit !w-[40px] !py-[4px] !px-[6px]"
                            >
                                <span>old</span>
                            </RadioGroupItem>
                        </RadioGroup>
                    </div>
                    <ButtonCopy
                        size="sm"
                        className="size-6 [&_.btn-copy-icon-wrapper]:size-3 [&_svg]:size-3"
                        data={dataDependencys.map((dependency) => dependency.title).join('\n')}
                        title="copy title in view table"
                    />
                </div>
            </div> */}

            {/*  {populationDependencyGroupByCommitWithDependencyInFile.length === 0 ? (
                <div className="h-full flex justify-center items-center">
                    <p>loading...</p>
                </div>
            ) : (
                <div className="h-full overflow-auto p-2 rounded-md">
                    <TableTopicDependencySummaryRender data={populationDependencyGroupByCommitWithDependencyInFile} />
                </div>
            )} */}
            <Button
                size="sm"
                onClick={() => refetch()}
            >
                refetch
            </Button>
            <Tabs
                defaultValue="dependency-topic"
                className="flex flex-col h-full overflow-hidden"
            >
                <TabsList className="grid w-full grid-cols-2 h-8">
                    <TabsTrigger
                        className="text-xs"
                        value="topic-dependency"
                    >
                        topic-dependency
                    </TabsTrigger>
                    <TabsTrigger
                        className="text-xs"
                        value="dependency-topic"
                    >
                        dependency-topic
                    </TabsTrigger>
                </TabsList>
                <TabsContent
                    value="topic-dependency"
                    className="flex-1 overflow-hidden"
                >
                    {isLoading ? (
                        <div>...loading</div>
                    ) : populationDependencyGroupByCommitWithDependencyInFile ? (
                        <TableTopicDependencySummaryRender data={populationDependencyGroupByCommitWithDependencyInFile} />
                    ) : (
                        <div>error</div>
                    )}
                </TabsContent>
                <TabsContent
                    className="flex-1 overflow-hidden"
                    value="dependency-topic"
                >
                    {isLoading ? (
                        <div>...loading</div>
                    ) : populationDependencyGroupByCommitWithDependencyInFile ? (
                        <TableDependencyTopicSummaryRender data={populationDependencyGroupByCommitWithDependencyInFile} />
                    ) : (
                        <div>error</div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}

function TableTopicDependencySummaryRender({ data }: { data: PopulationDependencyGroupByCommitWithDependencyInFile[] }) {
    const reportTopicDependency = createTopicDependencySummary(data);
    return <TableTopicDependencySummary data={reportTopicDependency} />;
}

function TableDependencyTopicSummaryRender({ data }: { data: PopulationDependencyGroupByCommitWithDependencyInFile[] }) {
    const reportDependencyTopic = createDependencyTopicSummary(data);
    return <TableDependencyTopicSummary data={reportDependencyTopic} />;
}

//* Helpers
function createPopulationDependencyGroupByTopic({
    topicsInRedux,
    dependencysInRedux,
    allEdges,
}: {
    topicsInRedux: Topic[];
    dependencysInRedux: Dependency[];
    allEdges: Edge[];
}) {
    function getDependecysConnectedInTopic(topicId: string) {
        return allEdges
            .filter((edge) => edge.target === topicId)
            .reduce((accEdge, currEdge) => {
                const b = dependencysInRedux.find((dependency) => dependency.id === currEdge.source);
                if (b) {
                    // accEdge.push({ ...b, isExist: true, isConnected: true });
                    accEdge.push(b);
                }
                return accEdge;
            }, [] as Dependency[] /* Array<Dependency & { isExist: boolean; isConnected: boolean }> */);
    }

    const adapater = topicsInRedux.reduce(
        (accTopic, currTopic, idxTopic) => {
            accTopic.push({
                ...currTopic,
                dependencysInFlow: getDependecysConnectedInTopic(currTopic.id),
            });

            return accTopic;
        },
        [] as Array<Topic & { dependencysInFlow: Dependency[] }>
        /* Array<{
            title: string;
            files: FileGit<UntrackedAndModifiedFile>[];
            dependencysInFlow: Dependency[]; // Array<Dependency & { isExist: boolean; isConnected: boolean }>
        }> */
    );

    return adapater;
}

/**
 * Fungsi untuk membuat list topic dengan isi list dependency | `dependency group by topic`
 * @param populationDependencys 
 * @returns 
 * 
 * @example
 * // return
 * {
        id,
        title,
        color,
        isCommited,
        description,
        depedencys: {
             id: string;
             title: string;
             isNew: boolean;
             isConnected: boolean;
             isExist: boolean;
        }[],
    }[]
 */
function createTopicDependencySummary(populationDependencys: Array<Topic & { dependencysInFlow: Dependency[]; dependencysInFile: PakageInFile[] }>) {
    type AAAA = Array<
        Awaited<ReturnType<typeof getPakageInFileByTopic<ReturnType<typeof createPopulationDependencyGroupByTopic>[number]>>>[number] & {
            AAAA: Array<Dependency & { isExist: boolean; isConnected: boolean }>;
        }
    >;

    const dependencyMap = new Map<string, Dependency & { isExist: boolean }>();

    populationDependencys.forEach((pd) => {
        pd.dependencysInFile
            .flatMap((packageInFile) => packageInFile.pakages)
            .forEach((packageName) =>
                dependencyMap.set(packageName, { id: `UNREGISTER_${packageName}`, title: packageName, isExist: false, isNew: false })
            );
        pd.dependencysInFlow.forEach((packageInFlow) => void dependencyMap.set(packageInFlow.title, { ...packageInFlow, isExist: true }));
    });

    const summary = populationDependencys.reduce(
        (acc, curr) => {
            const allDependencies = new Set<string>();
            curr.dependencysInFile.flatMap((packageInFile) => packageInFile.pakages).forEach((packageName) => allDependencies.add(packageName));
            curr.dependencysInFlow.forEach((packageInFlow) => allDependencies.add(packageInFlow.title));

            const deps = Array.from(allDependencies)
                .sort((a, b) => a.localeCompare(b))
                .map((packageName) => {
                    return {
                        ...dependencyMap.get(packageName)!,
                        isConnected: curr.dependencysInFlow.some((diFlow) => diFlow.title === packageName),
                    };
                });

            const { id, title, color, isCommited, description } = curr;

            acc.push({
                id,
                title,
                color,
                isCommited,
                description,
                depedencys: deps,
            });

            return acc;
        },
        [] as Array<Omit<Topic, 'files'> & { depedencys: Array<Dependency & { isExist: boolean; isConnected: boolean }> }>
        /*  (Omit<Topic,"files"> & { depedencys: Array<Dependency & { isExist: boolean; isConnected: boolean }> })[] */
    );

    return summary;
}

export type DataTopicDependencySummary = ReturnType<typeof createTopicDependencySummary>;

/**
 * Fungsi untuk membuat list dependency dengan isi list topic | `topic group by dependency`
 * @param populationDependencys 
 * @returns 
 * 
 * @example
 * // return
 * {
    topics: {
        id: string;
        title: string;
        description: string | undefined;
        isCommited: boolean;
        color: `#${string}`;
        isConnected: boolean;
        depedencies: {
            id: string;
            title: string;
            isNew: boolean;
            isExist: boolean;
        }[];
    }[];
    id: string;
    title: string;
    isNew: boolean;
    isExist: boolean;
}[]
 */
function createDependencyTopicSummary(populationDependencys: Array<Topic & { dependencysInFlow: Dependency[]; dependencysInFile: PakageInFile[] }>) {
    const dependencyMap = new Map<string, Dependency & { isExist: boolean }>();
    populationDependencys.forEach((pd) => {
        pd.dependencysInFile
            .flatMap((packageInFile) => packageInFile.pakages)
            .forEach((packageName) =>
                dependencyMap.set(packageName, { id: `UNREGISTER_${packageName}`, title: packageName, isExist: false, isNew: false })
            );
        pd.dependencysInFlow.forEach((packageInFlow) => void dependencyMap.set(packageInFlow.title, { ...packageInFlow, isExist: true }));
    });

    const dependencyList = Array.from(dependencyMap.values()).sort((a, b) => a.title.localeCompare(b.title));

    const topics = populationDependencys.map((topic) => {
        const depsSet = new Set<string>();
        topic.dependencysInFile.forEach((depInFile) => depInFile.pakages.forEach((packageName) => depsSet.add(packageName)));
        topic.dependencysInFlow.forEach((depInFlow) => depsSet.add(depInFlow.title));

        const { id, title, isCommited, description, color, dependencysInFlow } = topic;
        return {
            id,
            title,
            isCommited,
            description,
            color,
            dependencysInFlow,
            depedencies: Array.from(depsSet.values()),
        };
    });

    const summaryTopicGroupByDependency = dependencyList.map((dependency) => {
        const _t = topics
            .filter((tpc) => tpc.depedencies.some((dep) => dep === dependency.title))
            .map((topic2) => {
                const { id, title, description, isCommited, color, depedencies } = topic2;

                return {
                    id,
                    title,
                    description,
                    isCommited,
                    color,
                    depedencies: dependencyList.filter((dl) => depedencies.some((d) => d === dl.title)),
                    isConnected: topic2.dependencysInFlow.some((depInFlow) => depInFlow.title === dependency.title),
                };
            });
        return {
            ...dependency,
            topics: _t,
        };
    });

    /*  console.log(
        'populationDependencys',
        populationDependencys,
        'dependencyList',
        dependencyList,
        'topics',
        topics,
        'summaryTopicGroupByDependency',
        summaryTopicGroupByDependency
    ); */

    return summaryTopicGroupByDependency;
}

export type DataDependencyTopicSummary = ReturnType<typeof createDependencyTopicSummary>;
