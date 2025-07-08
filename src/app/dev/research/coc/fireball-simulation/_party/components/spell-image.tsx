'use client';

import Image from 'next/image';

import { spellEarthquake, spellInvisible } from '../constants';

export const SpellImage = {
    invisible: (
        <Image
            className="aspect-square object-center object-cover opacity-90"
            width={20}
            height={20}
            // priority
            loading="lazy"
            quality={40}
            src={spellInvisible.imageUrl}
            alt={spellInvisible.name}
        />
    ),
    earthquake: (
        <Image
            className="aspect-square object-center object-cover opacity-90"
            width={20}
            height={20}
            // priority
            loading="lazy"
            quality={40}
            src={spellEarthquake.imageUrl}
            alt={spellEarthquake.name}
        />
    ),
};
