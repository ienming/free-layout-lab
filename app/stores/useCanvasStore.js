const useCanvasStore = defineStore('canvas', {
    state: () => ({
        // Array of canvas elements
        elements: [],
        selectedElementKey: null,
    }),
    getters: {
        selectedElement(state) {
            return state.elements.find(el => el.key === state.selectedElementKey) || null;
        }
    },
    actions: {
        addElement(element) {
            this.elements.push(element);
        },
        updateElWidth(value) {
            if (this.selectedElement) {
                const target = this.elements.find(el => el.key === this.selectedElementKey);
                target.width = value;
            }
        },
        updateElHeight(value) {
            if (this.selectedElement) {
                const target = this.elements.find(el => el.key === this.selectedElementKey);
                target.height = value;
            }
        },
        sendToFront(key) {
            const index = this.elements.findIndex(el => el.key === key);
            if (index === -1) return;
            if (index === this.elements.length - 1) return; // Already at front

            const [element] = this.elements.splice(index, 1);
            this.elements.push(element);
        },
        sendToBack(key) {
            const index = this.elements.findIndex(el => el.key === key);
            if (index === -1) return;
            if (index === 0) return; // Already at back
            
            const [element] = this.elements.splice(index, 1);
            this.elements.unshift(element);
        }
    }
});

export default useCanvasStore;