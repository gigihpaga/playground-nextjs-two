import { type Metadata } from 'next';
import Link from 'next/link';

import { AboutCoverSection, SkillsSection } from '../../_party/features/about';
import { Url, siteMetadata } from '../../_party/constants';

export const metadata: Metadata = {
    title: 'About Me',
    description: 'Here are some details about my self',
};

export default function PageAbout() {
    return (
        <>
            <AboutCoverSection />
            <SkillsSection />
            <h2 className="mt-6 dark:font-normal font-semibold text-base sm:text-lg md:text-xl self-start mx-5 xs:mx-10 sm:mx-12 md:mx-16 lg:mx-20">
                Have a project in mind? Reach out to me 📞 from&nbsp;
                <Link
                    className="text-cb-accent underline underline-offset-2"
                    href={Url.contact}
                >
                    here
                </Link>
                &nbsp;and let&apos;s make it happen.
            </h2>
        </>
    );
}
