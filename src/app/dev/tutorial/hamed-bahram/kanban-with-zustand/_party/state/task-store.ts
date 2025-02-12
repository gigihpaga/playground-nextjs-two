import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { devtools, persist } from 'zustand/middleware';
// import zustymiddleware from 'zustymiddleware';

export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';

export type Task = {
    id: string;
    title: string;
    description?: string;
    status: Status;
};

export type State = {
    tasks: Task[];
    draggedTask: string | null;
};

export type Actions = {
    addTask: (title: string, description?: string) => void;
    dragTask: (id: string | null) => void;
    removeTask: (title: string) => void;
    updateTask: (title: string, status: Status) => void;
};

// const myMiddlewares = (f) => devtools(persist(f, { name: 'bearStore' }));

export const useTaskStore = create<State & Actions>()(
    devtools(
        persist(
            (set) => {
                return {
                    tasks: [] as State['tasks'],
                    draggedTask: null as State['draggedTask'],
                    addTask: (title: string, description?: string) => {
                        set((state) => {
                            return {
                                tasks: [...state.tasks, { id: uuid(), title, description, status: 'TODO' }],
                            };
                        });
                    },
                    dragTask: (id: string | null) => set({ draggedTask: id }),
                    removeTask: (id: string) =>
                        set((state) => ({
                            tasks: state.tasks.filter((task) => task.id !== id),
                        })),
                    updateTask: (id: string, status: Status) =>
                        set((state) => ({
                            tasks: state.tasks.map((task) => (task.id === id ? { ...task, status } : task)),
                        })),
                };
            },
            { name: 'hamed-bahram-task-store', skipHydration: true }
        ),
        { enabled: process.env.NODE_ENV !== 'production' }
    )
);

// window.store = useTaskStore;
