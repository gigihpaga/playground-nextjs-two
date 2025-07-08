/**
 * https://www.clash.ninja/upgrade-tracker/8vpjrrqu2/home#lab
    data-c: "25000"
    data-cpd: "0.1"
    data-currentlevel: "2"
    data-duration: "259200"
    data-end: "0"
    data-entityid: "52"
    data-identity: "0"
    data-level: "4"
    data-mth: "11"
    data-name: "Skeleton Spell"
    data-reset: "1"
    data-rt: "3"
    data-seid: "0"
    data-sl: "0"
    data-typeid: "6"
    data-ub: "false"
    data-uh: "false"
    img_url: "/images/entities/52.png"
*/
type Entity = {
    a: boolean; // false
    b: number; // 0
    bo: number; // 1
    c: number; // 25000 ===> cost
    cd: number; // 0
    cl: number; // 2 ===> current level
    eid: number; // 52 ===> entity id
    etid: number; // 6 ===> entity typeid (7=troops darkspell, 5==trops elixer, 6==Spell, 19==mesin)
    i: number; // 0 ===> indentity (relative entityid to currentlevel)
    l: number; // 4 ==> level
    mth: number; // 11 ===> in townhall
    n: string; // 'Skeleton Spell' ==> name
    rt: number; // 3
    seid: number; // 0
    sl: number; // 0
    ub: boolean; // false
    ud: number; // 259200 (3d) ==> upgrade duration
    uh: boolean; // false
};

export async function getLabs() {
    try {
        const clashNinjaCookie = process.env['CLASH_NINJA_COOKIE'];
        if (!clashNinjaCookie) throw new Error('cannot get CLASH_NINJA_COOKIE in env');

        const response = await fetch('https://www.clash.ninja/feed/planner/home/lab/8vpjrrqu2.json', {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Cookie': clashNinjaCookie || '',
            },
        });
        if (!response.ok) console.warn(`cannot get data lab clash.ninja, with status code: ${response.status}`);
        const data: { e: Entity[] } = await response.json();
        const skeleton = data.e.filter((entity) => entity.n == 'Skeleton Spell' && entity.l == 4);
        return skeleton;
    } catch (error) {
        console.warn('cannot fetch clash.ninja, with error: ', error);
    }
}
