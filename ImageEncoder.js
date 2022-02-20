class Matcher {
    constructor(resolution) {
        this.resolution = resolution;
    }

    getColor(i) {
        let g = Math.floor(i * 255/(this.resolution-1));
        return new RGBColor(g, g, g);
    }

    getMatch(color) {
        let match = null;
        let matchRes = -1;

        for (let i = 0; i < this.resolution; ++i) {
            let target = this.getColor(i);
            
            if (match == null || target.distance(color) < match.distance(color)) {
                match = target;
                matchRes = i;
            }
        }

        return {
            color: match,
            index: matchRes
        };
    }
}

// 33-126

function encodeImage(image, resolution) {
    let matcher = new Matcher(resolution);
    let coded = `${resolution} ${image.width} ${image.height} `;
    let codedImage = RGBImage.fromSize(image.width, image.height);
    
    const base = 64;
    const word = Math.floor(Math.log(base) / Math.log(resolution));

    let work = 0;

    let stored = 0;

    for (let row = 0; row < image.height; ++row) {
        for (let col = 0; col < image.width; ++col) {
            if (stored == word) {
                coded += String.fromCodePoint(work+33);
                work = 0;
                stored = 0;
            }
            
            let match = matcher.getMatch(image.getColor(col, row));
            codedImage.setColor(col, row, match.color);
            work = work*resolution + match.index;
            stored++;
        }
    }
    return {code: coded, image: codedImage};
}