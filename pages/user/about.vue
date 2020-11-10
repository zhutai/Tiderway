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
					<text class="text">
						首款穿戴式健康与辐射为一体的智能终端，可监测X/γ个人剂量率、血压、心率、运动计步，提供个人阀值报警和可视化预警平台。采用新一代高灵敏度、宽探测范围的新型室温半导体探测器-CZT探测器，具有良好的能量响应和更高的能量线性，操作简单，携带方便。
						可实时监测涉核人员的环境辐射剂量、累积剂量及生命体征，通过基于时间窗频谱迁移学习的人工智能算法对辐射环境剂量、累计辐射剂量或身体状况异常的工作人员进行预警及长期的健康管理，实时对放射性工作人员的安全工作环境及健康工作状况进行评估。
					</text>
				</view>
			</view>
			
			<view class="example-body">
				<uni-section title="公司介绍" type="line"></uni-section>
				<view class="content-text">
					<text class="text">
						上海策溯科技有限公司是一家专注于健康与核医学领域智能产品研发设计，提供从端到平台完整解决方案的科技公司。 
						核心团队由信息技术、核医学及健康管理等领域专家组成，以智能终端为载体，构建“云+端+服”的技术架构体系，聚焦数据采集和数据服务。
						本着为核技术应用和核安全助力的目标，围绕辐射从业人员的健康管理，继续在辐射剂量和辐射预警监测、健康变化和评估预警领域深耕，造福“核”时代大众健康。
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
	.about {
		width: 100%;
	}
	.image {
		width: 100%;
	}
</style>
