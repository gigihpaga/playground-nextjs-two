import { Kanban } from './_party/features/kanban';

export default function KanbanWithZustandPage() {
    return (
        <section className="flex w-full _h-screen bg-gradient-to-br from-gray-700 to-gray-900 py-12 text-white">
            <div className="mx-auto w-full max-w-7xl px-6">
                <Kanban />
            </div>
        </section>
    );
}
