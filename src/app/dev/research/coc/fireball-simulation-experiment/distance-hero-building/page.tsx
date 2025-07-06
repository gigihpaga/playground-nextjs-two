import { App } from './_party/features/app';
import { App2 } from './_party/features/app-2';
import { App3 } from './_party/features/app-3';
import { App4 } from './_party/features/app-4';
import { App5 } from './_party/features/app-5';
import { App6 } from './_party/features/app-6';
import { App7 } from './_party/features/app-7';
import { App8 } from './_party/features/app-8';
import { New2 } from './_party/features/new-2';
import { New3 } from './_party/features/new-3';
import { New4 } from './_party/features/new-4';
import { New5 } from './_party/features/new-5';
import { New6 } from './_party/features/new-6';
import { New7 } from './_party/features/new-7';
import { New8 } from './_party/features/new-8';
import { New9 } from './_party/features/new-9';
import { New10 } from './_party/features/new-10';
import { New11 } from './_party/features/new-11';
import { New12 } from './_party/features/new-12-dnd-collision-with-line'; // final!! untuk mengukur jarak warden dengan target building coc

export default function DistanceObjectPage() {
    return (
        <div
            className="w-full container flex flex-col relative"
            aria-description="queen charger page"
        >
            <h1 className="mt-8 font-bold text-2xl">Distance Hero Building</h1>
            {/* <App8 /> */}
            <New12 />
        </div>
    );
}
