import { type Metadata } from 'next';
import { ContactForm, LottieAnimation } from '../../_party/features/contact';
import { siteMetadata } from '../../_party/constants';

export const metadata: Metadata = {
    title: 'Contact Me',
    description: `Contact me through the form available on this page or email me at ${siteMetadata.email}`,
};

export default async function PageContact() {
    return (
        <section className="w-full h-auto md:h-[75vh] border-b-2 border-solid border-cb-dark dark:border-cb-light flex flex-col md:flex-row items-center justify-center ">
            <div className="inline-block w-full sm:w-4/5 md:w-2/5 h-full lg:border-r-2 border-solid border-cb-dark dark:border-cb-light">
                <LottieAnimation />
            </div>
            <div className="w-full md:w-3/5 flex flex-col items-start justify-center px-5 xs:px-10 md:px-16 pb-8 ">
                <h2 className="font-bold capitalize text-2xl xs:text-3xl sm:text-4xl">Let&apos;s Connect!</h2>
                <ContactForm />
            </div>
        </section>
    );
}
