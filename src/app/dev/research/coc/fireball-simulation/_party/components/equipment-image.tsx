'use client';

import Image from 'next/image';

export const EquipmentImage = {
    fireball: (
        <Image
            className="aspect-square object-center object-cover opacity-90"
            width={20}
            height={20}
            // priority
            loading="lazy"
            quality={40}
            src={'/images/coc-equipment/176_24.png'}
            alt={'Fireball'}
        />
    ),
};
