<template>
	<view class="page-about">
		<view class="contact">
			<image src="../../static/image/wxCode1.jpeg" mode="widthFix"></image>
			
		</view>
		<view class="cell">
			<text class="label">企业邮箱：</text>
			<text class="value">doray2018@163.com</text>
		</view>
		<view class="cell">
			<text class="label">企业网站：</text>
			<text class="value">www.doraytec.com
</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			};
		},
		components: {
		},
		computed: {
		},
		onLoad() {
		},
		mounted() {
		},
		methods: {
		}
	}
</script>

<style scoped>

/* .page-about {
	background: #fff;
} */

.contact {
	display: flex;
	align-items: center;
	justify-content: center;
	padding-top: 60px;
	margin: 0 48rpx;
}

.cell {
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 16px;
	margin: 48rpx;
}

</style>
