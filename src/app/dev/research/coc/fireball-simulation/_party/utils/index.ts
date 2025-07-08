import { indicatorLine, SIZE_SHAPE } from '@/app/dev/research/coc/queen-charge/_party/constants';
import { type FCEntityOnBoard } from '../store/fireball-simulation-store';
import { type BuildingOnBoard } from '@/app/dev/research/coc/queen-charge/_party/types';

/**
 * @description get entity size, ukuran size yang di-return sudah dikalikan dengan SIZE_SHAPE
 * @param entity
 * @returns {width: number, height: number}
 */
export function getEntitySize(entity: FCEntityOnBoard) {
    const isHero = 'size' in entity;

    const size = {
        height: isHero ? entity.size.h * SIZE_SHAPE : entity.radius * SIZE_SHAPE,
        width: isHero ? entity.size.w * SIZE_SHAPE : entity.radius * SIZE_SHAPE,
    };
    return size;
}

export type GenerateEdgeProps = {
    x: number;
    y: number;
    /** size harus sudah dikalikan dengan SIZE_SHAPE*/
    size: number;
};

export type EdgePropeperties = ReturnType<typeof generateEdge>;

export function generateEdge(source: GenerateEdgeProps, target: GenerateEdgeProps) {
    // const dx = targetFireball.position.x - heroWarden.position.x;
    const dx = target.x - source.x;
    // const dy = targetFireball.position.y - heroWarden.position.y;
    const dy = target.y - source.y;
    // const distance = Math.sqrt(dx * dx + dy * dy).toFixed(1);
    const distance = Math.sqrt(dx * dx + dy * dy); /* .toFixed(1); */

    // const heroSize = heroWarden.size.w * SIZE_SHAPE;
    // const sourceSize = source.size * SIZE_SHAPE;
    const sourceSize = source.size;
    // const targetFireballSize = targetFireball.size.w * SIZE_SHAPE;
    // const targetSize = target.size * SIZE_SHAPE;
    const targetSize = target.size;

    // const x1 = heroWarden.position.x + heroSize / 2;
    const x1 = source.x + sourceSize / 2;
    // const y1 = heroWarden.position.y + heroSize / 2;
    const y1 = source.y + sourceSize / 2;
    // const x2 = targetFireball.position.x + targetFireballSize / 2;
    const x2 = target.x + targetSize / 2;
    // const y2 = targetFireball.position.y + targetFireballSize / 2;
    const y2 = target.y + targetSize / 2;

    // const textX = (heroWarden.position.x + targetFireball.position.x) / 2 + heroSize / 2;
    const textX = (source.x + target.x) / 2 + sourceSize / 2;
    // const textY = (heroWarden.position.y + targetFireball.position.y) / 2 + heroSize / 2;
    const textY = (source.y + target.y) / 2 + sourceSize / 2;

    return { distance, dx, dy, x1, y1, x2, y2, textX, textY };
}

type produceEdgesProps = {
    targetFireball: BuildingOnBoard;
    /** entityOnBoard adalah warden  */
    entityOnBoard: FCEntityOnBoard;
    buildingsOnBoard: BuildingOnBoard[];
};

export function produceEdges({ targetFireball, entityOnBoard, buildingsOnBoard }: produceEdgesProps) {
    const heroWarden = entityOnBoard;
    const heroWardenSize = getEntitySize(heroWarden);
    const edges = buildingsOnBoard.map((building) => {
        const buildingSize = getEntitySize(building);
        const edgeProperties = generateEdge(
            {
                x: heroWarden.position.x,
                y: heroWarden.position.y,
                size: heroWardenSize.width,
            },
            { x: building.position.x, y: building.position.y, size: buildingSize.width }
        );

        return {
            onBoardId: building.onBoardId,
            ...edgeProperties,
        };
    });

    return edges;
}

/**
 * Fungsi untuk membulatkan angka ke kelipatan terdekat dari gridSize.
 * @param value
 * @param gridSize
 * @returns
 */
export function snapToGrid(value: number, tileSize: number): number {
    return Math.round(value / tileSize) * tileSize;
}
export function calculateViewportCenterCoordinates(props: {
    viewportWrapper: HTMLDivElement | null;
    elementSize: number;
    tileSize?: number;
    positionX: number;
    positionY: number;
    scale: number;
}) {
    const { viewportWrapper, elementSize, tileSize = 0, positionX, positionY, scale } = props;
    if (!viewportWrapper) {
        console.warn('viewPortElement not found');
        return { x: 0, y: 0 };
    }

    const wrapperWidth = viewportWrapper.offsetWidth;
    const wrapperHeight = viewportWrapper.offsetHeight;

    const halfSizeElement = (elementSize * tileSize) / 2;
    const viewCenterX = (wrapperWidth / 2 - positionX) / scale;
    const viewCenterY = (wrapperHeight / 2 - positionY) / scale;

    const elementX = viewCenterX - halfSizeElement;
    const elementY = viewCenterY - halfSizeElement;

    return { x: elementX, y: elementY };
}

/**
 * Fungsi untuk melakukan rotasi point, digunakan saat boardType==="diamond"
 * agar fitur drag and drop sinkron dengan tampilan diamond board
 * @param point
 * @param angle
 * @returns
 */
export function rotatePoint(point: { x: number; y: number }, angle: number) {
    // Konversi sudut ke radian
    const angleRad = (angle * Math.PI) / 180;

    // Hitung koordinat yang telah dirotasi
    const rotatedX = point.x * Math.cos(angleRad) - point.y * Math.sin(angleRad);
    const rotatedY = point.x * Math.sin(angleRad) + point.y * Math.cos(angleRad);

    return { x: rotatedX, y: rotatedY };
}

/**
 * Fungsi untuk melakukan snap to grid pada diamond, digunakan saat boardType==="diamond"
 * agar fitur drag and drop sinkron dengan tampilan diamond board
 *
 * @param x
 * @param y
 * @param gridSize
 * @returns
 */
export function snapToGridDiamond(x: number, y: number, gridSize: number) {
    // hitung rotasi koordinat point ke square/sebelum di rotate
    const rotatedBack = rotatePoint({ x: x, y: y }, 45);
    // Hitung jarak antar grid di sistem diamond.
    const diamondGridSize = gridSize * Math.SQRT2;

    const snappedX = Math.round(rotatedBack.x / diamondGridSize) * diamondGridSize;
    const snappedY = Math.round(rotatedBack.y / diamondGridSize) * diamondGridSize;
    // setelah snap to grid, lakukan rotasi kembali
    const finalRotated = rotatePoint({ x: snappedX, y: snappedY }, -45);
    // lakukan pembulatan untuk finalRotated
    const roundedX = Math.round(finalRotated.x);
    const roundedY = Math.round(finalRotated.y);
    return { x: roundedX, y: roundedY };
}

export function snapToGridDiamond2(x: number, y: number, gridSize: number) {
    // hitung rotasi koordinat point ke square/sebelum di rotate
    const rotatedBack = rotatePoint({ x: x, y: y }, 45);

    // lalu lakukan snap to grid pada square, dengan jarak yang disesuaikan.
    const snappedX = Math.round(rotatedBack.x / gridSize) * gridSize;
    const snappedY = Math.round(rotatedBack.y / gridSize) * gridSize;

    // setelah snap to grid, lakukan rotasi kembali
    const finalRotated = rotatePoint({ x: snappedX, y: snappedY }, -45);
    // lakukan pembulatan untuk finalRotated
    const roundedX = Math.round(finalRotated.x);
    const roundedY = Math.round(finalRotated.y);
    return { x: roundedX, y: roundedY };
}

/**
 * Fungsi untuk menghitung rotasi yang diperlukan pada koordinat
 * berdasarkan rotasi visual dari div board.
 *
 * @param rotateTo - Rotasi visual div board (dalam derajat).
 * @returns Nilai rotasi yang perlu diterapkan pada koordinat (dalam derajat).
 */
export function calculateCoordinateRotation(rotateTo: number): number {
    return -rotateTo; // Nilai koordinat berlawanan dengan div
}

/**
 * Fungsi untuk melakukan snap to grid isometrik pada diamond
 *
 * @param x
 * @param y
 * @param gridSize
 * @returns
 */
export function snapToGridIsometricDiamond(x: number, y: number, gridSize: number) {
    // Hitung jarak antar grid di sistem diamond.
    // const diamondGridSize = gridSize * Math.SQRT2;
    const diamondGridSize = gridSize;

    // lakukan snap untuk point diagonal kanan bawah - kiri atas
    const snappedX1 = Math.round(x / diamondGridSize) * diamondGridSize;
    const snappedY1 = Math.round(y / diamondGridSize) * diamondGridSize;

    // lakukan snap untuk point diagonal kiri bawah - kanan atas
    const snappedX2 = Math.round(x / diamondGridSize) * diamondGridSize;
    const snappedY2 = Math.round(y / -diamondGridSize) * -diamondGridSize;

    // hitung tengah(snap) dari point diagonal kanan bawah - kiri atas dan diagonal kiri bawah - kanan atas
    const snappedX = (snappedX1 + snappedX2) / 2;
    const snappedY = (snappedY1 + snappedY2) / 2;

    // lakukan pembulatan untuk finalRotated
    const roundedX = Math.round(snappedX);
    const roundedY = Math.round(snappedY);
    return { x: roundedX, y: roundedY };
}
