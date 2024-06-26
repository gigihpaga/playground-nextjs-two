'use client';

import React, { cloneElement } from 'react';
import Image from 'next/image';
import styles from './_party/dnd.module.scss';

import { cn } from '@/lib/classnames';

export default function FundamentalDragAndDropPage() {
    //required event listeners
    /*     
    document.body.addEventListener('dragstart', handleDragStart); //for draggable
    document.body.addEventListener('drop', handleDrop); //for dropzone
    document.body.addEventListener('dragover', handleOver); //for dropzone
    */
    //optional but useful events
    /*  
    document.body.addEventListener('mousedown', handleCursorGrab);
    document.body.addEventListener('dragenter', handleEnter);
    document.body.addEventListener('dragleave', handleLeave);
    */

    return (
        <div className={cn(styles['dnd-app'], '')}>
            <header className={cn(styles['header'])}>
                <h1>Drag n Drop</h1>
            </header>
            <main className={cn(styles['main'], 'bg-purple-500')}>
                <section className={cn(styles['section'])}>
                    <h2>Dragon</h2>
                    <div
                        className=""
                        aria-description="cards wrapper"
                    >
                        <Draggable>
                            <p>Just a paragraph with some text.</p>
                        </Draggable>
                        <Draggable>
                            <a href="https://www.google.ca/">Google Link</a>
                        </Draggable>
                        <Draggable>
                            <Image
                                src="/uploads/projaqk - Gorgeous gradient inspirations for designers.jpg"
                                alt="dragon image 1"
                                // fill
                                width={200}
                                height={200}
                                priority
                                quality={50}
                            />
                        </Draggable>
                        <Draggable>
                            <Image
                                src="/uploads/react 3d.webp"
                                alt="dragon image 2"
                                // fill
                                width={200}
                                height={200}
                                priority
                                quality={50}
                            />
                        </Draggable>
                    </div>
                    {/* all images from pexels.com */}
                </section>
                <section className={cn(styles['section'], styles['drop'])}>
                    <h2>Droppin</h2>
                    <DropZone />
                </section>
            </main>
            <footer className={cn(styles['footer'])}>
                <p>&copy; 2021 Chicken Stuff Inc.</p>
            </footer>
        </div>
    );
}

function Draggable({ children, className, ...props }: React.HtmlHTMLAttributes<HTMLDivElement>) {
    function handleOnDragStart(ev: React.DragEvent<HTMLDivElement>) {
        //user started to drag a draggable from the webpage
        // ev.preventDefault();
        console.log('DRAG START');
        ev.currentTarget.classList.add(styles['dragging']); //close the hand

        let objElm = (ev.currentTarget as HTMLDivElement).firstChild as HTMLParagraphElement & HTMLImageElement & HTMLAnchorElement;

        let myData = {
            id: 1231,
            tag: objElm.tagName,
            text: objElm.textContent || objElm.alt || 'no text',
            url: objElm.src || objElm.href || 'no src|href',
            timestamp: Date.now(),
        };

        ev.dataTransfer.setData('application/json', JSON.stringify({ data: { ...myData } }));
        objElm.setAttribute('data-timestamp', myData.timestamp.toString());
        // ev.dataTransfer.setDragImage()

        let dataList = Array.from(ev.dataTransfer.items);
        console.log('dataList ', dataList);

        console.log('obj', ev.dataTransfer);
        return false;
    }

    function handleOnDragEnd(ev: React.DragEvent<HTMLDivElement>) {
        // ev.preventDefault();
        console.log('DRAG END');
        ev.currentTarget.classList.remove(styles['dragging']); //close the hand
    }

    function handleMouseDown(ev: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        // ev.preventDefault();
    }

    function handleOnMouseUp(ev: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        //
    }

    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
            className={cn(styles['draggable'], className)}
            draggable="true"
            aria-description="card"
            {...props}
            onDragStart={handleOnDragStart}
            onDragEnd={handleOnDragEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleOnMouseUp}
        >
            {children}
        </div>
    );
}

function DropZone({ children, className, ...props }: React.HtmlHTMLAttributes<HTMLDivElement>) {
    function handleOnDrop(ev: React.DragEvent<HTMLDivElement>) {
        //for dropzone
        ev.preventDefault();
        let data = JSON.parse(ev.dataTransfer.getData('application/json'));
        const dragingElm = document.querySelector(`[data-timestamp="${data.data.timestamp}"]`);
        const cloneElm = dragingElm?.cloneNode(true) as HTMLParagraphElement | HTMLImageElement | HTMLAnchorElement | undefined;
        cloneElm ? ev.currentTarget.append(cloneElm) : false;
        // cloneElm?.remove();

        console.log('DROPZONE DROP', data);
        console.log('DROP', ev.dataTransfer);
        // ev.currentTarget.textContent += data;
    }

    function handleOnDragOver(ev: React.DragEvent<HTMLDivElement>) {
        // for dropzone
        //fires continually, dijalankan berkali-kali setiap 100 milidetik
        ev.preventDefault();
    }

    function handleDragEnter(ev: React.DragEvent<HTMLDivElement>) {
        // for dropzone
        // fire once
        // sama seperti dragover, bedanya dragenter: dijalakankan sekali. kalo dragover: dijalankan berkali-kali setiap 100 milidetik
        ev.preventDefault();
        console.log('DROPZONE DRAG ENTER');
        ev.currentTarget.classList.add(styles['over']);
    }

    function handleDragLeave(ev: React.DragEvent<HTMLDivElement>) {
        // for dropzone
        ev.preventDefault();
        console.log('DROPZONE DRAG LEAVE');
        ev.currentTarget.classList.remove(styles['over']);
    }
    return (
        <div
            className={cn(
                styles['dropzone'],
                // styles['over']
                className
            )}
            onDrop={handleOnDrop}
            onDragOver={handleOnDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            {...props}
        >
            {children}
            &nbsp;
        </div>
    );
}
