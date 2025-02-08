'use client';

import { useActionState, useEffect, useRef, useState } from 'react';

export function App() {
    const [words, setWords] = useState<null | string>(null);
    const renderCount = useRef(0);

    useEffect(() => {
        console.log('useEffect 1 before');
        if (!words) {
            setWords(addWord('lion'));
        }
        console.log('useEffect 1 after');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        console.log('useEffect 2 before');
        if (words) return;

        setWords(addWord('rabbit', words));
        console.log('useEffect 2 after');
    }, [words]);

    console.log({ renderCount, words });

    return <p>ini adalah word: {words}</p>;
}

function addWord(word: string, prevWord?: string | null) {
    return String(prevWord) + String(word);
}
