'use client';

import * as React from 'react';
import { DotLottiePlayer } from '@dotlottie/react-player';

import '@dotlottie/react-player/dist/index.css';

export function LottieAnimation() {
    return (
        <DotLottiePlayer
            src="/assets/bear.lottie"
            autoplay
            loop
        />
    );
}
