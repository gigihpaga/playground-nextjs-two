// import { Box, Flex, IconButton, Image, Text } from '@chakra-ui/react';
import React from 'react';
import Image from 'next/image';
import { XIcon } from 'lucide-react';
import { Handle, Position, useReactFlow, type Node, type NodeProps } from '@xyflow/react';

import { CustomHandle } from './custom-handle';
import { Button } from '@/components/ui/button';

const PAYMENT_PROVIDER_IMAGE_MAP: { [code: string]: string } = {
    St: 'https://cdn.worldvectorlogo.com/logos/stripe-2.svg',
    Ap: 'https://cdn.worldvectorlogo.com/logos/apple-14.svg',
    Gp: 'https://cdn.worldvectorlogo.com/logos/google-g-2015.svg',
    // Pp: 'https://avatars.githubusercontent.com/u/476675?s=280&v=4',
    Pp: 'https://cdn.worldvectorlogo.com/logos/paypal-3.svg',
    // Am: 'https://static.wixstatic.com/media/d2252d_4c1a1bda6a774bd68f789c0770fd16e5~mv2.png',
    Am: 'https://cdn.worldvectorlogo.com/logos/amazon-web-services-2.svg',
};

type PaymentProviderProps = Node<{
    name: string;
    code: string;
}>;

export function PaymentProvider({ data: { name, code }, id }: NodeProps<PaymentProviderProps>) {
    const { setNodes } = useReactFlow();

    return (
        <div className="w-[140px] gap-2 py-[2px] px-2 rounded-full bg-white items-center justify-center flex border-2 border-[#5e5eff]">
            <div className="size-4 relative">
                <Image
                    alt="payment-provider"
                    fill
                    quality={50}
                    src={PAYMENT_PROVIDER_IMAGE_MAP[code]}
                />
            </div>
            <div className="flex-grow py-1">
                <h2 className="text-xs _-mt-1 text-nowrap">{name}</h2>
            </div>
            <Button
                aria-label="Delete Payment Provider"
                className="size-4"
                size="icon"
                onClick={() => {
                    setNodes((prevNodes) => {
                        return prevNodes.filter((node) => node.id !== id);
                    });
                }}
            >
                <XIcon className="text-destructive" />
            </Button>
            <CustomHandle
                type="target"
                position={Position.Left}
            />
        </div>
    );
}
