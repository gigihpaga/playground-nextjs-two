'use client';

import React from 'react';
import ReactVisTimeline from 'react-vis-timeline';
import { CustomTime } from 'react-vis-timeline/build/models';
import type { DateType, IdType, Timeline as VisTimeline, TimelineGroup, TimelineItem, TimelineOptions } from 'vis-timeline/types';

import { createRoot, type Root } from 'react-dom/client';

//*
// Cache untuk menyimpan instance Root
const rootCache: Map<Element, Root> = new Map();

/**
 * Mendapatkan atau membuat instance Root untuk elemen tertentu.
 * @param element Elemen DOM tempat Root akan dibuat atau diambil.
 * @returns Root React
 */
const getOrCreateRoot = (element: Element): Root => {
    if (!rootCache.has(element)) {
        const root = createRoot(element);
        rootCache.set(element, root);
    }
    return rootCache.get(element)!;
};

/**
 * Membersihkan Root dan menghapusnya dari cache.
 * @param element Elemen DOM yang akan dibersihkan Root-nya.
 */
const cleanupRoot = (element: Element): void => {
    if (rootCache.has(element)) {
        const root = rootCache.get(element)!;
        root.unmount();
        rootCache.delete(element);
    }
};

//*

/**
 * Fungsi template untuk mengintegrasikan React dengan vis-timeline.
 * @param item Data item dari timeline.
 * @param element Elemen DOM di mana item akan dirender.
 * @param data Data tambahan untuk komponen React.
 * @returns String kosong (diperlukan oleh vis-timeline).
 */
export const _template = (item: any, element: HTMLElement, data: any): string => {
    const root = getOrCreateRoot(element);

    root.render(
        <ItemComponent
            item={item}
            data={data}
        />
    );

    // Tambahkan event listener untuk membersihkan root ketika elemen dihapus
    element.addEventListener('DOMNodeRemoved', () => cleanupRoot(element), { once: true });

    // Vis-timeline membutuhkan string kosong sebagai nilai pengembalian
    return '';
};

/**
 * Fungsi template untuk mengintegrasikan React dengan vis-timeline menggunakan MutationObserver.
 * @param item Data item dari timeline.
 * @param element Elemen DOM di mana item akan dirender.
 * @param data Data tambahan untuk komponen React.
 * @returns String kosong (diperlukan oleh vis-timeline).
 */
export const template = (item: any, element: HTMLElement, data: any): string => {
    const root = getOrCreateRoot(element);

    root.render(
        <ItemComponent
            item={item}
            data={data}
        />
    );

    // Gunakan MutationObserver untuk memantau penghapusan elemen
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && !document.body.contains(element)) {
                cleanupRoot(element);
                observer.disconnect();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return '';
};
/**
 * Fungsi template untuk mengintegrasikan React dengan vis-timeline menggunakan MutationObserver.
 * @param item Data item dari timeline.
 * @param element Elemen DOM di mana item akan dirender.
 * @param data Data tambahan untuk komponen React.
 * @returns String kosong (diperlukan oleh vis-timeline).
 */
export const templateOptimaze = (item: any, element: HTMLElement, data: any, renderComponent: (item: any, data: any) => React.ReactNode): string => {
    const root = getOrCreateRoot(element);

    root.render(renderComponent(item, data));

    // Gunakan MutationObserver untuk memantau penghapusan elemen
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && !document.body.contains(element)) {
                cleanupRoot(element);
                observer.disconnect();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return '';
};

//*

interface ItemComponentProps {
    item: { id: string; content: string }; // Sesuaikan tipe data item jika ada properti lain
    data: any; // Sesuaikan tipe data jika ada struktur tertentu
}

/**
 * Komponen untuk item di timeline.
 * @param props Properti komponen, termasuk data item dan data tambahan.
 */
export const ItemComponent: React.FC<ItemComponentProps> = ({ item, data }) => {
    React.useEffect(() => {
        console.log(`Rendered item ${item.id}`);
        return () => {
            console.log(`Cleaning up item ${item.id}`);
        };
    }, [item, data]);

    return (
        <div>
            <strong>{item.content}</strong>
            <p>{data?.description}</p>
        </div>
    );
};
