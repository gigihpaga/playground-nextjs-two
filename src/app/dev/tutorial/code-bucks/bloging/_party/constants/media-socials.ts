import { SVGProps, type JSX } from 'react';
import { DribbleIcon, GitHubIcon, LinkedinIcon, TwitterIcon } from '../components/icons';
import { siteMetadata } from './site-meta-data';

type MediaSocial = {
    name: string;
    url: string;
    icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
};

export const mediaSocials = [
    {
        name: 'linkedin',
        icon: LinkedinIcon,
        url: siteMetadata.linkedin,
    },
    {
        name: 'twitter',
        icon: TwitterIcon,
        url: siteMetadata.twitter,
    },
    {
        name: 'github',
        icon: GitHubIcon,
        url: siteMetadata.github,
    },
    {
        name: 'dribble',
        icon: DribbleIcon,
        url: siteMetadata.dribbble,
    },
] satisfies Array<MediaSocial>;
