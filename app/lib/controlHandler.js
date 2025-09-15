export default class ControlHandler {
    constructor({ x, y, type, name}) {
        this.x = x;
        this.y = y;
        this.type = type; // 'move', 'resize', 'rotate'
        this.name = name; // 'top-left', 'top-center', etc.
        this.size = 8; // Control handle size
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        ctx.fillStyle = 'blue';
        ctx.fillRect(
            0 - this.size / 2,
            0 - this.size / 2,
            this.size,
            this.size,
        );

        ctx.restore();
    }

    isPointInside(px, py) {
        return px >= this.x - this.size / 2 && px <= this.x + this.size / 2 &&
            py >= this.y - this.size / 2 && py <= this.y + this.size / 2;
    }
}
