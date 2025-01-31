import ReactCountryFlag from 'react-country-flag';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';

type PaymentCountryProps = Node<{
    currency: string;
    country: string;
    countryCode: string;
}>;

export function PaymentCountry({ data }: NodeProps<PaymentCountryProps>) {
    return (
        <div className="text-xs border rounded flex items-start gap-2 p-2 bg-[#e2e8f0] w-[155px] overflow-hidden">
            <div>
                <ReactCountryFlag
                    countryCode={data.countryCode}
                    svg
                    aria-label={data.country}
                    style={{ fontSize: '2em' }}
                />
            </div>
            <div className="flex-grow">
                <h2>{data.country}</h2>
                <p>{data.currency}</p>
            </div>
            <Handle
                className="!size-3"
                type="source"
                style={{ backgroundColor: 'green' }}
                position={Position.Right}
            />
            <Handle
                className="!size-3"
                type="target"
                style={{ backgroundColor: 'yellow' }}
                position={Position.Left}
            />
        </div>
    );
}
