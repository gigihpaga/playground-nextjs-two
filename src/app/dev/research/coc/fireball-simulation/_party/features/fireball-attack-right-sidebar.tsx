import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { TableLayoutCollection } from '@/app/dev/research/coc/queen-charge/_party/features/table-layout-collection';
import AttackTool from './attack-tool';
import AttackSetting from './attack-setting';

export function FireballAttackRightSidebar() {
    return (
        <div className="space-y-2">
            <h1 className="font-bold text-xl mb-4">Fireball Attack</h1>
            <AccordionDemo />
        </div>
    );
}

function AccordionDemo() {
    return (
        <Accordion
            type="multiple"
            className="w-full"
        >
            <AccordionItem value="item-1">
                <AccordionTrigger className="[&>svg]:text-foreground">Layout collection</AccordionTrigger>
                <AccordionContent className="dark:bg-[#21242b] bg-[#f4f5f7] px-2 py-4 rounded-lg">
                    <TableLayoutCollection />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger className="[&>svg]:text-foreground">Attack Tools</AccordionTrigger>
                <AccordionContent className="dark:bg-[#21242b] bg-[#f4f5f7] px-2 py-4 rounded-lg">
                    <AttackTool />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger className="[&>svg]:text-foreground">Attack Settings</AccordionTrigger>
                <AccordionContent className="dark:bg-[#21242b] bg-[#f4f5f7] px-2 py-4 rounded-lg">
                    <AttackSetting />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
