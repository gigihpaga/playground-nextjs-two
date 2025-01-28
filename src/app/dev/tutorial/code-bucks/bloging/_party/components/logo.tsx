import Image from 'next/image';
import Link from 'next/link';
import profileImg from '../project-file/profile-img.png';
import { Url as url } from '../constants';

export function Logo() {
    return (
        <Link
            href={url.root}
            className="flex items-center dark:text-cb-light text-cb-dark "
        >
            <div className="mr-2 md:mr-4 w-12 md:w-16 rounded-full overflow-hidden border border-solid border-cb-dark dark:border-cb-light">
                <Image
                    src={profileImg}
                    alt="CodeBucks"
                    className="w-full h-auto rounded-full"
                    sizes="33vw"
                    priority={true}
                />
            </div>
            <span className="font-bold text-lg md:text-xl">CodeBucks</span>
        </Link>
    );
}
