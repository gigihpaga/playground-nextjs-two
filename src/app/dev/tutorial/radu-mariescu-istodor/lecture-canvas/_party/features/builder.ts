/**
 * x = dari kiri ke kanan
 * y = dari atas ke bawah
 * [Get HTML color codes](https://htmlcolorcodes.com/)
 */

function Rumah(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(100, 300);
    ctx.lineTo(300, 300);
    ctx.lineTo(300, 100);
    ctx.lineTo(200, 50);
    ctx.lineTo(100, 100);
    ctx.lineTo(100, 300);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(200, 200, 50, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.rect(100, 310, 200, 20);
    ctx.stroke();
}

function ShapeColor(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.rect(100, 100, 200, 200);
    ctx.lineWidth = 50;
    ctx.strokeStyle = 'rgb(52, 152, 219)';
    ctx.fillStyle = '#229954';
    ctx.fill();
    ctx.stroke();
}

function RumahLaba(ctx: CanvasRenderingContext2D) {
    const thickness = 10;
    let x = 0,
        y = 0,
        w = 400,
        h = 400;

    let i = 1;
    while (i <= 10) {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.fillStyle = i % 2 == 1 ? 'blue' : 'white';
        ctx.fill();
        x = x + thickness;
        y = y + thickness;
        w = w - thickness - thickness;
        h = h - thickness - thickness;
        i = i + 1;
    }
}

function Snowman(ctx: CanvasRenderingContext2D) {
    const x1 = 200, // control kanan-kiri
        y1 = 300, // control bottom
        r1 = 50; // controll size

    const width = 400,
        height = 400,
        spacing = 100;

    dragGridOfSnowmen(spacing, width, height);

    function main() {
        for (let x = spacing; x < width; x += spacing) {
            for (let y = spacing; y < height; y += spacing) {
                drawSnowman(x, y, 10, Math.random() + 0.5);
            }
        }
    }

    function dragGridOfSnowmen(spacing: number, width: number, height: number) {
        let x = spacing;
        while (x < width) {
            let y = spacing;
            while (y < height) {
                drawSnowman(x, y, 10, Math.random() + 0.5);
                y = y + spacing;
            }
            x = x + spacing;
        }
    }

    // drawSnowman(x1, y1, r1 - 10, 0.75);
    // drawSnowman(x1 - 100, y1, r1, 0.75);
    // drawSnowman(x1 + 100, y1, r1, 0.75);

    function drawSnowman(x1: number, y1: number, r1: number, scaleFactor = 0.8) {
        /**
         * x1,y1,r1 are the properties of the bottom ball of the snowman
         */
        // lingkaran 1
        ctx.beginPath();
        ctx.arc(x1, y1, r1, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();

        // lingkaran 2
        ctx.beginPath();
        const r2 = r1 * scaleFactor,
            x2 = x1,
            y2 = y1 - r1 - r2;
        ctx.arc(x2, y2, r2, 0, Math.PI * 2);
        ctx.fill();

        // lingkaran 3
        ctx.beginPath();
        const r3 = r2 * scaleFactor,
            x3 = x2,
            y3 = y2 - r2 - r3;
        ctx.arc(x3, y3, r3, 0, Math.PI * 2);
        ctx.fill();

        drawHat(x3, y3, r3);
    }

    function drawHat(headX: number, headY: number, headRad: number, scaleFactor = 0.8) {
        // topi: bagian 1
        ctx.beginPath();
        const w4 = headRad * 2,
            h4 = headRad / 2,
            x4 = headX - w4 / 2,
            y4 = headY - headRad;
        ctx.rect(x4, y4, w4, h4);
        ctx.fillStyle = 'black';
        ctx.stroke();
        ctx.fill();

        // topi: bagian 2
        ctx.beginPath();
        const w5 = w4 * scaleFactor,
            h5 = headRad,
            x5 = headX - w5 / 2,
            y5 = y4 - h5;
        ctx.rect(x5, y5, w5, h5);
        ctx.stroke();
        ctx.fill();
    }
}

/**
 * lecture 6: Animation
 * @param canvasEl HTMLCanvasElement
 */
function CircleAnimation(canvasEl: HTMLCanvasElement) {
    /**
     * https://www.desmos.com/calculator?lang=id
     */
    const ctx = canvasEl.getContext('2d');

    const minX = 100,
        rangeX = 200,
        minRad = 10,
        rangeRad = 20; // radius antara 10 dan 30

    let p = 0,
        sign: 1 | -1 = 1;

    animate();

    function animate() {
        if (!ctx) return;

        // const x = minX + rangeX * p * p; // controlling gerak kanan-kiri
        const x = minX + rangeX * p; // controlling gerak kanan-kiri
        // const rad = minRad + rangeRad * p; // controlling besar-kecil
        const rad = minRad + rangeRad * Math.sin(p * Math.PI); // controlling besar-kecil
        p = p + 0.02 * sign;
        /**
         *```js
         * if (p > 1) {
         *    sign = -1;
         * }
         * if (p < 0) {
         *    sign = 1;
         * }
         *```
         */
        if (p > 1 || p < 0) {
            sign = sign * -1; // (1*-1=-1) || (-1*-1=1)
        }

        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        ctx.beginPath();
        ctx.arc(x, 200, rad, 0, Math.PI * 2);
        ctx.stroke();

        requestAnimationFrame(animate);
    }
}

/**
 * [lecture 7: Mouse Interaction](https://www.youtube.com/watch?v=_KqjrGHSUew)
 */
function Uh() {}

function animateBounce(canvasEl: HTMLCanvasElement) {
    const ctx = canvasEl.getContext('2d');

    const maxY = 90,
        rangeY = 90;
    let p = 0;

    const heartImage = new Image();
    heartImage.src = '/uploads/heart.png';

    animate();

    function animate() {
        if (!ctx) return;
        p = p + 0.02;
        if (p > 1) {
            p = 0;
        }
        const y = maxY - Math.abs(Math.sin(p * Math.PI)) * rangeY;
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        /*   heartImage.onload = function () {
            ctx.drawImage(heartImage, 100, 70, 200, 200);
            }; */
        ctx.drawImage(heartImage, 100, y, 200, 200);

        ctx.font = '30px Arial';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'red';
        ctx.fillText('HTML Canvas', 200, 300);

        requestAnimationFrame(animate);
    }
}

export { Rumah, ShapeColor, RumahLaba, Snowman, CircleAnimation, Uh, animateBounce };
