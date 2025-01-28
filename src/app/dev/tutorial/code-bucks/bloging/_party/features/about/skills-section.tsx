import { skillList } from '../../constants';

export function SkillsSection() {
    return (
        <section className="w-full flex flex-col p-5 xs:p-10 sm:p-12 md:p-16 lg:p-20 border-b-2 border-solid _border-cb-dark _dark:border-cb-light _text-cb-dark">
            <h2 className="font-semibold text-lg sm:text-3xl md:text-4xl text-cb-accent dark:text-cb-accent-dark">I&apos;m comfortable</h2>
            <ul className="flex flex-wrap mt-8 justify-center xs:justify-start">
                {skillList.map((skil) => (
                    <li
                        key={skil}
                        className="dark:font-normal font-semibold inline-block capitalize text-base xs:text-lg sm:text-xl md:text-2xl px-2 md:px-5 py-2 border-2 border-solid border-cb-dark dark:border-cb-light rounded mr-3 mb-3  xs:mr-4 xs:mb-4 md:mr-6 md:mb-6 hover:scale-105 transition-all ease-linear duration-200 _cursor-pointer select-none"
                    >
                        {skil}
                    </li>
                ))}
            </ul>
        </section>
    );
}
