const useCanvasStore = defineStore('canvas', {
    state: () => ({
        // Array of canvas elements
        elements: [],
    }),
    getters: {
        selectedEl(state) {
            return state.elements.find(el => el.selected) || null;
        },
    },
    actions: {
        addElement(element) {
            this.elements.push(element);
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
        }
    }
});

export default useCanvasStore;