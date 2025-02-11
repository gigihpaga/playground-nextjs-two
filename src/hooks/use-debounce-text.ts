import React from 'react';
import { useDebounce } from 'react-use';
import { useDebounceValue } from 'usehooks-ts';

export function useDebounceText(initialValue = '') {
    const [state, setState] = React.useState<boolean>(true);
    const [val, setVal] = React.useState<string>(initialValue);
    const [debouncedValue, setDebouncedValue] = React.useState<string>(initialValue);

    const [textSearchDebounceReady, textSearchDebounceCancel] = useDebounce(
        () => {
            setState(true);
            setDebouncedValue(val);
        },
        1000,
        [val]
    );

    function setText(text: string) {
        setState(false);
        setVal(text);
    }

    const textSearchReady = textSearchDebounceReady();

    const isLoading = textSearchReady === false && val !== debouncedValue;
    /**
     * - saat initial value="" isLoading="false"
     */
    return { setText, text: val, textDefered: debouncedValue, isLoading };
}
