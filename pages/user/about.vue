<template>
	<view class="page-about">
		<view class="content">
			<!-- 头部logo -->
			<view class="header">
				<image src="/static/image/logo.png"></image>
			</view>
			
			<view class="example-body">
				<uni-section title="产品介绍" type="line"></uni-section>
				<view class="content-text">
					<text class="text">
						Tiderway 是一款专为家庭成员远程照护老人、关爱自身健康的产品。配合智能硬件设备可以为老人提供安全报警与健康管理服务，降低“空巢老人”在家可能发生意外无法及时呼救的风险，方便照护者/子女与老人联系、管理；配合智能蓝牙硬件设备可对 APP 使用者的运动数据、身体健康数据进行长期监测，为用户提供健康管理服务。
					</text>
				</view>
			</view>
			
			<view class="example-body">
				<uni-section title="公司介绍" type="line"></uni-section>
				<view class="content-text">
					<text class="text">
						Tiderway是策溯科技的品牌，我们致力于为“空巢老人”与子女或照护者提供安全报警与健康管理的远程照护服务。我们注重核心技术研发，注重用户核心需求诉求。至今为止，公司拥有各项软硬件自主知识产权专利30多项，承担完成国家、省、市多项科技创新项目研发与应用，获得中国国际消费电子 Leader 创新大奖（连续四年）、“最受欢迎适老产品”奖，以及“全国智慧养老行业市场用户首选品牌”等等荣誉，并在“2017年国家创业创新大赛”决赛中荣获“优秀企业”的称号。
					</text>
				</view>
			</view>
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
	@import url("@/common/login.css");
	.page-about {
		background: #fff;
	}
	.example-body {
		background-color: #f5f5f5;
		padding-bottom: 24rpx;
	}
	.content-text {
		padding: 24rpx;
		padding-top: 0;
		background: #fff;
	}
	.text {
		font-size: 14px;
		line-height: 20px;
		color: #666;
	}
</style>
