// import { ColorHSV, ColorRGB } from '../Interfaces/Color';
/**
 * [reference code](https://codesandbox.io/p/sandbox/color-picker-forked-lf5hyd?file=%2Fsrc%2FInterfaces%2FColor.ts%3A1%2C1-18%2C1&workspaceId=40e0d485-a37f-4e0b-b527-c35fdeae136a)
 * [reference article: Building a simple Colour Picker in React from scratch](https://medium.com/geekculture/building-a-simple-colour-picker-in-react-from-scratch-8ef0d3f4e9cc)
 */
export interface Color {
    hex: string;
    rgb: ColorRGB;
    hsv: ColorHSV;
}

export interface ColorRGB {
    r: number;
    g: number;
    b: number;
}

export interface ColorHSV {
    h: number;
    s: number;
    v: number;
}

export function rgbToHex(color: ColorRGB): string {
    var { r, g, b } = color;
    var hexR = r.toString(16);
    var hexG = g.toString(16);
    var hexB = b.toString(16);

    if (hexR.length === 1) hexR = '0' + r;
    if (hexG.length === 1) hexG = '0' + g;
    if (hexB.length === 1) hexB = '0' + b;

    return '#' + hexR + hexG + hexB;
}

export function hexToRgb(color: string): ColorRGB {
    var r = 0;
    var g = 0;
    var b = 0;

    // 3 digits
    if (color.length === 4) {
        r = Number('0x' + color[1] + color[1]);
        g = Number('0x' + color[2] + color[2]);
        b = Number('0x' + color[3] + color[3]);

        // 6 digits
    } else if (color.length === 7) {
        r = Number('0x' + color[1] + color[2]);
        g = Number('0x' + color[3] + color[4]);
        b = Number('0x' + color[5] + color[6]);
    }

    return {
        r,
        g,
        b,
    };
}

export function rgbToHsv(color: ColorRGB): ColorHSV {
    var { r, g, b } = color;
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const d = max - Math.min(r, g, b);

    const h = d ? (max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? 2 + (b - r) / d : 4 + (r - g) / d) * 60 : 0;
    const s = max ? (d / max) * 100 : 0;
    const v = max * 100;

    return { h, s, v };
}

export function hsvToRgb(color: ColorHSV): ColorRGB {
    var { h, s, v } = color;
    s /= 100;
    v /= 100;

    const i = ~~(h / 60);
    const f = h / 60 - i;
    const p = v * (1 - s);
    const q = v * (1 - s * f);
    const t = v * (1 - s * (1 - f));
    const index = i % 6;

    const r = Math.round([v, q, p, p, t, v][index] * 255);
    const g = Math.round([t, v, v, q, p, p][index] * 255);
    const b = Math.round([p, p, t, v, v, q][index] * 255);

    return {
        r,
        g,
        b,
    };
}
