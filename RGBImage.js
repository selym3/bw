class RGBColor {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    distance(color) {
        return Math.hypot(
            (color.r - this.r),
            (color.g - this.g),
            (color.b - this.b)
        );
    }

    add(color) {
        return new RGBColor(
            (this.r + color.r),
            (this.g + color.g),
            (this.b + color.b)
        );
    }

    sub(color) {
        return new RGBColor(
            (this.r - color.r),
            (this.g - color.g),
            (this.b - color.b)
        );
    }

    mul(scalar) {
        return new RGBColor(
            Math.round(this.r * scalar),
            Math.round(this.g * scalar),
            Math.round(this.b * scalar)
        );
    }
}

class RGBImage {
    static fromSize(width, height) {
        return new RGBImage(new ImageData(width, height, {colorSpace:"srgb"}));
    }

    static fromImageData(imageData) {
        // wrapper for ImageData -- no copy
        let ref = new RGBImage(imageData);

        // creates blank image data in a wrapper
        let copy = RGBImage.fromSize(imageData.width, imageData.height);
        
        // copies ImageData over 
        for (let row = 0; row < copy.height; ++row) {
            for (let col = 0; col < copy.width; ++col) {
                copy.setColor(col, row, ref.getColor(col, row));
            }
        }

        return copy;
    }

    constructor(imageData) {
        if (imageData.colorSpace != "srgb") {
            throw new Error("color space not sRGB");
        }

        this.imageData = imageData;
        this.width = imageData.width;
        this.height = imageData.height;
    }

    toImageData() {
        return this.imageData;
    }

    getIndex(x, y) {
        return y * (this.imageData.width * 4) + (x * 4);
    }

    setColor(x, y, color) {
        let index = this.getIndex(x, y);
        this.imageData.data[index + 0] = color.r;
        this.imageData.data[index + 1] = color.g;
        this.imageData.data[index + 2] = color.b
        this.imageData.data[index + 3] = 255;
    }

    getColor(x, y) {
        let index = this.getIndex(x, y);
        return new RGBColor(
            this.imageData.data[index + 0],
            this.imageData.data[index + 1],
            this.imageData.data[index + 2]
        );
    }
}
