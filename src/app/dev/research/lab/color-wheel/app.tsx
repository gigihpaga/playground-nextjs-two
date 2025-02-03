'use client';
import React from 'react';
import ReinventedColorWheel from 'reinvented-color-wheel/react';
import * as LCC from '@adobe/leonardo-contrast-colors';

export function App() {
    const [hex, setHex] = React.useState<string>('#000000');
    return (
        <>
            <ReinventedColorWheel
                // hsv={[0, 100, 100]}
                // hsl={[0, 100, 50]}
                // rgb={[255, 0, 0]}
                // hex="#ff0000"
                hex={hex}
                wheelDiameter={200}
                wheelThickness={20}
                handleDiameter={16}
                wheelReflectsSaturation
                onChange={({ hex }) => setHex(hex)}
            />
            <input
                value={hex}
                onChange={(e) => {
                    setHex(e.target.value);
                    console.log('hex', e.target.value);
                }}
            />
        </>
    );
}
