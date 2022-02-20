class ColorMatcher {
    constructor(targets) {
        this.targets = targets;
    }

    getClosestColor(color) {
        let nearest = null;

        for (let target of this.targets) {
            if (nearest == null) {
                nearest = target;
            }
            else if (target.distance(color) < nearest.distance(color)) {
                nearest = target;
            }
        }

        return nearest;
    }
}