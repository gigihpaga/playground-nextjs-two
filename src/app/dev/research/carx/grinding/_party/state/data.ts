import { Club, HistoryQuestClub, DailyQuestIncome, WalletEntry } from '../types';

export const clubs: Club[] = [
    {
        id: 'burnout_rangers',
        name: 'burnout rangers',
        class: 'c2',
        color: 'green',
        car: '32r',
        quest: {
            cooldownTime: 7_200_000,
            gold: 1,
            silver: 5_000,
        },
    },
    {
        id: 'kanjo_spirit',
        name: 'kanjo spirit',
        class: 'c2',
        color: 'green',
        car: 'hcr',
        quest: {
            cooldownTime: 7_200_000,
            gold: 1,
            silver: 5_000,
        },
    },
    {
        id: 'wild_juniors',
        name: 'wild juniors',
        class: 'c1',
        color: 'green',
        car: 'ecl',
        quest: {
            cooldownTime: 7_200_000, // 2 jam (1000 * 60 * 60 * 2)
            gold: 1,
            silver: 3_000,
        },
    },
    {
        id: 'union_underground',
        name: 'union underground',
        class: 'c1',
        color: 'green',
        car: 'hc6',
        quest: {
            cooldownTime: 7_200_000,
            gold: 1,
            silver: 3_000,
        },
    },
    //
    {
        id: 'savage',
        name: 'savage',
        class: 'c3',
        color: 'red',
        car: 's15',
        quest: {
            cooldownTime: 10_800_000,
            gold: 1,
            silver: 7_000,
        },
    },
    {
        id: 'falcons_outlaws',
        name: 'falcons outlaws',
        class: 'c3',
        color: 'red',
        car: 'ev9',
        quest: {
            cooldownTime: 10_800_000,
            gold: 1,
            silver: 7_000,
        },
    },
    {
        id: 'street_hunters',
        name: 'street hunters',
        class: 'c3',
        color: 'red',
        car: 's80',
        quest: {
            cooldownTime: 10_800_000, // 3 jam
            gold: 1,
            silver: 7_000,
        },
    },
    {
        id: 'speedstar_energy',
        name: 'speedstar energy',
        class: 'c3',
        color: 'red',
        car: 'dx7',
        quest: {
            cooldownTime: 10_800_000,
            gold: 1,
            silver: 10_000,
        },
    },
    //
    {
        id: 'road_runners',
        name: 'road runners',
        class: 'c4',
        color: 'purple',
        car: 'bm2',
        quest: {
            cooldownTime: 14_400_000, // 4 jam
            gold: 1,
            silver: 10_000,
        },
    },
    {
        id: 'pythons',
        name: 'pythons',
        class: 'c4',
        color: 'purple',
        car: 's90',
        quest: {
            cooldownTime: 14_400_000, // 4 jam
            gold: 1,
            silver: 10_000,
        },
    },
    {
        id: 'western_siera',
        name: 'western siera',
        class: 'c2',
        color: 'purple',
        car: 'r86',
        quest: {
            cooldownTime: 14_400_000, // 4 jam
            gold: 1,
            silver: 7_000,
        },
    },
    {
        id: 'drift_united',
        name: 'drift united',
        class: 'c4',
        color: 'purple',
        car: 'g86',
        quest: {
            cooldownTime: 14_400_000,
            gold: 1,
            silver: 10_000,
        },
    },
    //
    {
        id: 'speedline_syndicate',
        name: 'speedline syndicate',
        class: 'c5',
        color: 'orange',
        car: '35r',
        quest: {
            cooldownTime: 18_000_000,
            gold: 2,
            silver: 11_000,
        },
    },
    {
        id: 'arctic_outlaws',
        name: 'arctic outlaws',
        class: 'c4',
        color: 'orange',
        car: 'm4r',
        quest: {
            cooldownTime: 18_000_000, // 5 jam
            gold: 2,
            silver: 11_000,
        },
    },
    {
        id: '21_tribe',
        name: '21 tribe',
        class: 'c5',
        color: 'orange',
        car: 'dx7',
        quest: {
            cooldownTime: 18_000_000,
            gold: 0,
            silver: 0,
        },
    },
    //
    {
        id: 'grip_masters',
        name: 'grip masters',
        class: 'c5',
        color: 'blue',
        car: 'mgt',
        quest: {
            cooldownTime: 21_600_000, // 6 jam
            gold: 3,
            silver: 15_000,
        },
    },
    {
        id: 'black_lotus',
        name: 'black lotus',
        class: 'c6',
        color: 'blue',
        car: 'lmh',
        quest: {
            cooldownTime: 21_600_000, // 6 jam
            gold: 3,
            silver: 12_000,
        },
    },
    {
        id: 'car_delivery_2_gold',
        name: 'car delivery 2 gold',
        class: 'cd2',
        color: 'yellow',
        car: 'nocar',
        quest: {
            cooldownTime: 21_600_000, // 6 jam
            gold: 2,
            silver: 0,
        },
    },
    {
        id: 'box_delivery_2_gold',
        name: 'box delivery 2 gold',
        class: 'bd2',
        color: 'yellow',
        car: 'nocar',
        quest: {
            cooldownTime: 21_600_000, // 6 jam
            gold: 2,
            silver: 0,
        },
    },
];
