import { getErrorMessage } from '@/utils/get-error-message';
import { useReducer, useEffect, useCallback } from 'react';

interface UseServerActionQueryOptions<T> {
    initialData?: T;
    enabled?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: unknown) => void;
}

type UseServerActionQueryResult<T, P extends unknown[]> =
    | {
          isLoading: boolean;
          isError: true;
          error: string;
          data: T | null;
          refetch: (...params: P) => Promise<void>;
      }
    | {
          isLoading: boolean;
          isError: false;
          error: null;
          data: T | null;
          refetch: (...params: P) => Promise<void>;
      };

type Action<T> = { type: 'loading' } | { type: 'success'; payload: T } | { type: 'error'; payload: string } | { type: 'reset' };

function reducer<T, P extends unknown[]>(state: UseServerActionQueryResult<T, P>, action: Action<T>): UseServerActionQueryResult<T, P> {
    switch (action.type) {
        case 'loading':
            return { ...state, isLoading: true, isError: false, error: null };
        case 'success':
            return { ...state, isLoading: false, isError: false, data: action.payload, error: null };
        case 'error':
            return { ...state, isLoading: false, isError: true, error: action.payload };
        case 'reset':
            return { ...state, isLoading: false, isError: false, error: null, data: null }; // You might adjust the reset behavior as needed
        default:
            return state;
    }
}
/**
 * Custom hook for handling server-side queries with generic parameter and response
 * @param action - The server action function to execute with a parameter
 * @param deps - Dependencies to determine when to re-run the query
 * @param options - Additional options (e.g., initial data, onError, onSuccess)
 * @returns Query state and utility functions
 */
export function useServerActionQuery<T, P extends unknown[]>(
    action: (...params: P) => Promise<T>,
    deps: unknown[] = [],
    options: UseServerActionQueryOptions<T> = {}
): UseServerActionQueryResult<T, P> {
    const { initialData = null, enabled = true, onSuccess = () => {}, onError = () => {} } = options;

    const initialState: UseServerActionQueryResult<T, P> = {
        isLoading: false,
        isError: false,
        error: null,
        data: initialData,
        refetch: async () => {}, // Placeholder, updated below
    };

    const [state, dispatch] = useReducer<(state: UseServerActionQueryResult<T, P>, action: Action<T>) => UseServerActionQueryResult<T, P>>(
        reducer,
        initialState
    );

    const fetchData = useCallback(
        async (...params: P) => {
            if (!enabled) return;
            dispatch({ type: 'loading' });
            try {
                const result = await action(...params);
                dispatch({ type: 'success', payload: result });
                onSuccess(result);
            } catch (error) {
                dispatch({ type: 'error', payload: getErrorMessage(error) });
                onError(error);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [enabled, action, onSuccess, onError, ...deps]
    ); // include deps

    useEffect(() => {
        fetchData(...([] as unknown as P));
        return () => dispatch({ type: 'reset' }); // Reset on unmount (optional)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return { ...state, refetch: fetchData };
}
