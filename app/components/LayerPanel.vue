<template>
    <div class="layer-panel">
        <span class="title">Layers</span>
        <ul v-if="layers.length">
            <li
                v-for="layer of layers"
                :key="layer.key"
                class="layer"
                :class="{'active': isLayerActive(layer.key)}"
                @click="setToSelect(layer.key)">
                <span class="layer-type">
                    [{{ getLayerIcon(layer.type) }}]
                </span>
                <span>{{ layer.key }}</span>
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

function getLayerIcon(type) {
    let icon;
    if (type === 'rect') {
        icon = 'R';
    } else if (type === 'circle') {
        icon = 'C';
    } else if (type === 'text') {
        icon = 'T';
    }
    return icon;
}
</script>

<style lang="scss" scoped>
.layer-panel {
    border-radius: 8px;
    background-color: #222;
    border: 1px solid #333;
    color: #efefef;
    padding: 8px;
    position: fixed;
    top: 8px;
    left: 8px;
    font-size: 12px;
    width: 200px;
    height: calc(100vh - 16px);

    .title {
        padding: 12px 8px;
        width: 100%;
    }

    >ul {
        padding-inline-start: 0;
        overflow-y: scroll;
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin: 0;
        padding: 4px;
    }

    .layer {
        list-style: none;
        padding: 6px;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        gap: 4px;

        &:hover {
            background-color: rgba(255, 255, 255, .1);
        }

        &.active {
            background-color: rgba(255, 255, 255, .1);
            box-shadow: 0 0 0 1px rgba(255, 255, 255, .2);
        }

        .layer-type {
            flex-shrink: 0;
        }
    }
}
</style>
