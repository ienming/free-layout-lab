import Element from "./canvasElement";

export default class TextElement extends Element {
	constructor(props) {
		super({ ...props, type: 'text' });

		this.width = 0;
		this.height = 0;
		this.content = props.content || 'Text Element';
		this.fontFamily = props.fontFamily || 'sans-serif';
		this.fontSize = props.fontSize || 30; // height 當作初始 fontSize
	}

	drawElement(ctx) {
		ctx.fillStyle = this.color.default;
		ctx.font = `${this.fontSize}px ${this.fontFamily}`;

		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(this.content, 0, 0);

		// TEST
		this.updateTextMetrics(ctx);
	}

	isPointInside(px, py) {
		this.selected =
			px >= this.cx - this.width / 2 && px <=	this.cx + this.width / 2 &&
			py >= this.cy - this.height / 2 && py <= this.cy + this.height / 2;
		return this.selected;
	}

	updateTextMetrics(ctx) {
		const metrics = ctx.measureText(this.content);
		this.width = metrics.width;
		this.height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
	}
}