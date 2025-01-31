import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useReactFlow } from '@xyflow/react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

const PAYMENT_PROVIDERS = [
    { code: 'St', name: 'Stripe' },
    { code: 'Gp', name: 'Google Pay' },
    { code: 'Ap', name: 'Apple Pay' },
    { code: 'Pp', name: 'Paypal' },
    { code: 'Am', name: 'Amazon Pay' },
];

export function PaymentProviderSelect() {
    const [isOpen, setIsOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const onProviderClick = ({ name, code }: { name: string; code: string }) => {
        const location = Math.random() * 500;

        setNodes((prevNodes) => [
            ...prevNodes,
            {
                id: `${prevNodes.length + 1}`,
                data: { name, code },
                type: 'paymentProvider',
                position: { x: location, y: location },
            },
        ]);
    };

    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="border bg-slate-200 p-2 space-y-2 rounded"
        >
            <CollapsibleTrigger className="flex gap-x-1 ">
                Add Payment Provider
                {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </CollapsibleTrigger>
            <CollapsibleContent className="flex flex-col gap-y-2">
                {PAYMENT_PROVIDERS.map((provider) => (
                    <Button
                        size="sm"
                        key={provider.code}
                        onClick={() => onProviderClick(provider)}
                    >
                        {provider.name}
                    </Button>
                ))}
            </CollapsibleContent>
        </Collapsible>
    );
}
