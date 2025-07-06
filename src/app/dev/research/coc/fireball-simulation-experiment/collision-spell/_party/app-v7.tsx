// v7 - base code from v5, Perbaikan logika checkCollisions menggunakan v6 (bukan v6b), menambah deteksi tabrakan circle vs circle dan deteksi tabrakan circle vs square

'use client';

import React, { useRef, useState } from 'react';
import { useDraggable, DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { cn } from '@/lib/classnames';
import { Coordinates } from '@dnd-kit/utilities';

const GRID_SIZE = 20;
const BOARD_SIZE = 20 * GRID_SIZE;

const initialNodes: NodeProps[] = [
    { id: 'b1', format: { type: 'building', shape: 'square' }, position: { x: 20, y: 0 }, size: 3 },
    { id: 'b2', format: { type: 'building', shape: 'square' }, position: { x: 0, y: 160 }, size: 3 },
    { id: 'b3', format: { type: 'building', shape: 'square' }, position: { x: 260, y: 0 }, size: 2 },
    { id: 'b4', format: { type: 'building', shape: 'square' }, position: { x: 240, y: 60 }, size: 4 },
    // perlu di ketaui kenapa pada size "spell" harus dikalikan dengan 2 ? karena informasi pada [fandom](https://clashofclans.fandom.com/wiki/Earthquake_Spell) 4 itu adalah radius maka perlu dikalian 2 untuk dapat menentukan ukuran spell
    { id: 's1', format: { type: 'spell', shape: 'circle' }, position: { x: 75, y: 125 }, size: 4 * 2 },
    { id: 's3', format: { type: 'spell', shape: 'circle' }, position: { x: 75, y: 125 }, size: 4 * 2 },
    { id: 's2', format: { type: 'spell', shape: 'circle' }, position: { x: 250, y: 300 }, size: 4 },
];

interface Position {
    x: number;
    y: number;
}

type Shape =
    | {
          type: 'building';
          shape: 'square';
      }
    | {
          type: 'spell';
          shape: 'circle';
      };

interface NodeProps {
    id: string;
    format: Shape;
    position: Position;
    isColliding?: boolean;
    size: number;
}

const Node: React.FC<NodeProps> = ({ id, format, position, size, isColliding }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={cn(
                'absolute bg-pink-400/60',
                format.shape === 'circle' && 'rounded-full bg-blue-400/60',
                isColliding == true && 'bg-gray-400/60'
            )}
            style={{
                left: position.x,
                top: position.y,
                // width: type === 'building' ? 3 * GRID_SIZE : 4.7 * 2 * GRID_SIZE,
                // height: type === 'building' ? 3 * GRID_SIZE : 4.7 * 2 * GRID_SIZE,
                width: size * GRID_SIZE,
                height: size * GRID_SIZE,
                // transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : 'none',
            }}
        >
            <p
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xs font-light"
                style={{ display: 'none' }}
            >
                {id}_{JSON.stringify(position)}
                isColl: {String(isColliding)}
            </p>
            <div
                aria-description="cros"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                style={{ height: GRID_SIZE, width: GRID_SIZE }}
            >
                <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-500"
                    style={{ height: GRID_SIZE, width: 0.5 }}
                />
                <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-500"
                    style={{ height: 0.5, width: GRID_SIZE }}
                />
            </div>
        </div>
    );
};

const Board: React.FC = () => {
    const [nodes, setNodes] = useState<NodeProps[]>(initialNodes);

    const [isDragging, setIsDragging] = useState(false);
    const nodeCaptureTemp = useRef<NodeProps | null>(null);

    const handleDragStart = (event: DragStartEvent) => {
        setIsDragging(true);
        const ballActive = nodes.find((node) => node.id === event.active.id);
        if (!ballActive) return;
        nodeCaptureTemp.current = ballActive;
    };

    const handleDragMove = (event: DragEndEvent) => {
        const { active, delta } = event;
        const nodeTemp = nodeCaptureTemp.current;

        if (!nodeTemp) return;
        if (nodeTemp.id !== active.id) {
            console.error('nodeTemp is not match with active node');
            return;
        }

        setNodes((prev) => {
            const nodePositionUpdated = prev.map((node) => {
                if (node.id === active.id) {
                    let newPosition: { x: number; y: number };
                    if (node.format.type === 'spell') {
                        // no snap to gid
                        newPosition = movementPostion(nodeTemp, delta);
                    } else {
                        // with snap to gid
                        newPosition = movementPostionWithSnapToGrid(nodeTemp, delta);
                    }

                    return { ...node, position: newPosition };
                }
                return node;
            });

            // const nodeCollisionsUpdated = checkCollisionsCircleVsSquare(nodePositionUpdated);
            /** untuk mendetekti tabrakan spell invisible dengan building gunakan checkCollisionsCircleVsSquareMiddle */
            const nodeCollisionsUpdated = checkCollisionsCircleVsSquareMiddle(nodePositionUpdated);
            // const nodeCollisionsUpdated = checkCollisionsCircleVsCircle(nodePositionUpdated);

            return nodeCollisionsUpdated;
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setIsDragging(false);
        nodeCaptureTemp.current = null;
    };

    return (
        <DndContext
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
        >
            <div
                className="relative bg-gray-100"
                style={{
                    width: BOARD_SIZE,
                    height: BOARD_SIZE,
                    backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
                    backgroundImage:
                        'linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)',
                }}
            >
                {nodes.map((node) => (
                    <Node
                        key={node.id}
                        {...node}
                    />
                ))}
            </div>
        </DndContext>
    );
};

export function App() {
    return (
        <div className="flex items-center justify-center w-screen h-screen bg-gray-300">
            <Board />
        </div>
    );
}

// * Helper
// Fungsi untuk mengecek apakah ada tabrakan antara spell dan building
function checkCollisions(nodes: NodeProps[]) {
    const spell = nodes.find((node) => node.format.shape === 'circle');
    if (!spell) return nodes;

    return nodes.map((node) => {
        if (node.format.shape === 'square') {
            const dx = spell.position.x - node.position.x;
            const dy = spell.position.y - node.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const spellRadius = spell.size * GRID_SIZE;
            const buildingSize = node.size * GRID_SIZE;
            return {
                ...node,
                isColliding: distance < spellRadius + buildingSize / 2,
            };
        }
        return node;
    });
}

/**
 * deteksi tabrakan shape circle vs square dengan rumus jarak ` Euclidean`
 * lingkaran dan kotak akan dinggap bertabrakan jika tepi lingkaran bersentuhan dengan tepi kotak
 * @param nodes - Array yang berisi semua node (lingkaran dan kotak)
 * @returns - Array `updatedNodes` dengan informasi `isColliding` yang diperbarui
 */
function checkCollisionsCircleVsSquare(nodes: NodeProps[]) {
    // 1. Filter untuk mendapatkan array terpisah dari semua lingkaran dan semua kotak.
    const circles = nodes.filter((node) => node.format.shape === 'circle');
    const squares = nodes.filter((node) => node.format.shape === 'square');

    // 2. Membuat salinan array `nodes` dan me-reset isColliding menjadi `false`.
    //    Ini menghindari modifikasi langsung pada array asli dan memastikan status awal yang konsisten.
    const updatedNodes: NodeProps[] = nodes.map((node) => ({
        ...node,
        isColliding: false, // Reset isColliding to false for all nodes
    }));

    // 3. Inisialisasi objek untuk menyimpan status tabrakan untuk setiap lingkaran dan kotak.
    //    Kita perlu melacak ini secara terpisah untuk memastikan semua tabrakan terdeteksi.
    const circleCollisions: { [circleId: string]: boolean } = {};
    circles.forEach((circle) => (circleCollisions[circle.id] = false)); // inisialisasi false semua (tidak tabrakan)
    const squareCollisions: { [squareId: string]: boolean } = {};
    squares.forEach((square) => (squareCollisions[square.id] = false)); // inisialisasi false semua (tidak tabrakan)

    // 4. Loop melalui setiap lingkaran.
    for (const circle of circles) {
        // 5. Menghitung radius lingkaran dan titik pusat lingkaran
        const circleRadius = (circle.size * GRID_SIZE) / 2;
        // Cx: Center X - koordinat X dari pusat lingkaran (Spell)
        const Cx = circle.position.x + circleRadius;
        // Cy: Center Y - koordinat Y dari pusat lingkaran
        const Cy = circle.position.y + circleRadius;

        // 6. Loop melalui setiap kotak (untuk setiap lingkaran, kita periksa semua kotak).
        for (const square of squares) {
            // 7. Hitung ukuran dan batas-batas kotak.
            const buildingSize = square.size * GRID_SIZE;
            // L: Left - koordinat X dari sisi kiri kotak
            const L = square.position.x;
            // R: Right - koordinat X dari sisi kanan kotak
            const R = square.position.x + buildingSize;
            // T: Top - koordinat Y dari sisi atas kotak
            const T = square.position.y;
            // B: Bottom - koordinat Y dari sisi bawah kotak
            const B = square.position.y + buildingSize;

            // 8. Menentukan titik terdekat pada kotak ke pusat lingkaran.
            //    Nx: Nearest X - koordinat X terdekat pada kotak ke pusat lingkaran
            const Nx = Math.max(L, Math.min(Cx, R));
            //    Ny: Nearest Y - koordinat Y terdekat pada kotak ke pusat lingkaran
            const Ny = Math.max(T, Math.min(Cy, B));

            // 9. Hitung jarak antara pusat lingkaran dan titik terdekat pada kotak.
            //    dx: delta X - selisih koordinat X antara pusat lingkaran dan titik terdekat
            const dx = Cx - Nx;
            //    dy: delta Y - selisih koordinat Y antara pusat lingkaran dan titik terdekat
            const dy = Cy - Ny;
            //    distance: Jarak Euclidean antara pusat lingkaran dan titik terdekat
            const distance = Math.sqrt(dx * dx + dy * dy);

            // 10. Periksa apakah ada tabrakan (jarak lebih kecil dari radius lingkaran).
            const isColliding = distance < circleRadius;

            // 11. Jika ada tabrakan, update status tabrakan pada kotak dan lingkaran.
            if (isColliding) {
                // Update status tabrakan pada kotak.
                squareCollisions[square.id] = true;
                // Update status tabrakan pada lingkaran.
                circleCollisions[circle.id] = true;
            }
        }

        // set state isColliding pada circle terakhir, dari data circleCollisions
        // 12. Setelah memeriksa semua kotak untuk lingkaran ini, update status `isColliding` pada lingkaran tersebut.
        const circleIndex = updatedNodes.findIndex((n) => n.id === circle.id);
        if (circleIndex !== -1) {
            // Jika circle ada maka update isCollidingnya
            updatedNodes[circleIndex] = { ...updatedNodes[circleIndex], isColliding: circleCollisions[circle.id] };
        }
    }
    // 13. Setelah memeriksa semua lingkaran, update status `isColliding` pada semua kotak.
    // set status isColliding semua square, dari data squareCollisions
    squares.forEach((square) => {
        const squareIndex = updatedNodes.findIndex((n) => n.id === square.id);
        if (squareIndex !== -1) {
            // Jika square ada maka update isCollidingnya
            updatedNodes[squareIndex] = { ...updatedNodes[squareIndex], isColliding: squareCollisions[square.id] };
        }
    });

    // 14. Kembalikan array yang sudah diupdate
    return updatedNodes;
}

/**
 * deteksi tabrakan shape circle vs circle
 * untuk pengujian, isi data initial node menjadi type="circle" semua
 * @param nodes
 * @returns
 */
function checkCollisionsCircleVsCircle(nodes: NodeProps[]) {
    // 1. Cari semua lingkaran
    const circles = nodes.filter((node) => node.format.shape === 'circle');

    // Jika kurang dari 2 lingkaran, tidak mungkin ada tabrakan
    if (circles.length < 2) return nodes;

    // Inisialisasi array untuk menyimpan status colliding yang baru.
    // 1. Reset ke `false` di Awal
    const updatedNodes: NodeProps[] = nodes.map((node) => ({
        ...node,
        isColliding: false, // Atur semua isColliding menjadi false
    }));

    // 2. Iterasi semua pasangan lingkaran yang mungkin
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            const circle1 = circles[i];
            const circle2 = circles[j];

            // 3. Hitung jarak antara pusat kedua lingkaran
            const circle1Radius = (circle1.size * GRID_SIZE) / 2;
            const circle2Radius = (circle2.size * GRID_SIZE) / 2;
            const Cx1 = circle1.position.x + circle1Radius;
            const Cy1 = circle1.position.y + circle1Radius;
            const Cx2 = circle2.position.x + circle2Radius;
            const Cy2 = circle2.position.y + circle2Radius;

            const dx = Cx1 - Cx2;
            const dy = Cy1 - Cy2;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // 4. Periksa apakah ada tabrakan
            const isColliding = distance < circle1Radius + circle2Radius;

            // 5. Update status colliding di `updatedNodes`
            // Kita update status kedua lingkaran, jika isColliding true
            if (isColliding) {
                updatedNodes.forEach((node, index) => {
                    if (node.id === circle1.id) {
                        updatedNodes[index] = { ...node, isColliding: true };
                    }
                    if (node.id === circle2.id) {
                        updatedNodes[index] = { ...node, isColliding: true };
                    }
                });
            }
        }
    }
    return updatedNodes;
}

/**
 * deteksi tabrakan shape circle vs square dengan rumus jarak `Euclidean`
 * lingkaran dan kotak akan dianggap bertabrakan jika tepi lingkaran melewati titik pusat (center) kotak.
 * Tabrakan terjadi saat tepi lingkaran melewati pusat kotak. Ini berarti jarak antara pusat lingkaran dan pusat kotak harus lebih kecil dari radius lingkaran.
 * @param nodes - Array yang berisi semua node (lingkaran dan kotak)
 * @returns - Array `updatedNodes` dengan informasi `isColliding` yang diperbarui
 */
function checkCollisionsCircleVsSquareMiddle(nodes: NodeProps[]) {
    // 1. Filter untuk mendapatkan array terpisah dari semua lingkaran dan semua kotak.
    const circles = nodes.filter((node) => node.format.shape === 'circle');
    const squares = nodes.filter((node) => node.format.shape === 'square');

    // 2. Membuat salinan array `nodes` dan me-reset isColliding menjadi `false`.
    //    Ini menghindari modifikasi langsung pada array asli dan memastikan status awal yang konsisten.
    const updatedNodes: NodeProps[] = nodes.map((node) => ({
        ...node,
        isColliding: false, // Reset isColliding to false for all nodes
    }));

    // 3. Inisialisasi objek untuk menyimpan status tabrakan untuk setiap lingkaran dan kotak.
    //    Kita perlu melacak ini secara terpisah untuk memastikan semua tabrakan terdeteksi.
    const circleCollisions: { [circleId: string]: boolean } = {};
    circles.forEach((circle) => (circleCollisions[circle.id] = false)); // inisialisasi false semua (tidak tabrakan)
    const squareCollisions: { [squareId: string]: boolean } = {};
    squares.forEach((square) => (squareCollisions[square.id] = false)); // inisialisasi false semua (tidak tabrakan)

    // 4. Loop melalui setiap lingkaran.
    for (const circle of circles) {
        // 5. Menghitung radius lingkaran dan titik pusat lingkaran
        const circleRadius = (circle.size * GRID_SIZE) / 2;
        // Cx: Center X - koordinat X dari pusat lingkaran (Spell)
        const Cx = circle.position.x + circleRadius;
        // Cy: Center Y - koordinat Y dari pusat lingkaran
        const Cy = circle.position.y + circleRadius;

        // 6. Loop melalui setiap kotak (untuk setiap lingkaran, kita periksa semua kotak).
        for (const square of squares) {
            // 7. Hitung ukuran dan pusat kotak.
            const buildingSize = square.size * GRID_SIZE;
            // Sx: Square Center X - koordinat X dari pusat kotak
            const Sx = square.position.x + buildingSize / 2;
            // Sy: Square Center Y - koordinat Y dari pusat kotak
            const Sy = square.position.y + buildingSize / 2;

            // 8. Hitung jarak antara pusat lingkaran dan pusat kotak.
            //    dx: delta X - selisih koordinat X antara pusat lingkaran dan pusat kotak
            const dx = Cx - Sx;
            //    dy: delta Y - selisih koordinat Y antara pusat lingkaran dan pusat kotak
            const dy = Cy - Sy;
            //    distance: Jarak Euclidean antara pusat lingkaran dan pusat kotak
            const distance = Math.sqrt(dx * dx + dy * dy);

            // 9. Periksa apakah ada tabrakan (jarak lebih kecil dari radius lingkaran).
            //    Tabrakan terjadi jika jarak antara pusat lingkaran dan pusat kotak lebih kecil dari radius lingkaran.
            const isColliding = distance < circleRadius;

            // 10. Jika ada tabrakan, update status tabrakan pada kotak dan lingkaran.
            if (isColliding) {
                // Update status tabrakan pada kotak.
                squareCollisions[square.id] = true;
                // Update status tabrakan pada lingkaran.
                circleCollisions[circle.id] = true;
            }
        }

        // 11. Setelah memeriksa semua kotak untuk lingkaran ini, update status `isColliding` pada lingkaran tersebut.
        // set state isColliding pada circle terakhir, dari data circleCollisions
        const circleIndex = updatedNodes.findIndex((n) => n.id === circle.id);
        if (circleIndex !== -1) {
            // Jika circle ada maka update isCollidingnya
            updatedNodes[circleIndex] = { ...updatedNodes[circleIndex], isColliding: circleCollisions[circle.id] };
        }
    }
    // 12. Setelah memeriksa semua lingkaran, update status `isColliding` pada semua kotak.
    // set status isColliding semua square, dari data squareCollisions
    squares.forEach((square) => {
        const squareIndex = updatedNodes.findIndex((n) => n.id === square.id);
        if (squareIndex !== -1) {
            // Jika square ada maka update isCollidingnya
            updatedNodes[squareIndex] = { ...updatedNodes[squareIndex], isColliding: squareCollisions[square.id] };
        }
    });

    // 13. Kembalikan array yang sudah diupdate
    return updatedNodes;
}

function movementPostion(nodeTemp: NodeProps, delta: Coordinates) {
    const newPosition = {
        x: nodeTemp.position.x + delta.x,
        y: nodeTemp.position.y + delta.y,
    };

    return newPosition;
}

function movementPostionWithSnapToGrid(nodeTemp: NodeProps, delta: Coordinates) {
    let newX = nodeTemp.position.x + delta.x;
    let newY = nodeTemp.position.y + delta.y;
    const nodeSize = nodeTemp.size * GRID_SIZE;
    newX = Math.min(Math.round(newX / GRID_SIZE) * GRID_SIZE, BOARD_SIZE - nodeSize);

    newY = Math.min(Math.round(newY / GRID_SIZE) * GRID_SIZE, BOARD_SIZE - nodeSize);
    const newPosition = {
        x: newX,
        y: newY,
    };

    return newPosition;
}
