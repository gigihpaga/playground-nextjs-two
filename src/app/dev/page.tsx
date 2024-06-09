'use client';

// import Image from 'next/image';
// import { useEffect } from 'react';

interface PageProps {
    params: { [key: string]: string | string[] | undefined } | Record<string, never>;
    searchParams: { [key: string]: string | string[] | undefined } | Record<string, never>;
}

export default function Page(req: PageProps) {
    console.log(req);
    // const arr = ['a', 1];
    /*  const obj = {
        nama: 'paga',
        umur: 2,
    }; */
    const c = [];

    c.push('aa');
    return (
        <div className="bg-black">
            hallo dev page
            {/* <Image src /> */}
            {/* <h1 /> */}
        </div>
    );
}
