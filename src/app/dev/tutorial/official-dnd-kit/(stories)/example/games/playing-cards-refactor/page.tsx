import { KanbanBoard } from './_party/features/kanban-board';

export default async function PageTrelloClone() {
    return (
        <div className="w-full">
            <KanbanBoard />
        </div>
    );
}
