export default class AlbumColors {
    imageUrl: string;
    colors: number[][];
    image: any;
    canvas: any;

    constructor(imageUrl: string) {
        this.imageUrl = imageUrl;
        this.colors = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];
    }

    fetch(callback: any) {
        this.image = new Image();
        this.image.onload = () => {
            if (callback) {
                callback(this);
            }
        };
        this.image.src = this.imageUrl;
    }

    getCanvas() {
        if (this.canvas) {
            return this.canvas;
        }

        const canvas = document.createElement('canvas');
        canvas.width = this.image.width;
        canvas.height = this.image.height;
        const context = canvas.getContext('2d');

        context?.drawImage(this.image, 0, 0);
        this.canvas = canvas;
        return canvas;
    }

    getPixelArray() {
        return this.getCanvas().getContext('2d').getImageData(0, 0, this.image.width, this.image.height).data;
    }

    getColors(): Promise<any> {
        return new Promise((resolve) => {
            if (this.colors) {
                resolve(this.colors);
                return;
            }
            let p;
            const colors = [];
            const pixelArray = this.getPixelArray();

            for (p = 0; p < pixelArray.length; p += 4) {
                colors.push([pixelArray[p], pixelArray[p + 1], pixelArray[p + 2]]);
            }
            this.colors = colors;
            resolve(colors);
        });
    }
}
