import { SIZE_SHAPE, indicatorLine } from '../constants';

/**
 * komponent CoordinateGuide adalah header untuk komponent BoardCanvasGuide hanya untuk tampilkan memudahkan user
 * komponent ini menghasilkan:
 * - 1 baris abjad sesuai dengan value indicatorLine (horizontal). contoh: a,b,c,..,at
 * - 1 kolom angka sengan dengan panjang array indicatorLine (vertical). contoh: 1,2,3,..46
 * @returns
 */
export function CoordinateGuide() {
    return (
        <div aria-description="garis-no">
            {Array.from({ length: indicatorLine.length }).map((_, idx_row) => {
                return (
                    <p
                        key={idx_row}
                        style={{
                            height: SIZE_SHAPE,
                            width: SIZE_SHAPE,
                            top: `${SIZE_SHAPE * idx_row}px`,
                            left: `-${SIZE_SHAPE}px`,
                            textAlign: 'center',
                            border: checkIsIndexMidle(indicatorLine.length, idx_row) ? 'solid red 1px' : 'solid cyan 1px',
                        }}
                        className="absolute dark:bg-[#21242b] bg-[#f4f5f7] text-xs"
                    >
                        {idx_row + 1}
                    </p>
                );
            })}
            {indicatorLine.map((text, idx_line) => {
                return (
                    <p
                        key={text}
                        style={{
                            height: SIZE_SHAPE,
                            width: SIZE_SHAPE,
                            top: `-${SIZE_SHAPE}px`,
                            left: `${SIZE_SHAPE * idx_line}px`,
                            textAlign: 'center',
                            border: checkIsIndexMidle(indicatorLine.length, idx_line) ? 'solid red 1px' : 'solid cyan 1px',
                        }}
                        className="absolute dark:bg-[#21242b] bg-[#f4f5f7] text-xs"
                    >
                        {text}
                    </p>
                );
            })}
        </div>
    );
}

function checkIsIndexMidle(length: number, currentIndex: number) {
    const isEvenNumber = length % 2 == 0;
    if (isEvenNumber) {
        // length genap akan menghasilkan 2 angka tengah
        return currentIndex === length / 2 || currentIndex + 1 === length / 2;
    } else {
        // length ganjil akan menghasilkan 1 angka tengah
        return currentIndex === Math.ceil(length / 2);
    }
}
