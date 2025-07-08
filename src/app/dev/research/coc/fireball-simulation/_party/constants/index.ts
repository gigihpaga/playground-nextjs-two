import { type BuildingOnBoard, LayoutCollection } from '@/app/dev/research/coc/queen-charge/_party/types';
import { Spell, Hero } from '../types';

export const heroWarden: Hero = {
    name: 'Grand Warden',
    entityId: 63,
    entityTypeId: 9,
    entityTypeName: 'hero',
    slug: 'grand_warden',
    imageUrlOriginal: 'https://www.clash.ninja/images/entities/63.png',
    imageUrl: '/images/coc-building/63.png',
    size: { w: 3, h: 3 },
};

export const spellInvisible: Spell = {
    name: 'Invisibility Spell',
    entityId: 124,
    entityTypeId: 6,
    entityTypeName: 'spell',
    slug: 'invisibility_spell',
    imageUrlOriginal: 'https://www.clash.ninja/images/entities/124.png',
    imageUrl: '/images/coc-lab/124_4.png',
    /**
     * perlu dikalikan dengan 2 karena logic diaplikasi sudah terbiasa memperlakukan ukuran itu total dari width * SIZE_SHAPE
     * sedangkan untuk spell yang di ketahui dari [Invisibility_Spell](https://clashofclans.fandom.com/wiki/Invisibility_Spell)
     * itu adalah radius (bukan diameter). aplikasi butuh diameter untuk menentukan ukurannya
     */
    radius: 4 * 2,
};

export const spellEarthquake: Spell = {
    name: 'Earthquake Spell',
    entityId: 50,
    entityTypeId: 6,
    entityTypeName: 'spell',
    slug: 'earthquake_spell',
    imageUrlOriginal: 'https://www.clash.ninja/images/entities/50.png',
    imageUrl: '/images/coc-lab/50_4.png',
    radius: 4.7 * 2,
};
