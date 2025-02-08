'use client';

// import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
// import { getNodesSelecteds, updateNodesColor } from '../../state/draw-slice';
import { selectorDraw, shallow, useDrawStore } from '../../../state/draw-store';
import { type BaseShapeVariants, themeInlineStyleList, baseShapeVariantsSchema } from '../../../components/base-shape';
import styles from '@/components/ui/custom/rg.module.scss';
import { CircleIcon } from 'lucide-react';
import { cn } from '@/lib/classnames';
import type { Node } from '@xyflow/react';

export function PanelTopRight() {
    return (
        <aside
            className="bg-background border rounded-[11px] h-fit max-height-[80vh] m-2 touch-auto overscroll-none overflow-y-auto overflow-x-hidden min-w-[100px] max-w-[200px] z-[300] relative"
            style={{ pointerEvents: 'all' }}
        >
            <SectionColor />
        </aside>
    );
}

function SectionColor() {
    // const nodesSelecteds = useAppSelector(getNodesSelecteds);
    const { getNodesSeleteds, updateNodeData /* updateNodesColor */ } = useDrawStore(selectorDraw, shallow);
    const nodesSelecteds = getNodesSeleteds() ?? [];
    const colorNode = checkNodeColor(nodesSelecteds);
    // const dispatch = useAppDispatch();
    // console.log({ ids: nodesSelecteds.map((node) => node.id), colorNode });
    return (
        <section className="h-fit w-fit">
            <div className={cn(styles['rg'], '!grid grid-cols-4 grid-flow-row overflow-hidden p-[4px]')}>
                {themeInlineStyleList.map((theme) => (
                    <button
                        key={theme.colorName}
                        className={cn(styles['rg__item'], ' !px-0')}
                        data-state={colorNode === theme.colorName ? 'hinted' : undefined}
                        aria-label={theme.colorName}
                        title={`color - ${theme.colorName}`}
                        onClick={() => {
                            if (!nodesSelecteds.length) return;
                            // console.log('button color clicked');
                            // dispatch(updateNodesColor({ ids: nodesSelecteds.map((node) => node.id), theme: theme.colorName }));
                            // const updatedNodeColor = {
                            //     ids: nodesSelecteds.map((node) => node.id),
                            //     theme: theme.colorName,
                            // };
                            // updateNodesColor(updatedNodeColor);
                            nodesSelecteds.forEach((node) => {
                                const isHaveKeyTheme = baseShapeVariantsSchema.pick({ theme: true }).passthrough().safeParse(node?.data);
                                if (!isHaveKeyTheme.success)
                                    return console.error('color not apply, because current node selected not have property theme');
                                updateNodeData(node.id, { ...isHaveKeyTheme, theme: theme.colorName });
                            });
                        }}
                    >
                        <CircleIcon
                            className="size-6"
                            fill={theme.colorA}
                            stroke={theme.colorB}
                        />
                    </button>
                ))}
            </div>
            <div>slider</div>
        </section>
    );
}

function checkNodeColor(nodes: Node[]) {
    if (nodes.length === 0) {
        return undefined;
    } else if (nodes.length === 1) {
        const b = 'theme' in nodes[0].data ? (nodes[0].data.theme as BaseShapeVariants['theme']) : undefined;
        return b;
    } else {
        const nodesHasTheme = nodes.filter((node) => {
            if ('theme' in nodes[0].data && typeof nodes[0].data.theme === 'string') return true;
            return false;
        }) as Node<{ theme: BaseShapeVariants['theme'] }>[];
        const firstTheme = nodesHasTheme[0]?.data?.theme;
        return nodesHasTheme.every((element) => element.data.theme === firstTheme) ? firstTheme : undefined;
    }
}
