import { SIZE_SHAPE, indicatorLine } from '../constants';

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
                            border: 'solid cyan 1px',
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
                            border: 'solid cyan 1px',
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
