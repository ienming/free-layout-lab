import { CONTROLHANDLER_TYPES, CONTROLHANDER_UI } from "~/constants/canvas";

export default class ControlHandler {
    constructor({ x, y, type, name}) {
        this.x = x;
        this.y = y;
        this.type = type; // 'resize', 'rotate'
        this.name = name; // 'top-left', 'top-center', etc.
        this.size = CONTROLHANDER_UI.SIZE;
        this.active = false;
    }

    draw(ctx) {
        ctx.fillStyle = CONTROLHANDER_UI.COLOR;
        if (this.type === CONTROLHANDLER_TYPES.ROTATE) {
            ctx.beginPath();
            ctx.arc(
                this.x,
                this.y,
                this.size / 2,
                0,
                Math.PI * 2,
            );
            ctx.fill();
            ctx.closePath();
        } else {
            ctx.fillRect(
                this.x - this.size / 2,
                this.y - this.size / 2,
                this.size,
                this.size,
            );
        }
    }

    isPointInside(px, py) {
        this.active = px >= this.x - this.size / 2 && px <= this.x + this.size / 2 &&
            py >= this.y - this.size / 2 && py <= this.y + this.size / 2;
        if (this.active) console.log('isPointInside', this.name);
        return this.active;
    }
}
