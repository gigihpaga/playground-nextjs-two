export type DummyDependencyTopic = {
    id: string;
    title: string;
    isNew: boolean;
    isExist: boolean;
    topics: {
        id: string;
        title: string;
        description: string;
        color: string;
        isConnected: boolean;
        depedencies: {
            id: string;
            title: string;
            isNew: boolean;
            isExist: boolean;
        }[];
    }[];
};
