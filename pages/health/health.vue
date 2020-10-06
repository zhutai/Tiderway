<template>
	<view class="container">

		<!--  自定义顶部栏 -->
		<uni-nav-bar fixed :border="false" :statusBar="true">
			<view class="navbar-segmented">
				<uni-segmented-control :current="current" :values="titleNames" style-type="button" active-color="#4399fc" @clickItem="onClickItem" />
			</view>
		</uni-nav-bar>
		
		<view class="tabs">
			<view class="tabbar" v-for="(item, index) in tabs" 
			@click="handleClick(item, index)" :class="{ active: item.active }"
			:key="item.value">{{ item.label }}</view>
		</view>
		
		<view class="date-time">
			<text>{{ tabs[dateTimeIndex].createTime + ' 至 ' +  tabs[dateTimeIndex].endTime }}</text>
		</view>
		
		<view class="heart-rate">
			<scroll-view class="info-scroll" scroll-x="true" scroll-left="0">
				<view class="info-item" v-for="item in heartInfo">
					<view class="info-num">
						<text class="num">{{ item.num }}</text>
						<text class="unit">{{ item.unit }}</text>
					</view>
					<view class="info-label">
						<text class="round" :class="item.className"></text>
						<text class="label">{{ item.name }}</text>
					</view>
				</view>
			</scroll-view>
			
			<view class="content">
				<view class="title-style" >
					<view class="title-dot-light">折线图一</view>
				</view>
				<view class="chart">
					<!-- 使用图表拖拽功能时，建议给canvas增加disable-scroll=true属性，在拖拽时禁止屏幕滚动 -->
					<canvas canvas-id="canvasLineA" id="canvasLineA" disable-scroll=true @touchstart="touchLineA" @touchmove="moveLineA" @touchend="touchEndLineA"></canvas>
				</view>
			</view>
			
			<view class="content">
				<view class="title-style" >
					<view class="title-dot-light">
						<text>标准范围说明</text>
					</view>
				</view>
				<view class="describe">
					<text>心率的正常范围在90--120之间</text>
				</view>
			</view>
			
			<view class="bar-fixed">
				<text>远程测量</text>
			</view>
			
		</view>
		
		<view class="motion">
			
		</view>
		
		<view class="blood-pressure">
			
		</view>
		
		<uni-calendar ref="calendar" class="uni-calendar--hook" :clear-date="true" :date="info.date" :insert="info.insert" :lunar="info.lunar" :startDate="info.startDate" :endDate="info.endDate" :range="info.range" @confirm="confirm" @close="close" />
		
	</view>
</template>

<script>
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import uCharts from '@/components/u-charts/u-charts.js'
import { dateRangeUtils } from '@/common/util.js'
var canvasObj = {};
var _self;

const tabbars = [
	{
		name: '心率',
		dateTimeIndex: 0,
	},{
		name: '运动',
		dateTimeIndex: 0,
	},{
		name: '血压',
		dateTimeIndex: 0,
	},
]

const tabs = [
	{
		days: 0,
		label: '今天',
		value: 'today',
		createTime: '',
		endTime: '',
		active: false
	},{
		days: 7,
		label: '近7天',
		value: 'week',
		createTime: '',
		endTime: '',
		active: false
	},{
		days: 30,
		label: '近30天',
		value: 'month',
		createTime: '',
		endTime: '',
		active: false
	},{
		days: 365,
		label: '近一年',
		value: 'year',
		createTime: '',
		endTime: '',
		active: false
	},{
		days: null,
		label: '自定义',
		value: 'costom',
		createTime: '',
		endTime: '',
		active: false
	},
]

const heartInfo = [
	{
		name: '平均值',
		unit: '次/分钟',
		key: 'xinlu',
		num: 90,
		className: 'blue'
	},{
		name: '最大值',
		unit: '次/分钟',
		key: 'xinlu',
		num: 90,
		className: 'green'
	},{
		name: '最小值',
		unit: '次/分钟',
		key: 'xinlu',
		num: 90,
		className: 'yellow'
	}
]


export default {

	data() {
		var titleNames = tabbars.map(item => item.name)
		var today = dateRangeUtils.getDateRange(new Date(), 0, true)
		return {
			tabs,
			current: 0,
			heartInfo,
			titleNames,
			dateTimeIndex: 0,
			info: {
				lunar: true,
				range: true,
				insert: false,
				selected: [],
				date: today.createTime,
				startDate: '2018-01-01',
				endDate: today.endTime
			}
		};
	},
	components: {
		uniNavBar
	},
	onLoad() {
		console.log()
		this.toggleTabs(this.current)
		
		_self = this;
		this.cWidth = uni.upx2px(750);
		this.cHeight = uni.upx2px(500);
		this.cWidth2 = uni.upx2px(700);
		this.cHeight2 = uni.upx2px(1100);
		this.cWidth3 = uni.upx2px(250);
		this.cHeight3 = uni.upx2px(250);
		this.arcbarWidth = uni.upx2px(24);
		this.gaugeWidth = uni.upx2px(30);
	},
	onReady() {
		let LineA = {
			categories: ["2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"],
			series: [
				{
					data: [35, 8, 25, 37, 4, 20, 70, 40, 65, 100, 44, 68],
					name: "成交量A"
				},{
					data: [70, 40, 65, 100, 44, 68, 100, 80, 95, 150, 112, 132],
					name: "成交量B"
				},{
					data: [100, 80, 95, 150, 112, 132, 35, 8, 25, 37, 4, 20],
					name: "成交量C"
				},
			]
		};
		this.showLineA("canvasLineA", LineA);
	},
	methods: {
		toggleTabs(current, dataTime) {
			// 获取存储的当前模块下的时间选项
			let dateTimeIndex = tabbars[current].dateTimeIndex
			this.dateTimeIndex = dateTimeIndex
			this.tabs.forEach((item, index) => {
				if (index === dateTimeIndex) {
					let obj = null
					
					if (item.days !== null) {
						obj = dateRangeUtils.getDateRange(new Date(), item.days, true)
					} else if(dataTime){
						obj = dataTime
					}
					
					if (obj) {
						item.createTime = obj.createTime
						item.endTime = obj.endTime
					}
					item.active = true
				} else {
					item.active = false
				}
			})
		},
		onClickItem(e) {
			if (this.current !== e.currentIndex) {
				this.current = e.currentIndex
				this.toggleTabs(this.current)
			}
		},
		handleClick(item, index) {
			
			// 自定义时间选项单独处理
			if (item.days !== null) {
				if (item.active) return;
				// 存储当前模块下选中的时间选项
				tabbars[this.current].dateTimeIndex = index
				
				this.toggleTabs(this.current)	
			} else {
				this.$refs.calendar.open()
			}
		},
		close() {
			console.log('弹窗关闭');
		},
		confirm(e) {
			tabbars[this.current].dateTimeIndex = this.tabs.length - 1
			
			var dataTime = {
				createTime: e.range.before,
				endTime: e.range.after
			}
			this.toggleTabs(this.current, dataTime)
			// this.tabs.forEach(item => {
			// 	if (item.days === null) {
			// 		item.createTime = e.range.before
			// 		item.endTime = e.range.after
			// 	}
			// })
			// console.log('confirm 返回:', e)
		},
		touchLineA(e) {
			canvasObj['canvasLineA'].scrollStart(e);
		},
		moveLineA(e) {
			// console.log(e)
			canvasObj['canvasLineA'].scroll(e);
			// canvasObj['canvasLineA'].showToolTip(e, {
			// 	format: function(item, category) {
			// 		return category + ' ' + item.name + ':' + item.data
			// 	}
			// });
		},
		touchEndLineA(e) {
			console.log(e)
			canvasObj['canvasLineA'].scrollEnd(e);
			//下面是toolTip事件，如果滚动后不需要显示，可不填写
			canvasObj['canvasLineA'].showToolTip(e, {
				format: function(item, category) {
					return category + ' ' + item.name + ':' + item.data
				}
			});
		},
		showLineA(canvasId, chartData) {
			if (!_self.pixelRatio) _self.pixelRatio = 1
			canvasObj[canvasId] = new uCharts({
				$this: _self,
				canvasId: canvasId,
				type: 'line',
				fontSize: 12,
				padding:[16, 16, 0, 16],
				legend:{
					show: true,
					padding: 6,
					lineHeight: 12,
					margin: 6,
				},
				dataLabel: false,
				dataPointShape: false,
				background: '#fff',
				pixelRatio: _self.pixelRatio,
				categories: chartData.categories,
				series: chartData.series,
				animation: false,
				enableScroll: true, //开启图表拖拽功能
				xAxis: {
					disableGrid: true,
					type: 'grid',
					// gridType: 'dash',
					itemCount: 5,
					scrollShow: true, 
					scrollAlign: 'left',
					//scrollBackgroundColor:'#F7F7FF',//可不填写，配合enableScroll图表拖拽功能使用，X轴滚动条背景颜色,默认为 #EFEBEF
					//scrollColor:'#DEE7F7',//可不填写，配合enableScroll图表拖拽功能使用，X轴滚动条颜色,默认为 #A6A6A6
				},
				yAxis: {
					// disabled: false,
					gridType: 'dash',
					splitNumber: 4,
					gridColor: '#eee',
					// min: 10,
					// max: 180,
					// axisLineColor: '#ddd',
					format: (val) => {
						return val.toFixed(0) + '元'
					} //如不写此方法，Y轴刻度默认保留两位小数
				},
				width: _self.cWidth * _self.pixelRatio,
				height: _self.cHeight * _self.pixelRatio,
				extra: {
					lineStyle: 'straight',
				},
			});
		}
	},
	// #ifndef MP
	// 标题栏input搜索框点击
	onNavigationBarSearchInputClicked: async function(e) {
		this.$api.msg('点击了搜索框');
	},
	//点击导航栏 buttons 时触发
	onNavigationBarButtonTap(e) {
		const index = e.index;
		if (index === 0) {
			this.$api.msg('点击了扫描');
		} else if (index === 1) {
			// #ifdef APP-PLUS
			const pages = getCurrentPages();
			const page = pages[pages.length - 1];
			const currentWebview = page.$getAppWebview();
			currentWebview.hideTitleNViewButtonRedDot({
				index
			});
			// #endif
			uni.navigateTo({
				url: '/pages/notice/notice'
			})
		}
	}
	// #endif
}
</script>

<style lang="scss">
	
	$color-white: #fff;
	
	page {
		background: #f5f5f5;
	}
	
	// .container {
	// 	background: #fff;
	// }
	
	.navbar-segmented {
		width: 100%;
		padding: 0 72rpx;
		/deep/ .segmented-control {
			height: 60rpx;
		}
	}
	
	.tabs {
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		display: flex;
		/* #endif */
		font-size: 16px;
		background-color: $color-white;
		flex-direction: row;
		.tabbar {
			flex: 1;
			color: $font-color-dark;
			height: 44px;
			align-items: center;
			justify-content: center;
			display: inline-flex;
			border-bottom: 6rpx solid $color-white;
		}
		.active {
			border-bottom: 6rpx solid $font-color-spec;
		}
	}
	
	.date-time {
		height: 72rpx;
		color: $font-color-base;
		font-size: 14px;
		text-align: center;
		line-height: 72rpx;
		background: $color-white;
	}

	.info-scroll {
		padding: 24rpx 0;
		height: 208rpx;
		white-space: nowrap;
		.info-item {
			width: 40%;
			height: 100%;
			padding: 24rpx;
			display: inline-block;
			margin-right: 24rpx;
			background: $color-white;
			&:first-child {
				margin-left: 24rpx;
			}
			.info-num {
				.num {
					font-size: 24px;
					color: $font-color-dark;
				}
				.unit {
					font-size: 14px;
					color: $font-color-light;
				}
			}
				
			.info-label {
				/* #ifndef APP-NVUE */
				display: flex;
				/* #endif */
				margin-top: 12rpx;
				height: 36rpx;
				align-items: center;
				flex-direction: row;
				justify-content: flex-start;
				.round {
					display: inline-flex;
					width: 14px;
					height: 14px;
					border-radius: 50%;
					margin-right: 6px;
				}
				.yellow {
					background: $uni-color-warning;
				}
				.blue {
					background: $font-color-spec;
				}
				.green {
					background: $uni-color-success;
				}
				.label {
					font-size: 14px;
					color: $font-color-base;
				}
			}
		}
	}
	
	.content {
		margin-bottom: 24rpx;
		.describe {
			padding: 0 32rpx 32rpx;
			font-size: 14px;
			color: $font-color-base;
			background-color: $color-white;
		}
	}
	
	.title-style {
		width: 100%;
		padding: 24rpx;
		flex-wrap: nowrap;
		background: $color-white;
		.title-dot-light {
			height: 18px;
			font-size: 14px;
			padding-left: 6px;
			color: $font-color-dark;
			border-left: 8rpx solid $font-color-spec;
		}
	}
	
	.bar-fixed {
		position: fixed;
		right: 40rpx;
		background: $font-color-spec;
		bottom: 200rpx;
		width: 92rpx;
		height: 92rpx;
		border-radius: 50%;
		font-size: 14px;
		padding: 8rpx;
		text-align: center;
		color: #fff;
	}
	
	#canvasLineA {
		width: 375px;
		height: 250px;
		background-color: $color-white;
	}
</style>
