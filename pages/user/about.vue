<template>
	<view class="page-about">
		<view class="content">
			<!-- 头部logo -->
			<view class="about">
				<image class="image" src="/static/image/about1.jpeg"></image>
			</view>
			
			<view class="example-body">
				<uni-section title="产品介绍" type="line"></uni-section>
				<view class="content-text">
					<text class="text">智能个人剂量监测仪是一种基于物联网的新型便携式、智能化仪表。它采用的是高灵敏度、宽探测范围的新型室温半导体探测器—CdZnTe探测器。具有报警、个人剂量监测，历史记录查看以及定位等功能。仪表小巧轻便，非常适合随身携带，已经广泛应用于医院、日常辐射安全监测和放射性场所等各种场合。执行标准GB/T13161-2015。

						
					</text>
				</view>
			</view>
			
			<view class="example-body">
				<uni-section title="公司介绍" type="line"></uni-section>
				<view class="content-text">
					<text class="text">
						苏州笃瑞监测科技有限公司成立于2018年11月，主要从事智能辐射监测仪器仪表开发，能够提供一体化的辐射监测、安全风险评估以及个性化防护解决方案。能够为各级卫监、疾控部门的职业卫生监管，医院放射性工作从业人员辐射风险管理的需求提供全套解决方案。
					</text>
					<text class="text">
						现公司已经获得科技型中小企业、江苏省民营科技企业认证，是姑苏创业天使计划、高新区科技创新创业领军人才单位，完成了苏州市高企培育入库及江苏省高企培育入库。主营产品包含：智能穿戴设备、高仿真组织等效体模、职业人员电离辐射安全风险评估、个性化的辐射防护解决方案。
					</text>
					<text class="text">
						目前已经与西北工业大学、兰州大学、南京航空航天大学、苏州大学、中国科学技术大学、北京航空航天大学、中国原子能科学研究院等科研院所、高等学校开展深度合作。
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
		height: 150px;
		padding: 50px 20px;
	}
</style>
