import { insights } from '../../constants';

export function InsightRoll() {
    return (
        <div className="w-full bg-cb-accent dark:bg-cb-accent-dark text-cb-light whitespace-nowrap overflow-hidden">
            <div className="animate-cb-insights-roll w-full py-2 sm:py-3 flex items-center justify-center capitalize font-semibold tracking-wider text-sm sm:text-base">
                {insights.map((insight, idx) => (
                    <div
                        className="px-2"
                        key={insight}
                        data-id={`a-${idx}`}
                    >
                        {insight}
                        {/* <span className="px-4">|</span> */}
                    </div>
                ))}
                {insights.map((insight, idx) => (
                    <div
                        className="px-2"
                        key={insight}
                        data-id={`a-${idx}`}
                    >
                        {insight}
                        {/* <span className="px-4">|</span> */}
                    </div>
                ))}
            </div>
        </div>
    );
}
