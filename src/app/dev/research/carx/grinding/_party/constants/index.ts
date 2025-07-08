export const colorList = [
    'red',
    'orange',
    'amber',
    'yellow',
    'lime',
    'green',
    'emerald',
    'teal',
    'cyan',
    'sky',
    'blue',
    'indigo',
    'violet',
    'purple',
    'fuchsia',
    'pink',
    'rose',
    'slate',
    'gray',
    'zinc',
    'neutral',
    'stone',
] as const;

export type Color = (typeof colorList)[number];

export type ColorObjType = Record<Color, { text: string; background: string }>;

export const colorObj: ColorObjType = colorList.reduce<ColorObjType>((acc, colorName, c) => {
    return {
        ...acc,
        [colorName]: { text: `text-${colorName}-500`, background: `bg-${colorName}-500` },
    };
}, {} as ColorObjType);
