import { CONTROLHANDLER_TYPES } from "~/constants/canvas";

export default class ControlHandler {
    constructor({ x, y, type, name}) {
        this.x = x;
        this.y = y;
        this.type = type; // 'resize', 'rotate'
        this.name = name; // 'top-left', 'top-center', etc.
        this.size = 10; // Control handle size
        this.active = false;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        ctx.fillStyle = '#333';
        if (this.type === CONTROLHANDLER_TYPES.ROTATE) {
            ctx.beginPath();
            ctx.arc(
                0,
                0,
                this.size / 2,
                0,
                Math.PI * 2,
            );
            ctx.fill();
            ctx.closePath();
        } else {
            ctx.fillRect(
                0 - this.size / 2,
                0 - this.size / 2,
                this.size,
                this.size,
            );
        }

        ctx.restore();
    }

    isPointInside(px, py) {
        console.log(px, py, this.x, this.y, this.size);
        this.active = px >= this.x - this.size / 2 && px <= this.x + this.size / 2 &&
            py >= this.y - this.size / 2 && py <= this.y + this.size / 2;
        console.log('isPointInside', this.name, this.active);
        return this.active;
    }
}
