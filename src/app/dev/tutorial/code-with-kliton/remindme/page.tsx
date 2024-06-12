import { ReactNode, Suspense } from 'react';
import Image from 'next/image';
import { currentUser } from '@clerk/nextjs/server';

import { wait } from '@/utils/wait';
import prisma from '@/lib/prisma';

import { Skeleton as SkeletonShadcn } from '@/components/ui/skeleton';
import { Skeleton } from '@/app/dev/tutorial/code-with-kliton/remindme/_party/components/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SadFace } from './_party/components/icons/sad-face';
import { CreateCollectionButton } from './_party/features/create-collection-button';
import { CollectionCard } from './_party/features/collection-card';

export default async function Home() {
    return (
        <>
            <Suspense fallback={<WelcomeMessageFallback />}>
                <WelcomeMessage />
            </Suspense>
            <Suspense fallback={<div>Loading collection...</div>}>
                <CollectionList />
            </Suspense>
        </>
    );
}

async function WelcomeMessage() {
    const user = await currentUser();
    await wait(3000);

    if (!user) {
        return <div>error</div>;
    }
    return (
        <Welcome>
            Welcome. <br /> {user.firstName} <span className="font-light">{user.lastName}</span>
        </Welcome>
    );
}

function WelcomeMessageFallback() {
    return (
        <Welcome>
            <Skeleton
                colorOne="#1c1c1d"
                colorTwo="#302f31"
                className="w-[180px] h-[30px] rounded-lg mb-2"
            />
            <Skeleton
                colorOne="#1c1c1d"
                colorTwo="#302f31"
                className="w-[150px] h-[30px] rounded-lg"
            />
        </Welcome>
    );
}

function Welcome({ children }: { children: ReactNode | ReactNode[] }) {
    return (
        <div className="flex w-full mb-12">
            <h1 className="text-4xl font-bold">{children}</h1>
        </div>
    );
}

async function CollectionList() {
    const user = await currentUser();
    const collections = await prisma.dev_collection.findMany({
        include: {
            tasks: true,
        },
        where: {
            userId: user?.id,
        },
    });
    if (collections.length === 0) {
        return (
            <div className="flex flex-col gap-5">
                <Alert>
                    <SadFace />
                    <AlertTitle>There are no collection yet!</AlertTitle>
                    <AlertDescription>Create a collection to get started</AlertDescription>
                </Alert>
                <CreateCollectionButton />
            </div>
        );
    }

    return (
        <>
            <CreateCollectionButton />
            <div className="flex flex-col gap-4 mt-6">
                {collections.map((collection) => (
                    <CollectionCard
                        key={collection.id}
                        collection={collection}
                    />
                ))}
            </div>
        </>
    );
}
