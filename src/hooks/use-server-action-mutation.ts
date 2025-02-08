'use client';

import { getErrorMessage } from '@/utils/get-error-message';
import React from 'react';

type ActionState<T> =
    | { status: 'idle'; data: T | null; error: null }
    | { status: 'pending'; data: T | null; error: null }
    | { status: 'resolved'; data: T; error: null }
    | { status: 'rejected'; data: null; error: string };

/**
 *
 * @param action
 * @param initialState
 * @returns
 * 
 * @example
 * import { useActionState } from './your-hook-file';
 * function MyComponent() {
 *     const [state, fetchData, isPending] = useActionState(async () => {
 *         const response = await fetch('/api/data');
 *         return response.json(); 
 *     });
 * 
 *     const handleClick = () => {
 *         fetchData();
 *     }
 * 
 * 
 *     if (isPending) {
 *          return <div>Loading...</div>;
 *     }
 * 
 *     if (state.status === 'resolved') {
 *         return <div>{state.data}</div>; // Access the data
 *     }
 * 
 *     if (state.status === 'rejected') {
 *          return <div>Error: {state.error.message}</div>; // Access the error
 *     }
 * 
 * 
 *     return (
 *         <div>
 *             <button onClick={handleClick}>Fetch Data</button>
 *         </div>
 *     );
 * }

 */
export function useServerActionMutation<T, P extends unknown[] = []>(
    actionFn: ((...args: P) => Promise<T>) | (() => Promise<T>),
    initialState: T | null = null
) /* : [ActionState<T>, typeof runAction, boolean] */ {
    const [state, setState] = React.useState<ActionState<T>>({
        // status: initialState === null ? 'idle' : 'resolved',
        status: 'idle',
        data: initialState,
        // data: null,
        error: null,
    });

    const action = React.useCallback(
        async (...args: P) => {
            setState((prev) => ({ ...prev, error: null, status: 'pending' })); // Start pending
            try {
                const data = await actionFn(...args);
                setState({ status: 'resolved', data, error: null });
            } catch (error) {
                setState({ status: 'rejected', data: null, error: getErrorMessage(error) });
            }
        },
        [actionFn]
    );

    return {
        data: state.data,
        state,
        action,
        isLoading: state.status === 'pending',
        isSucces: state.status === 'resolved',
        isError: state.status === 'rejected',
        error: state.error,
    };
}
