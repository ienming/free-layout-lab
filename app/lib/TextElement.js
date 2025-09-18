import Element from "./canvasElement";

export default class TextElement extends Element {
	constructor(props) {
		super({ ...props, type: 'text' });

		this.width = 100; //使用者設定的邊界
		this.height = 100;
		this.content = props.content || 'this is a very long text Some more to print!';
		this.textAlign = 'left';
		this.textBaseline = 'middle';
		this.fontFamily = props.fontFamily || 'sans-serif';
		this.fontSize = props.fontSize || 30; // height 當作初始 fontSize
		this.lineHeight = 36;
	}

	drawElement(ctx) {
		ctx.fillStyle = this.color.default;
		ctx.font = `${this.fontSize}px ${this.fontFamily}`;

		ctx.textAlign = this.textAlign;
		ctx.textBaseline = this.textBaseline;

		let words = this.content.split(' ');
		let currentLine = 0;
		let idx = 1;
		while (words.length > 0 && idx <= words.length) {
			const str = words.slice(0, idx).join(' ');
			const strWidth = ctx.measureText(str).width;
			if (strWidth > this.width) {
				if (idx === 1) {
					idx = 2; //避免第一圈 slice 沒東西
				}
				ctx.fillText(
					words.slice(0, idx - 1).join(' '),
					0,
					this.lineHeight * currentLine,
				);
				currentLine++;
				words = words.splice(idx - 1); //縮短原始文字
				idx = 1; //換行後重新開始
			}
			else {
				idx++;
			}
		}
		ctx.fillText(
			words.join(' '),
			0,
			this.lineHeight * currentLine,
		);
	}

	drawControlHandlers(ctx) {
		return;
	}

	isPointInside(px, py) {
		this.selected =
			px >= this.x - this.width / 2 && px <= this.x + this.width / 2 &&
			py >= this.y - this.height / 2 && py <= this.y + this.height / 2;
		return this.selected;
	}
}