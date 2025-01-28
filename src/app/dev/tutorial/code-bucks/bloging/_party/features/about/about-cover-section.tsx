import Image from 'next/image';
import characterImage from '../../images/character.png';

interface Props {
    attribute?: string;
}

export function AboutCoverSection({ attribute }: Props) {
    return (
        <section className="w-full md:h-[75vh] border-b-2 border-solid _border-cb-dark _dark:border-cb-light flex flex-col md:flex-row items-center justify-center _text-cb-dark">
            <div className="w-full md:w-1/2 h-full border-r-2 border-solid _border-cb-dark _dark:border-cb-light flex justify-center">
                <Image
                    className="w-4/5 xs:w-3/4 md:w-full h-full object-contain object-center"
                    src={characterImage}
                    alt="character.png"
                    priority={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1180px) 50vw, 50vw"
                />
            </div>
            <div className="w-full md:w-1/2 flex flex-col text-left items-start justify-center px-5 xs:p-10 pb-10 lg:px-16">
                <h2 className="font-bold capitalize text-3xl xs:text-4xl sxl:text-5xl text-center lg:text-left">
                    Dream Big, Work Hard, Achieve More!
                </h2>
                <p className="font-medium capitalize mt-4 text-sm md:text-base text-muted-foreground">
                    This Mantra Drives My Work As A Passionate Freelancer. I Blend Innovative Technology With Timeless Design For Captivating Digital
                    Experiences. Inspired By Nature And Literature, I&apos;m A Perpetual Learner Embracing Challenges. With Each Project, I Aim To
                    Leave A Lasting Impact—One Pixel At A Time. ~!@#$%^&*()_+<>?</>:;&ldquo; &quot; &rdquo; &rbrace; &rsquo; &lsquo; &apos; &lcub;
                    &#123; &#x7B;
                </p>
            </div>
        </section>
    );
}
