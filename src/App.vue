<template>
	<div class="window">
		<TitleBar />
	</div>
</template>

<script>
import TitleBar from '@/components/TitleBar.vue'

export default {
	name: 'App',
	components: {
		TitleBar
	},
	data() {
		return {}
	},
	mounted() {}
}
</script>

<style lang="scss">
@import '@/common/style/index.scss'; // 全局自定义的css样式
</style>
<style lang="scss" scoped>
.window {
	display: flex;
	flex-flow: column nowrap;
	height: 100vh;

	color: #ccc;
}
</style>
