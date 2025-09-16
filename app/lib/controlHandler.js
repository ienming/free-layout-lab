import { CONTROLHANDLER_TYPES, CONTROLHANDER_UI } from "~/constants/canvas";

export default class ControlHandler {
    constructor({ x, y, type, name}) {
        this.cx = x;
        this.cy = y;
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
                this.cx,
                this.cy,
                this.size / 2,
                0,
                Math.PI * 2,
            );
            ctx.fill();
            ctx.closePath();
        } else {
            ctx.fillRect(
                this.cx - this.size / 2,
                this.cy - this.size / 2,
                this.size,
                this.size,
            );
        }
    }

    isPointInside(px, py) {
        this.active = px >= this.cx - this.size / 2 && px <= this.cx + this.size / 2 &&
            py >= this.cy - this.size / 2 && py <= this.cy + this.size / 2;
        if (this.active) console.log('isPointInside', this.name);
        return this.active;
    }
}
