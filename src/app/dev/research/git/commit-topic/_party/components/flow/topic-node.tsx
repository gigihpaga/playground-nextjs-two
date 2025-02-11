import { CopyIcon, PlugZapIcon } from 'lucide-react';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';

import { type Topic } from '../../state/commit-topic-collection-slice';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ButtonCopy } from '@/components/ui/custom/button-copy';

import { DrawerPackage } from '../../features/drawer-package';

type PaymentCountryProps = Node<Topic>;

export function TopicNode({ id, targetPosition, data }: NodeProps<PaymentCountryProps>) {
    // console.log(`node topic: ${data.title}`, data.isCommited);

    return (
        <div className="text-xs border rounded-lg justify-center flex items-start gap-2 p-2 bg-[#e2e8f0] dark:bg-[#828b96] h-full min-w-[300px] max-w-fit overflow-hidden">
            <div className="flex flex-col gap-1">
                <ButtonCopy
                    className="nodrag size-4 rounded my-0 [&_svg:first-child]:hidden [&_svg]:size-3 [&_.btn-copy-icon-wrapper]:size-3"
                    style={{ backgroundColor: data.color }}
                    title={`copy: ${data.title}`}
                    data={data.title}
                />
                <Checkbox
                    checked={data.isCommited}
                    disabled
                    title={`mark to ${data.isCommited ? 'uncommited' : 'commited'}`}
                    className="data-[state=checked]:text-green-800 _size-3 _[&_svg]:size-3"
                    onCheckedChange={(state) => {}}
                />
            </div>
            <div className="flex-grow flex-1 gap-1">
                <h2 className="line-clamp-1 font-bold text-lg leading-none">{data.title}</h2>
                <p className="line-clamp-3 -mt-[1px]">{data.description}</p>
            </div>
            <DrawerPackage
                topicId={id}
                trigger={
                    <Button
                        aria-description={`button show drawer package ${data.title}`}
                        title="show package list"
                        className="nodrag _text-2xs h-fit w-fit p-1.5 rounded-sm leading-tight"
                    >
                        <PlugZapIcon className="size-4" />
                    </Button>
                }
            />
            {/* <Handle
                className="!size-3"
                type="source"
                style={{ backgroundColor: 'yellow' }}
                position={Position.Left}
            /> */}
            <Handle
                className="!size-[20px] !rounded-lg"
                type="target"
                style={{ backgroundColor: 'green' }}
                position={targetPosition || Position.Right}
            />
        </div>
    );
}
