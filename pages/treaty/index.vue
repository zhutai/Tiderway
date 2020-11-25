<template>
	<view class="treaty">
		<web-view class="iframe" :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: ''
			}
		},
		onLoad(option) {
			let type = option.type
			this.url = `../../static/html/${type}.html`
		},
		methods: {
			
		}
	}
</script>

<style scoped>
body, .iframe {
	background-color: #fff;
}

</style>
