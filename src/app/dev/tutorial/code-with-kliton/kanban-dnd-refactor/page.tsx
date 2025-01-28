import { KanbanBoard } from './_party/features/kanban-board';

export default function KanbanPage() {
    return (
        <div className="w-full h-[calc(100vh-70px)] bg-slate-600">
            <KanbanBoard />
        </div>
    );
}
