//'use server';

import { readFile, writeFile } from 'fs/promises';
import { createWriteStream } from 'fs';
import path from 'path';
import { cwd } from 'process';
import { JSDOM } from 'jsdom';

import { wait } from '@/utils/wait';
import { getErrorMessage } from '@/utils/get-error-message';

import dataBuildingWithoutSizeJson from '../data/data-building-without-size.json';
import dataBuildingSizeJson from '../data/data-building-size.json';

import type { DataBuildings } from '../types';

export type BuildingOriginal = {
    e: Array<{
        eid: number; //     entityid            => where n="Inferno Tower"  ==> [22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22];
        etid: number; //    entity type id      => where n="Inferno Tower"  ==> [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
        i: number; //       identity            => where n="Inferno Tower"  ==> [3, 3, 3, 3, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3]
        l: number; //       level               => where n="Inferno Tower"  ==> [1, 2, 3, 4, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8];
        mth: number; //     level upgrade by th => where n="Inferno Tower"  ==> [10, 10, 10, 11, 11, 12, 12, 12, 13, 13, 13, 14, 14, 14];
        ud: number; //      where n="Inferno Tower"                         ==> [172800, 216000, 259200, 367200, 432000, 604800, 604800, 604800, 712800, 712800, 712800, 842400, 842400, 842400];
        cd: number;
        cl: number; //      currentlevel
        c: number; //       cost
        rt: number; //      name
        n: string;
        b: number;
        bo: number;
        a: boolean;
        ub: boolean;
        uh: boolean;
    }>;
};

type BuildingEntityType = Array<{ etid: BuildingOriginal['e'][0]['etid']; name: string }>;

type DataBuildingWithOutSize = Awaited<ReturnType<typeof readBuildingOriginal>>;
type BuildingSize = { name: string; slug: string; size: { w: number; h: number }; url: string };

export const buildingEntityType: BuildingEntityType = [
    { etid: 1, name: 'army' },
    { etid: 2, name: 'defences' },
    { etid: 3, name: 'resources' },
    { etid: 4, name: 'traps' },
    { etid: 9, name: 'hero' },
    { etid: 10, name: 'town hall' },
    { etid: 22, name: 'capital gold' },
];

// class ninja
const DATA_BUILDING_WITHOUT_SIZE_PATH = path.join(cwd(), 'src/app/dev/research/queen-charge/_party/data/data-building-without-size.json'); // transform data dari clash ninja
// fadom
const DATA_BUILDING_SiZE_PATH = path.join(cwd(), 'src/app/dev/research/queen-charge/_party/data/data-building-size.json'); // grab building dari clash of clan fadom
// class ninja with fadom
export const DATA_BUILDING_PATH = path.join(cwd(), 'src/app/dev/research/queen-charge/_party/data/data-building.json'); // combine data clash ninja dan fadom. data ini yang digunakan

export async function main() {
    // await fetchAPI('https://www.clash.ninja/feed/planner/home/builders/8vpjrrqu2.json');

    const dataBuildingOriginal = await readBuildingOriginal();
    await writeJsonFile(DATA_BUILDING_WITHOUT_SIZE_PATH, dataBuildingOriginal);
    const dataBuilding = await readJsonFile<DataBuildingWithOutSize>(DATA_BUILDING_WITHOUT_SIZE_PATH);
    await downloadImage(dataBuilding);

    const dataBuildingSizeFetched = await fetchFadom();
    await writeJsonFile(DATA_BUILDING_SiZE_PATH, dataBuildingSizeFetched);
    const dataBuildingSize = await readJsonFile<BuildingSize[]>(DATA_BUILDING_SiZE_PATH);
    await writeDataBuildingWithSize(DATA_BUILDING_PATH, dataBuilding, dataBuildingSize);
}

/**
 * - [web](https://www.clash.ninja/upgrade-tracker/8vpjrrqu2/home#builders)
 * - [api](https://www.clash.ninja/feed/planner/home/builders/8vpjrrqu2.json)
 */
//? Clash Ninja
export async function readBuildingOriginal() {
    // reading json file
    const dataBuildingPath = 'src/app/dev/research/queen-charge/_party/constants/data-building-coc-8vpjrrqu2.json';
    const dataBuildingPathFinal = path.join(cwd(), dataBuildingPath);
    const dataBuildingObj = await readJsonFile<BuildingOriginal>(dataBuildingPathFinal);
    // const dataBuildingNames = ;

    // unique data
    const dataBuildingNamesUnique = Array.from(new Set(dataBuildingObj.e.map((data) => data.n)).keys()); // ['Capital Gold', 'Blacksmith', 'Inferno Tower', ...];
    const dataBuildingEntityTypeIdUnique = Array.from(new Set(dataBuildingObj.e.map((data) => data.etid)).keys());
    const dataBuildingUniqueByName = dataBuildingNamesUnique.map((name) => dataBuildingObj.e.find((data) => data.n === name));

    const dataBuilding = dataBuildingUniqueByName
        .filter((data) => {
            return dataBuildingEntityTypeIdUnique.filter((c) => c !== 22).some((_etid) => _etid == data!.etid);
        })
        .map((data) => {
            const levelsMax = dataBuildingObj.e
                .filter((data_1) => data_1.n == data?.n)
                .map((data_2) => data_2.l)
                .reduce((accumulator, currentValue) => Math.max(accumulator, currentValue), 0);

            const imageName = data!.etid == 9 ? data!.eid : `${data!.eid}_${levelsMax}`;
            return {
                name: data!.n,
                entityId: data!.eid,
                entityTypeId: data!.etid,
                entityTypeName: buildingEntityType.find((entity) => entity.etid == data!.etid)!.name,
                // slug: data!.n.replace(/[&\\/\\#,+()$~%.'":*?<>{}]/g, '_'),
                slug: data!.n.toLowerCase().replace(/[^\w]/g, '_'),
                imageUrlOriginal: `https://www.clash.ninja/images/entities/${imageName}.png`, // 9 adalah type hero
                imageUrl: `/images/coc-building/${imageName}.png`,
            };
        });
    // const filteredDummy = dataBuildingObj.e.filter((data) => data.n === 'Inferno Tower').map((data) => data.etid);

    const dataBuildingWithWall = dataBuilding.concat({
        name: 'Wall',
        entityId: 60,
        entityTypeId: 9999999999,
        entityTypeName: 'wall',
        slug: 'wall',
        imageUrlOriginal: 'https://www.clash.ninja/images/entities/60_15.png',
        imageUrl: '/images/coc-building/60_15.png',
    });

    return dataBuildingWithWall;
}

export async function downloadImage(data: DataBuildingWithOutSize) {
    try {
        console.log('starting download image');
        for (let i = 0; i < data.length; i++) {
            const imgegeUrl = data[i].imageUrlOriginal;
            const imageName = imgegeUrl.split('/').slice(-1)[0];
            const imagePathFinal = path.join(cwd(), 'public/images/coc-building', imageName);

            const res = await fetch(imgegeUrl, {
                method: 'GET',
            });
            if (res.ok) {
                const bytes = await res.arrayBuffer();
                const buffer = new Uint8Array(bytes); // cara [1]. Uint8Array feat writeFile
                await writeFile(imagePathFinal, buffer); // cara [1]. Uint8Array feat writeFile
                // const buffer2 = Buffer.from(bytes); // cara [2]. Buffer.from feat createWriteStream
                // createWriteStream(imagePathFinal).write(buffer2); // cara [2]. Buffer.from feat createWriteStream

                console.log(`open ${imagePathFinal} to see the uploaded file`);
            } else {
                console.log(`error: ${data[i].imageUrlOriginal} ${res.status} - ${res.statusText}`);
            }
            await wait(500);
        }
        console.log('finish download all image');
    } catch (error) {
        console.log(error);
    }
}

//? Fadom
export async function fetchFadom() {
    return await fetch('https://clashofclans.fandom.com/wiki/Buildings', {
        method: 'GET',
        mode: 'no-cors',
    })
        .then((res) => {
            return res.text();
        })
        .then((text) => {
            /** @type {Document} */
            let doc: Document;
            if (typeof window !== 'undefined') {
                const parser = new DOMParser(); // on client using it
                doc = parser.parseFromString(text, 'text/html'); // on client using it
            } else {
                const parser = new JSDOM(text); // on nodejs using it
                doc = parser.window.document; // on nodejs using it
            }

            // /** @type {Array<string>} */
            const arrayLinkBuilding = Array.from(doc.querySelector('table.wikitable')?.querySelectorAll<HTMLAnchorElement>('tr td a') ?? []).map(
                /** @param {HTMLAnchorElement} elmAchor */
                (elmAchor) => elmAchor.href
            );
            console.log(arrayLinkBuilding);
            return arrayLinkBuilding;
        })
        .then(async (linksBuilding) => {
            /** @param {number} delay */
            const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));
            const BASE_URL = 'https://clashofclans.fandom.com';
            /** @type {Array<{name:string,slug:string,size:{w:number,h:number},url:string,}>} */
            let arr: BuildingSize[] = [];
            /** @type {Array<string>} */
            let arrNotfound: Array<string> = [];

            for (let index = 0; index < linksBuilding.length; index++) {
                const url = `${BASE_URL}/${linksBuilding[index]}`;
                console.log(`${index}/${linksBuilding.length} >> start proses ${linksBuilding[index]}`);
                await fetch(url, { method: 'GET', mode: 'no-cors' })
                    .then((res) => res.text())
                    .then((text) => {
                        /** @type {Document} */
                        let doc;
                        if (typeof window !== 'undefined') {
                            const parser = new DOMParser(); // on client using it
                            doc = parser.parseFromString(text, 'text/html'); // on client using it
                        } else {
                            const parser = new JSDOM(text); // on nodejs using it
                            doc = parser.window.document; // on nodejs using it
                        }
                        const elmTitle = doc.getElementById('firstHeading')?.querySelector('.mw-page-title-main');
                        const elmSize = doc.getElementById('building-size-value');

                        if (elmTitle && elmSize) {
                            arr.push({
                                //
                                name: elmTitle.textContent?.replace('/Home Village', '') ?? '',
                                slug: elmTitle.textContent?.toLowerCase().replace('/home village', '').replace(/[^\w]/g, '_') ?? '',
                                size: {
                                    w: Number(elmSize.textContent?.replace('\n', '').split('x')[0]), // example: "3x3" || "2x2"
                                    h: Number(elmSize.textContent?.replace('\n', '').split('x')[1]),
                                },
                                url: url,
                            });
                        } else {
                            arrNotfound.push(url);
                            console.log(`elm building-size-value not found on: ${linksBuilding[index]}`);
                        }
                    })
                    .catch((err) => console.log(err));

                await sleep(100);
                console.log(`finish proses ${linksBuilding[index]}`);
            }
            console.table(arr);
            // console.log(JSON.stringify(arr, null, 4));
            console.table('Not found data: ', arrNotfound);
            return arr;
        })
        .catch((err) => {
            console.log(err);
            // return null;
            throw err;
        });
}

export async function writeDataBuildingWithSize(
    path: string,
    dataBuilding: DataBuildingWithOutSize,
    dataBuildingSize: BuildingSize[]
): Promise<DataBuildings> {
    const dataBuildingUpdated = dataBuilding.map((building) => {
        const dataFounded = dataBuildingSize.find((buildingFadom) => building.slug === buildingFadom.slug);

        if (dataFounded) {
            return {
                ...building,
                size: dataFounded.size,
            };
        } else {
            return {
                ...building,
                size: {
                    w: 0,
                    h: 0,
                },
            };
        }
    });

    await writeJsonFile(path, dataBuildingUpdated);
    return dataBuildingUpdated;
}

//* helper

export async function writeJsonFile(path: string, data: string | number | Record<string, unknown> | Array<unknown>) {
    try {
        await writeFile(path, JSON.stringify(data, null, 4));
        console.log(`succes create | update on file: ${path}`);
    } catch (error) {
        console.log('ERROR writeJsonFile()', error);
    }
}

export async function readJsonFile<T = Record<string, unknown | Array<unknown>>>(path: string) {
    try {
        const dataString = await readFile(path, 'utf-8');
        const dataObj = JSON.parse(dataString) as T;
        console.log(`succes read on file: ${path}`);
        return dataObj;
    } catch (error) {
        console.log('ERROR readJsonFile()', error);
        throw error;
    }
}

async function fetchAPI(url: string) {
    try {
        const res = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',

            headers: {
                'Access-Control-Allow-Origin': 'https://www.clash.ninja',
                'ASP.NET_SessionId': 'vrszgtejik5cw2ccep2up2df',
                '.ASPXAUTH':
                    '8810153E742D59A81880BEEB2225BA8AFB426B88F4DB8210C7012F58FCFFAAA7B8BD6569A7E281B4CA43D112481353CBEF7D122EF837AE7D7E43775C5DEDB88E63A07FA4B6DA24964B2CA76788C9E4CB9B4F223F063D61068F6D4BE7186A3AB9',
                _ASPXAUTH:
                    '8810153E742D59A81880BEEB2225BA8AFB426B88F4DB8210C7012F58FCFFAAA7B8BD6569A7E281B4CA43D112481353CBEF7D122EF837AE7D7E43775C5DEDB88E63A07FA4B6DA24964B2CA76788C9E4CB9B4F223F063D61068F6D4BE7186A3AB9',
                ASPXAUTH:
                    'Bearer 8810153E742D59A81880BEEB2225BA8AFB426B88F4DB8210C7012F58FCFFAAA7B8BD6569A7E281B4CA43D112481353CBEF7D122EF837AE7D7E43775C5DEDB88E63A07FA4B6DA24964B2CA76788C9E4CB9B4F223F063D61068F6D4BE7186A3AB9',
                Authorization:
                    'Bearer 8810153E742D59A81880BEEB2225BA8AFB426B88F4DB8210C7012F58FCFFAAA7B8BD6569A7E281B4CA43D112481353CBEF7D122EF837AE7D7E43775C5DEDB88E63A07FA4B6DA24964B2CA76788C9E4CB9B4F223F063D61068F6D4BE7186A3AB9',
            },
        });
        if (res.ok) {
            const json = await res.json();
            console.log(json);
        } else {
            console.log(`Error fetching data on ${url}, ${res.status}, ${res.statusText}`);
        }
    } catch (error) {
        console.log('Error fetchAPI', error);
    }
}
