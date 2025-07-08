import { cn } from '@/lib/classnames';
import { App, Debug } from './_party/features/app';
import { getLabs } from './_party/utils/clash-ninja';

export default async function FireballSimulationPage() {
    const dataLabs = await getLabs();
    return (
        <div
            className={cn('flex flex-col container', ' p-2 sm:px-6 md:px-8', 'overflow-hidden h-[calc(100vh-100px)]  md:h-[calc(100vh-65px)]')}
            aria-description="fireball simulation page"
        >
            {/* <h1 className="my-1 md:my-2 font-bold text-2xl">COC Fireball Estimate</h1> */}
            <App />
            {/* <Debug data={dataLabs} /> */}
        </div>
    );
}
