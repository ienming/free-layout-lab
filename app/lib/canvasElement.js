export default class Element {
    constructor({ key, type, x, y, width, height, color, content = '' }) {
        this.key = key;
        this.type = type;      // 'text' | 'rect' | 'circle'
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.content = content;
        this.rotation = 0;  // in degrees
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);

        if (this.type === 'rect') {
            ctx.fillStyle = this.color;
            ctx.fillRect(0, 0, this.width, this.height);
        } else if (this.type === 'text') {
            ctx.fillStyle = this.color;
            ctx.font = `${this.height}px sans-serif`;
            ctx.fillText(this.content, 0, 0);
        }

        ctx.restore();
    }

    isPointInside(px, py) {
        return px >= this.x && px <= this.x + this.width &&
            py >= this.y && py <= this.y + this.height;
    }

    applyColor(newColor) {
        this.color = newColor;
    }
}