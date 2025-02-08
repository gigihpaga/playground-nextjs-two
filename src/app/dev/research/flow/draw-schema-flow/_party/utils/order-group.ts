type Nd = { id: string; parentId?: string };

var node: Array<Nd> = [
    /**
     * 1. a, f, h
     * 2. b, e, g, i
     * 3. c, d
     * 4. j
     *
     * { id: 'a' },
     * { id: 'f' },
     * { id: 'h' },
     *
     * { id: 'b', parentId: 'f' },
     * { id: 'e', parentId: 'h' },
     * { id: 'g', parentId: 'f' },
     * { id: 'i', parentId: 'a' },
     *
     * { id: 'c', parentId: 'e' },
     * { id: 'd', parentId: 'b' },
     *
     * { id: 'j', parentId: 'd' },
     */
    { id: 'a' },
    { id: 'b', parentId: 'f' },
    { id: 'c', parentId: 'e' },
    { id: 'd', parentId: 'b' },
    { id: 'e', parentId: 'h' },
    { id: 'f' },
    { id: 'g', parentId: 'f' },
    { id: 'h' },
    { id: 'i', parentId: 'a' },
    { id: 'j', parentId: 'd' },
];

var node2 = [
    /**
     * { id: 'b', parentId: 'a' },
     * { id: 'c', parentId: 'b' },
     * { id: 'd', parentId: 'c' },
     * { id: 'z', parentId: 'b' },
     */
    { id: 'a' },
    { id: 'b', parentId: 'a' },
    { id: 'c', parentId: 'b' },
    { id: 'd', parentId: 'c' },
    { id: 'x' },
    { id: 'y', parentId: 'x' },
    { id: 'z', parentId: 'b' },
];

type Item<T> = {
    id: string;
    parentId?: string;
} & T;

export function orderGroup<T>(list: Item<T>[]): Item<T>[] {
    const itemMap = new Map<string, Item<T>>();
    list.forEach((item) => itemMap.set(item.id, item));

    const newList: Item<T>[] = [];
    const addedItems = new Set<string>();

    function addItemAndChildren(item: Item<T>) {
        if (addedItems.has(item.id)) return;
        if (item.parentId && !addedItems.has(item.parentId)) {
            addItemAndChildren(itemMap.get(item.parentId)!);
        }
        newList.push(item);
        addedItems.add(item.id);
    }

    list.forEach((item) => addItemAndChildren(item));

    return newList;
}

interface Node {
    id: string;
    parentId?: string;
}

export function searchChilds<T extends Node>(nodes: T[], id: string): T[] {
    let result: T[] = [];

    function findChildren(parentId: string) {
        nodes.forEach((node) => {
            if (node.parentId === parentId) {
                result.push(node);
                findChildren(node.id); // Recursively find children
            }
        });
    }

    findChildren(id);
    return result;
}

function order() {
    const list = [
        { id: 'a' },
        { id: 'b', parentId: 'f' },
        { id: 'c', parentId: 'e' },
        { id: 'd', parentId: 'b' },
        { id: 'e', parentId: 'h' },
        { id: 'f' },
        { id: 'g', parentId: 'f' },
        { id: 'h' },
        { id: 'i', parentId: 'a' },
        { id: 'j', parentId: 'd' },
    ];

    type List = typeof list;
    type Item = List[number];

    const itemMap = new Map();
    list.forEach((item) => itemMap.set(item.id, item));

    const newList: List = [];
    const addedItems = new Set();

    function addItemAndChildren(item: Item) {
        if (addedItems.has(item.id)) return;
        if (item.parentId && !addedItems.has(item.parentId)) {
            addItemAndChildren(itemMap.get(item.parentId));
        }
        newList.push(item);
        addedItems.add(item.id);
    }

    list.forEach((item) => addItemAndChildren(item));
    console.log(newList);
}
