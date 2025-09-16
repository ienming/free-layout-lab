import { CONTROLHANDLER_NAMES, EL_MINIMUM_SIZE } from "~/constants/canvas";

const useCanvasStore = defineStore('canvas', {
	state: () => ({
		elements: [],
	}),
	getters: {
		selectedEl(state) {
			return state.elements.find(el => el.selected) || null;
		},
		activeControlHandler(state) {
			return state.selectedEl?.controlHandlers.find(handler => handler.active) || null;
		},
	},
	actions: {
		addEl(element) {
			this.elements.push(element);
		},
		clearSelectedEl() {
			this.elements.forEach(el => el.selected = false);
		},
		clearActiveControlHandler() {
			this.selectedEl?.controlHandlers.forEach(handler => handler.active = false);
		},
		updateElWidth(value) {
			if (this.selectedEl) {
				const target = this.elements.find(el => el.key === this.selectedEl.key);
				target.width = value;
			}
		},
		updateElHeight(value) {
			if (this.selectedEl) {
				const target = this.elements.find(el => el.key === this.selectedEl.key);
				target.height = value;
			}
		},
		resizeSelectedEl(posX, posY) {
			console.log('根據 control handler 的 name 來調整 selectedEl 的寬高');
			const oldX = Math.abs(this.selectedEl.x);
			const oldY = Math.abs(this.selectedEl.y);
			const oldWidth = this.selectedEl.width;
			const oldHeight = this.selectedEl.height;
			const centerX = oldX + oldWidth / 2;
			const centerY = oldY + oldHeight / 2;

			switch (this.activeControlHandler.name) {
				case CONTROLHANDLER_NAMES.TOP_LEFT:
					// width = width + (oldX - newX)
					// height = height + (oldY - newY)
					this.selectedEl.x = posX;
					this.selectedEl.y = posY;
					this.selectedEl.width = oldWidth + (oldX - posX);
					this.selectedEl.height = oldHeight + (oldY - posY);
					// 防止 width 或 height 變成負值
					if (this.selectedEl.width < EL_MINIMUM_SIZE) {
						this.selectedEl.width = EL_MINIMUM_SIZE;
						this.selectedEl.x = oldX + oldWidth - EL_MINIMUM_SIZE;
					}
					if (this.selectedEl.height < EL_MINIMUM_SIZE) {
						this.selectedEl.height = EL_MINIMUM_SIZE;
						this.selectedEl.y = oldY + oldHeight - EL_MINIMUM_SIZE;
					}
					break;
				case CONTROLHANDLER_NAMES.TOP_CENTER:
					// height = height + (oldY - newY)
					this.selectedEl.y = posY;
					this.selectedEl.height = oldHeight + (oldY - posY);
					if (this.selectedEl.height < EL_MINIMUM_SIZE) {
						this.selectedEl.height = EL_MINIMUM_SIZE;
						this.selectedEl.y = oldY + oldHeight - EL_MINIMUM_SIZE;
					}
					break;
				case CONTROLHANDLER_NAMES.TOP_RIGHT:
					// width = posX - oldX
					// height = height + (oldY - posY)
					this.selectedEl.width = posX - oldX;
					this.selectedEl.y = posY;
					this.selectedEl.height = oldHeight + (oldY - posY);
					if (this.selectedEl.width < EL_MINIMUM_SIZE) {
						this.selectedEl.width = EL_MINIMUM_SIZE;
					}
					if (this.selectedEl.height < EL_MINIMUM_SIZE) {
						this.selectedEl.height = EL_MINIMUM_SIZE;
						this.selectedEl.y = oldY + oldHeight - EL_MINIMUM_SIZE;
					}
					break;
				case CONTROLHANDLER_NAMES.MIDDLE_LEFT:
					// x = posX
					// width = width + (oldX - posX)
					this.selectedEl.x = posX;
					this.selectedEl.width = oldWidth + (oldX - posX);
					if (this.selectedEl.width < EL_MINIMUM_SIZE) {
						this.selectedEl.width = EL_MINIMUM_SIZE;
						this.selectedEl.x = oldX + oldWidth - EL_MINIMUM_SIZE;
					}
					break;
				case CONTROLHANDLER_NAMES.MIDDLE_RIGHT:
					// width = posX - oldX
					this.selectedEl.width = posX - oldX;
					if (this.selectedEl.width < EL_MINIMUM_SIZE) {
						this.selectedEl.width = EL_MINIMUM_SIZE;
					}
					break;
				case CONTROLHANDLER_NAMES.BOTTOM_LEFT:
					// x = posX
					// width = width + (oldX - posX)
					// height = posY - oldY
					this.selectedEl.x = posX;
					this.selectedEl.width = oldWidth + (oldX - posX);
					this.selectedEl.height = posY - oldY;
					if (this.selectedEl.width < EL_MINIMUM_SIZE) {
						this.selectedEl.width = EL_MINIMUM_SIZE;
						this.selectedEl.x = oldX + oldWidth - EL_MINIMUM_SIZE;
					}
					if (this.selectedEl.height < EL_MINIMUM_SIZE) {
						this.selectedEl.height = EL_MINIMUM_SIZE;
					}
					break;
				case CONTROLHANDLER_NAMES.BOTTOM_CENTER:
					// height = posY - oldY
					this.selectedEl.height = posY - oldY;
					if (this.selectedEl.height < EL_MINIMUM_SIZE) {
						this.selectedEl.height = EL_MINIMUM_SIZE;
					}
					break;
				case CONTROLHANDLER_NAMES.BOTTOM_RIGHT:
					// width = posX - oldX
					// height = posY - oldY
					this.selectedEl.width = posX - oldX;
					this.selectedEl.height = posY - oldY;
					if (this.selectedEl.width < EL_MINIMUM_SIZE) {
						this.selectedEl.width = EL_MINIMUM_SIZE;
					}
					if (this.selectedEl.height < EL_MINIMUM_SIZE) {
						this.selectedEl.height = EL_MINIMUM_SIZE;
					}
					break;
				case CONTROLHANDLER_NAMES.ROTATE:
					const angle = Math.atan2(posY - centerY, posX - centerX);
					const degrees = angle * (180 / Math.PI);
					this.selectedEl.rotation = degrees;
					break;
			}
		},
		sendToFront() {
			if (!this.selectedEl) return;
			const index = this.elements.findIndex(el => el.key === this.selectedEl.key);
			if (index === -1) return;
			if (index === this.elements.length - 1) return; // Already at front

			const [element] = this.elements.splice(index, 1);
			this.elements.push(element);
		},
		sendToBack() {
			if (!this.selectedEl) return;
			const index = this.elements.findIndex(el => el.key === this.selectedEl.key);
			if (index === -1) return;
			if (index === 0) return; // Already at back

			const [element] = this.elements.splice(index, 1);
			this.elements.unshift(element);
		},
		removeEl() {
			const index = this.elements.findIndex(el => el.key === this.selectedEl.key);
			this.elements.splice(index, 1);
		},
		removeAll() {
			this.elements.splice(0, this.elements.length);
		}
	}
});

export default useCanvasStore;