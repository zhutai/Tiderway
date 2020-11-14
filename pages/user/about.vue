<template>
	<view class="page-about">
		<view class="content">
			<!-- 头部logo -->
			<view class="about">
				<image class="image" src="/static/image/about.png"></image>
			</view>
			
			<view class="example-body">
				<uni-section title="产品介绍" type="line"></uni-section>
				<view class="content-text">
					<text class="text">首款穿戴式健康与辐射为一体的智能终端，可监测X/γ个人剂量率、血压、心率、运动计步，提供个人阀值报警和可视化预警平台。采用新一代高灵敏度、宽探测范围的新型室温半导体探测器-CZT探测器，具有良好的能量响应和更高的能量线性，操作简单，携带方便。

					</text>
				</view>
			</view>
			
			<view class="example-body">
				<uni-section title="公司介绍" type="line"></uni-section>
				<view class="content-text">
					<text class="text">
						上海策溯科技有限公司是一家专注于健康与核医学领域智能产品研发设计，通过与核工业四一六医院、四川大学、上海交通大学及苏州大学等研究机构核医学、健康管理领域的专家共同合作提供从端到平台、数据采集到数据服务的科技公司。 
					</text>
					<text class="text">
						团队本着为核技术应用和核安全助力的目标，围绕辐射从业人员的健康管理，在辐射剂量与辐射预警监测、健康变化与评估预警领域深耕，造福“核”时代大众健康。
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
		display: block;
		text-indent: 40rpx;
		font-size: 14px;
		line-height: 20px;
		padding-bottom: 12px;
		color: #666;
	}
	.about {
		width: 100%;
	}
	.image {
		width: 100%;
	}
</style>
