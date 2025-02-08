'use client';

import React, { useReducer } from 'react';

// type ActionType = 'error' | 'success' | 'started' | 'idle';

type ActionState<T> =
    | { status: 'idle'; data: null; error: null }
    | { status: 'pending'; data: null; error: null }
    | { status: 'resolved'; data: T; error: null }
    | { status: 'rejected'; data: null; error: unknown };

type ActionReducer<T> = { type: 'started' } | { type: 'success'; data: T } | { type: 'error'; error: unknown };

type ObjectReducer = {
    status: 'rejected' | 'resolved' | 'pending';
};

function useActionReducer<T>(state: ActionState<T>, action: ActionReducer<T>): ActionState<T> {
    switch (action.type) {
        case 'error':
            return {
                // ...state,
                status: 'rejected',
                error: action.error,
                data: null,
            };
        case 'success':
            return {
                // ...state,
                status: 'resolved',
                error: null,
                data: action.data,
            };
        case 'started':
            return {
                // ...state,
                status: 'pending',
                error: null,
                data: null,
            };
        default:
            // This should be unreachable due to exhaustive checking above
            // If it's not, TypeScript will complain.  This throws for runtime safety.
            // @ts-ignore
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

interface useServerActionProps<T, P> {
    // callback: () => Promise<T>;
    callback: ((args?: P) => Promise<T>) | (() => Promise<T>);
}

export function useServerAction<T, P extends unknown[] = []>({ callback }: useServerActionProps<T, P>) {
    // geoPositionReducer<Awaited<ReturnType<typeof countNumber>>>
    const [state, dispatch] = React.useReducer<React.Reducer<ActionState<T>, ActionReducer<T>>>(useActionReducer, {
        status: 'idle',
        data: null,
        error: null,
    });

    React.useEffect(() => {
        let mounted = true; // Flag to track component mount status

        async function run() {
            try {
                if (!mounted) return; // Abort if component has unmounted
                dispatch({ type: 'started' });
                const data = await callback();
                if (!mounted) return; // Abort if component has unmounted
                dispatch({ type: 'success', data: data });
            } catch (error) {
                if (!mounted) return; // Abort if component has unmounted
                dispatch({ type: 'error', error: error });
            }
        }

        run();

        return () => {
            mounted = false; // Set flag to false when component unmounts
        };
    }, [callback]); // Add callback as a dependency

    return {
        // isLoading: state.status === 'idle' || state.status === 'pending',
        isLoading: state.status === 'pending',
        isResolved: state.status === 'resolved', // Corrected property name
        isRejected: state.status === 'rejected',
        ...state,
    };
}
