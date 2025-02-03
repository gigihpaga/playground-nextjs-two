import { AppMouseMove } from './_party/features/app-mousemove';
import { App } from './_party/features/app';

export default async function LectureCanvasPage() {
    return (
        <div className="w-full container _bg-red-400 flex flex-col">
            <h1 className="mt-8 font-bold text-2xl">Lecture Canvas Page</h1>
            {/* <AppMouseMove /> */}
            <App />
        </div>
    );
}
