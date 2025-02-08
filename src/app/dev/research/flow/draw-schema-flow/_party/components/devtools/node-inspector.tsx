import { useNodes, EdgeLabelRenderer } from '@xyflow/react';

export function NodeInspector() {
    const nodes = useNodes();
    // console.log('NodeInspector', nodes);

    return (
        <EdgeLabelRenderer>
            <div className="react-flow__devtools-nodeinspector">
                {nodes.map((node) => {
                    const x = node.position.x || 0;
                    const y = node.position.y || 0;
                    const width = node.width || node.measured?.width || 0;
                    const height = node.height || node.measured?.height || 0;

                    return (
                        <NodeInfo
                            key={node.id}
                            id={node.id}
                            selected={Boolean(node.selected)}
                            type={node.type || 'default'}
                            x={x}
                            y={y}
                            width={width}
                            height={height}
                            data={node.data}
                            parrentId={node.parentId}
                        />
                    );
                })}
            </div>
        </EdgeLabelRenderer>
    );
}

type NodeInfoProps = {
    id: string;
    type: string;
    selected: boolean;
    x: number;
    y: number;
    width?: number;
    height?: number;
    data: any;
    parrentId: string | undefined;
};

function NodeInfo({ id, type, selected, x, y, width, height, data, parrentId }: NodeInfoProps) {
    // if (!width || !height) return null;

    return (
        <div
            className="react-flow__devtools-nodeinfo bg-yellow-500 w-fit h-fit p-1 [&>*:nth-child(even)]:text-gray-500"
            style={{
                position: 'absolute',
                transform: `translate(${x + (width || 0) / 2}px, ${y + (height || 0) / 2}px)`,
                // width: width * 2,
                fontSize: '8px',
            }}
        >
            <div>id: {id}</div>
            <div>
                type:&nbsp;
                <p className="inline-block underline underline-offset-[3px] !text-yellow-900">{type}</p>
            </div>
            <div>
                selected:&nbsp;
                <p className={`inline-block ${selected ? 'text-green-600' : 'text-red-600'}`}>{selected ? 'true' : 'false'}</p>
            </div>
            <div>
                parrent id:&nbsp;
                {parrentId ? <p className="inline-block text-green-500">{parrentId}</p> : <p className="inline-block">{String(parrentId)}</p>}
            </div>
            <div>
                position:&nbsp;
                <p className="inline-block">
                    <span className="text-blue-600">x: {x.toFixed(1)}</span>, <span className="text-cyan-600">y: {y.toFixed(1)}</span>
                </p>
            </div>
            <div>
                dimensions: {width} × {height}
            </div>
            <div>
                data:
                <pre className="bg-yellow-600 m-1 text-foreground">{JSON.stringify(data, null, 2)}</pre>
            </div>
        </div>
    );
}
