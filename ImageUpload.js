class ImageUpload {
    constructor(input) {
        this.input = input;
        this.rawImageDataCache = null;
        this.imageDataCache = null;

        // clear cache on change
        let poop = this;
        this.input.onchange = function () { poop.clearCache(); };
    }

    // clear cache
    clearCache() {
        this.rawImageDataCache = null;
        this.imageDataCache = null;
    }

    // read selected file

    hasSelectedFile() {
        return this.input.files.length > 0;
    }

    getSelectedFile() {
        if (!this.hasSelectedFile()) {
            return null;
        }
        return this.input.files[0];
    }

    // read base64 image data from local file

    getRawImageDataCache() {
        return this.rawImageDataCache;
    }

    hasRawImageDataCached() {
        return this.getRawImageDataCache() != null;
    }

    getRawImageData() {
        if (this.hasRawImageDataCached()) {
            return new Promise((resolve, _) => resolve(this.getRawImageDataCache()));
        }

        if (!this.hasSelectedFile()) {
            return new Promise((resolve, _) => {
                this.clearCache();
                resolve(null);
            });
        }

        return new Promise((resolve, _) => {
            let reader = new FileReader();
            reader.onload = e => {
                resolve(this.rawImageDataCache = e.target.result);
            };
            reader.readAsDataURL(this.getSelectedFile());
        });
    }

    // convert base64 image data into ImageData

    getImageDataCache() {
        return this.imageDataCache;
    }

    hasImageDataCached() {
        return this.getImageDataCache() != null;
    }

    getImageData() {
        if (this.hasImageDataCached()) {
            return new Promise((resolve, _) => resolve(this.getImageDataCache()));
        }

        return new Promise((resolve, _) => {
            this.getRawImageData().then(data => {
                if (data == null) {
                    resolve({
                        image: null,
                        canvas: null,
                        data: null
                    });
                    return;
                }

                let image = new Image();
                image.onload = () => {
                    let cnv = document.createElement("canvas");
                    cnv.width = image.width;
                    cnv.height = image.height;

                    let ctx = cnv.getContext("2d");
                    ctx.drawImage(image, 0, 0);
                    let imageData = ctx.getImageData(0, 0, cnv.width, cnv.height);
                    resolve(this.imageDataCache = {
                        image: image,
                        canvas: cnv,
                        data: imageData
                    });
                };

                image.src = data;
            });
        });
    }
}