'use client';

import { useServerActionMutation } from '@/hooks/use-server-action-mutation';
// import { getFilesFromCommit, getUntrackedFiles } from '@/server/git-command';
import { getHistoryCommitOfFile, getFilesFromCommit } from '@/app/dev/research/git/commit-topic/_party/action/history-commit-of-file';

async function mockFetch() {
    return new Promise<string>((resolve, reject) => resolve('halo'));
}

export function App() {
    // const { data, error, isLoading, isRejected, isResolved, status } = useServerAction(() => getFilesFromCommit('82fc3'));
    const { data, state, action, isLoading, isError, isSucces, error } = useServerActionMutation(getFilesFromCommit, []);
    // const { data, state, action, isLoading, isError, isSucces, error } = useServerActionMutation(mockFetch, []);
    console.log({ data, isLoading, error });
    return (
        <div>
            {isSucces === true ? <p>{data}</p> : null}

            <button onClick={() => void action('82f')}>get</button>
        </div>
    );
}
