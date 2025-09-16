<template>
	<div class="container">
		<CanvasArea :elements="canvasStore.elements" />
		<ControlPanel />
		<LayerPanel />
	</div>
</template>

<script setup>
const canvasStore = useCanvasStore();
</script>

<style lang="scss" scoped>
.container {
	width: 100vw;
	min-height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
