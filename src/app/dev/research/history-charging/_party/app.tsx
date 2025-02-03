'use client';

import { useEffect, useRef } from 'react';
import type { LoggerCharging } from '../_party/types/logger-charging';
import HistoryChargingStyle from './history-charging.module.scss';
import a from './Data Charging.json';
const b = require('./Data Charging.json');

function makeDate(dateInput: string) {
    // from 24/05/23 14.23
    // to 2023/05/24 14:23
    if (!dateInput || dateInput === '-') return undefined;
    const dateLongOld = dateInput.split(' ')[0]; // 24/05/23
    const timeOld = dateInput.split(' ')[1]; // 14.23

    const date = dateLongOld.split('/')[0]; // 24
    const month = dateLongOld.split('/')[1]; // 05
    const year = dateLongOld.split('/')[2]; // 23
    const yearLong = `20${year}`; // 2023
    const time = timeOld.replace('.', ':'); // 14:23

    const newDate = new Date(`${yearLong}/${month}/${date} ${time}`);
    if (isNaN(newDate.getTime())) return undefined;
    return newDate;
}

function diffDate(date1: Date, date2: Date) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const diffTimeInMilisecond = Math.abs(date2.getTime() - date1.getTime());

    const dayDiff = Math.floor(diffTimeInMilisecond / day);
    const remainderAfterDay = diffTimeInMilisecond % day;

    const hourDiff = Math.floor(remainderAfterDay / hour);
    const remainderAfterHour = remainderAfterDay % hour;

    const minuteDiff = Math.floor(remainderAfterHour / minute);
    const remainderAfterMinute = remainderAfterHour % minute;

    const secondDiff = Math.floor(remainderAfterMinute / second);

    let diffString = '';

    if (dayDiff > 0) {
        diffString += `${dayDiff} day${dayDiff > 1 ? 's' : ''} `;
    }
    if (hourDiff > 0) {
        diffString += `${hourDiff} hour${hourDiff > 1 ? 's' : ''} `;
    }
    if (minuteDiff > 0) {
        diffString += `${minuteDiff} minute${minuteDiff > 1 ? 's' : ''} `;
    }
    if (secondDiff > 0) {
        diffString += `${secondDiff} second${secondDiff > 1 ? 's' : ''} `;
    }

    return diffString.trim() || '0 seconds'; // Return "0 seconds" if no difference
}

export function App({ loggerCharging }: { loggerCharging: LoggerCharging }) {
    console.log('loggerCharging', loggerCharging);
    const tableRef = useRef<HTMLTableElement | null>(null);
    const templateRowRef = useRef<HTMLTemplateElement | null>(null);
    console.log('a', a);
    console.log('b', b);

    function manupulationTable() {
        if (!tableRef.current || !templateRowRef.current) return;
        const table = tableRef.current;
        const templateRow = templateRowRef.current;
        const tBody = table.querySelector('tbody');

        loggerCharging.dataCharging
            // .slice(0, 1)
            .forEach((historyCharge, idx) => {
                const cloneTemplate = templateRow.cloneNode(true) as HTMLTemplateElement;
                const cloneRow = cloneTemplate.querySelector('tr')!;
                const tds = cloneRow.getElementsByTagName('td');

                tds[0].textContent = idx.toString();

                tds[1].textContent = historyCharge.startChargingDate;

                tds[2].style.textAlign = 'center';
                tds[2].textContent = historyCharge.startChargingCapacity.toString();

                tds[3].style.textAlign = 'center';
                tds[3].textContent = historyCharge.fullyChargingDate;

                tds[4].textContent = historyCharge.endChargingDate;

                tds[5].style.textAlign = 'center';
                tds[5].textContent = historyCharge.endChargingCapacity.toString();

                const nextHistoryCharge = loggerCharging.dataCharging[idx + 1];

                tds[6].style.textAlign = 'center';
                tds[6].textContent = nextHistoryCharge === undefined ? '-' : nextHistoryCharge.startChargingDate;

                tds[7].style.textAlign = 'center';
                tds[8].style.textAlign = 'center';
                tds[9].style.textAlign = 'center';
                if (nextHistoryCharge !== undefined) {
                    const currDate = makeDate(historyCharge.endChargingDate);
                    const nextDate = makeDate(nextHistoryCharge.startChargingDate);
                    // console.log(idx, currDate, nextDate);
                    const formatDate = new Intl.DateTimeFormat('id-ID', {
                        timeZone: 'Asia/Jakarta',
                        dateStyle: 'long',
                        timeStyle: 'medium',
                        hour12: false,
                    });
                    // newTd6.textContent = formatDate.format(currDate);
                    if (currDate && nextDate) {
                        tds[7].textContent = nextHistoryCharge.startChargingCapacity.toString();
                        tds[8].textContent = (historyCharge.endChargingCapacity - nextHistoryCharge.startChargingCapacity).toString();
                        const diff = diffDate(currDate, nextDate);
                        tds[9].textContent = diff;
                    } else {
                        tds[7].textContent = '-';
                        tds[8].textContent = '-';
                        tds[9].textContent = '-';
                    }
                } else {
                    tds[7].textContent = '-';
                    tds[8].textContent = '-';
                    tds[9].textContent = '-';
                }
                // newTr.appendChild(newTd7);

                tBody?.appendChild(cloneRow);
            });
    }

    useEffect(() => {
        manupulationTable();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <table
                className={HistoryChargingStyle['tbl-style']}
                ref={tableRef}
            >
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Charging At</th>
                        <th>Charging From (%)</th>
                        <th>Full Date</th>
                        <th>Charging Until</th>
                        <th>Charging to (%)</th>
                        <th>Using Until</th>
                        <th>Using to (%)</th>
                        <th>Used (%)</th>
                        <th>Life Time</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
            <template
                ref={templateRowRef}
                id="template-row"
            >
                <tr>
                    <td>No</td>
                    <td>Charging At</td>
                    <td>Charging From (%)</td>
                    <td>Full Date</td>
                    <td>Charging Until</td>
                    <td>Charging to (%)</td>
                    <td>Using Until</td>
                    <td>Using to (%)</td>
                    <td>Used (%)</td>
                    <td>Life Time</td>
                </tr>
            </template>
        </>
    );
}
