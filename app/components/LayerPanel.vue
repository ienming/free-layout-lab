<template>
    <div class="layer-panel">
        <ul>
            <li
                v-for="layer of layers"
                :key="layer.key"
                class="layer"
                :class="{'active': isLayerActive(layer.key)}"
                @click="setToSelect(layer.key)">
                {{ layer.key }}
            </li>
        </ul>
    </div>
</template>

<script setup>
import { useCanvasStore } from '#imports';

const canvasStore = useCanvasStore();

const layers = computed(() => [...canvasStore.elements].reverse());

function setToSelect(key) {
    canvasStore.clearSelectedEl();
    canvasStore.setEl2Select(key);
}

function isLayerActive(key) {
    return canvasStore.selectedEl?.key === key;
}
</script>

<style lang="scss" scoped>
.layer-panel {
    border-radius: 8px;
    background-color: #fff;
    border: 1px solid #efefef;
    padding: 12px;
    position: fixed;
    bottom: 8px;
    left: 8px;

    >ul {
        padding-inline-start: 0;
        max-width: 300px;
        max-height: 200px;
        overflow-y: scroll;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .layer {
        list-style: none;
        padding: 8px;
        border-radius: 4px;

        &.active {
            border: 1px solid #000;
        }
    }
}
</style>
