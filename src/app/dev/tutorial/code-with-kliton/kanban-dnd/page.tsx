import dynamic from 'next/dynamic';
import { LoaderIcon } from 'lucide-react';

// import KanbanBoard from './_party/components/kanban-board';
const KanbanBoard = dynamic(() => import('./_party/components/kanban-board'), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full flex flex-col gap-y-2 justify-center items-center">
            <LoaderIcon className="size-8 animate-[spin_2.25s_linear_infinite]" />
            <p className="text-xs">loading Kanban Board</p>
        </div>
    ),
});

export default function KanbanPage() {
    return (
        <div className="w-full h-[calc(100vh-70px)]">
            <KanbanBoard />
        </div>
    );
}
