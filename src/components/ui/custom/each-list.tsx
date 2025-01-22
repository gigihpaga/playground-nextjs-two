import { Children, type ReactNode } from 'react';

type EachListProps<T> = {
    render: (item: T, index: number) => ReactNode;
    items: T[];
};

/**
 *
 * @param {{render: (item: T, index: number) => ReactNode; of: T[];}} param0
 * @returns React.JSX.Element
 *
 * @example
 *   <EachList
 *      items={[{ name: 'paga' }, { name: 'gigih' }]}
 *      render={(item, idx) => {
 *          return <div>{item.name}</div>;
 *      }}
 *  />
 */
export function EachList<T>({ render, items }: EachListProps<T>) {
    return (
        <>
            {Children.toArray(
                items.map((item, index) => {
                    return render(item, index);
                })
            )}
        </>
    );
}
