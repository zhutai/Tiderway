<template>
	<view class="empty-content">
		<image class="empty-content-image" :src="src" mode="aspectFit"></image>
		<text class="empty-content-title">{{ title }}</text>
	</view>
</template>

<script>
	const isEmpty = require('@/static/image/empty.png')
	export default {
		props: {
			src: {
				type: String,
				default: isEmpty
			},
			title: {
				type: String,
				default: '暂无数据'
			}
		},

		data() {
			return {
				typeSrc: {
					empty:  ''
				},
			}
		},

		computed: {
			setSrc() {
				return this.typeSrc[this.src];
			},
		}
	}
</script>

<style lang="scss">
	.empty-content {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		height: 100%;
		width: 100%;
		// position: fixed;
		// left: 0;
		// top: 0;
		// right: 0;
		// bottom: 0;
		background: #fff;
		// padding-bottom: 120upx;

		&-image {
			width: 200upx;
			height: 200upx;
		}
		&-title {
			color: #aaa;
			padding-bottom: 100rpx;
		}
	}
</style>
