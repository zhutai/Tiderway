<template>
	<view class="container">

		<!--  自定义顶部栏 -->
		<uni-nav-bar fixed :border="false" :statusBar="true">
			<view class="navbar-segmented">
				<uni-segmented-control :current="current" :values="titleNames" style-type="button" active-color="#4399fc"
				 @clickItem="onClickItem" />
			</view>
		</uni-nav-bar>

		<view class="tabs">
			<view class="tabbar" v-for="(item, index) in tabs" @click="handleClick(item, index)" :class="{ active: item.active }"
			 :key="item.value">{{ item.label }}</view>
		</view>

		<view class="date-time">
			<text>{{ tabs[dateTimeIndex].createTime + ' 至 ' +  tabs[dateTimeIndex].endTime }}</text>
		</view>

		<view class="heart-rate" v-if="current === 0">
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
				<view class="title-style">
					<view class="title-dot-light">实时剂量</view>
				</view>
				
				<view class="chart">
					<!-- <echarts class="echarts" :option="option" style="height: 300px;" @click="echartsClick"></echarts> -->
					<echarts-el :key="1" class="echarts" :option="heartRateOption" :style="{height: `${chartHeight}px`}"></echarts-el>
					<!-- 使用图表拖拽功能时，建议给canvas增加disable-scroll=true属性，在拖拽时禁止屏幕滚动 -->
					<!-- <canvas canvas-id="canvasLineA" id="canvasLineA" disable-scroll=true @touchstart="touchLineA" @touchmove="moveLineA" @touchend="touchEndLineA"></canvas> -->
				</view>
			</view>

			<view class="content">
				<view class="title-style">
					<view class="title-dot-light">
						<text>标准范围说明</text>
					</view>
				</view>
				<view class="describe">
					<text>心率的正常范围在90--120之间</text>
				</view>
			</view>

			<view class="bar-fixed">
				<text>预警设置</text>
			</view>

		</view>

		<view class="motion" v-if="current === 1">
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
				<view class="title-style">
					<view class="title-dot-light">累计剂量</view>
				</view>
				
				<view class="chart">
					<!-- <echarts class="echarts" :option="option" style="height: 300px;" @click="echartsClick"></echarts> -->
					<echarts-el :key="2"  class="echarts" :option="motionOption" :style="{height: `${chartHeight}px`}"></echarts-el>
					<!-- 使用图表拖拽功能时，建议给canvas增加disable-scroll=true属性，在拖拽时禁止屏幕滚动 -->
					<!-- <canvas canvas-id="canvasLineA" id="canvasLineA" disable-scroll=true @touchstart="touchLineA" @touchmove="moveLineA" @touchend="touchEndLineA"></canvas> -->
				</view>
			</view>
			
			<view class="content">
				<view class="title-style">
					<view class="title-dot-light">
						<text>标准范围说明</text>
					</view>
				</view>
				<view class="describe">
					<text>心率的正常范围在90--120之间</text>
				</view>
			</view>
			
			<view class="bar-fixed">
				<text>预警设置</text>
			</view>
			
		</view>

		<uni-calendar ref="calendar" class="uni-calendar--hook" :clear-date="true" :date="info.date" :insert="info.insert"
		 :lunar="info.lunar" :startDate="info.startDate" :endDate="info.endDate" :range="info.range" @confirm="confirm"
		 @close="close" />

	</view>
</template>

<script>
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
	import uCharts from '@/components/u-charts/u-charts.js'
	import Echarts from '@/components/echarts/echarts.vue'
	import EchartsEl from '@/components/echarts/echarts-el.vue'
	import { dateRangeUtils } from '@/common/util.js'
	import { getGoodsList, getGoodsInfo } from '@/api/goods.js';
	var canvasObj = {};
	var _self;

	const tabbars = [{
		name: '实时剂量',
		dateTimeIndex: 0,
	}, {
		name: '累计剂量',
		dateTimeIndex: 0,
	}]

	const tabs = [{
		days: 0,
		label: '今天',
		value: 'today',
		createTime: '',
		endTime: '',
		active: false
	}, {
		days: 7,
		label: '近7天',
		value: 'week',
		createTime: '',
		endTime: '',
		active: false
	}, {
		days: 30,
		label: '近30天',
		value: 'month',
		createTime: '',
		endTime: '',
		active: false
	}, {
		days: 365,
		label: '近一年',
		value: 'year',
		createTime: '',
		endTime: '',
		active: false
	}, {
		days: null,
		label: '自定义',
		value: 'costom',
		createTime: '',
		endTime: '',
		active: false
	}, ]

	const heartInfo = [{
		name: '平均值',
		unit: '次/分钟',
		key: 'xinlu',
		num: 90,
		className: 'blue'
	}, {
		name: '最大值',
		unit: '次/分钟',
		key: 'xinlu',
		num: 90,
		className: 'green'
	}, {
		name: '最小值',
		unit: '次/分钟',
		key: 'xinlu',
		num: 90,
		className: 'yellow'
	}]


	export default {

		data() {
			var titleNames = tabbars.map(item => item.name)
			var today = dateRangeUtils.getDateRange(new Date(), 0, true)
			return {
				tabs,
				bloodOption: null,
				motionOption: null,
				heartRateOption: null,
				current: 0,
				heartInfo,
				titleNames,
				dateTimeIndex: 0,
				chartHeight: 0,
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
			uniNavBar,
			Echarts,
			EchartsEl
		},
		onLoad() {
			this.heartRateOption = this.getOption1()
			this.motionOption = this.getOption2()
			this.bloodOption = this.getOptions(0)
			this.toggleTabs(this.current)
			this.chartHeight = uni.upx2px(500)
		},
		onReady() {
			getGoodsList().then(res => {
				console.log(res)
			}, err => {
				console.log(err)
			})
		},
		methods: {
				
			getOption1() {
				var base = +new Date(2019, 9, 3);
				var oneDay = 24 * 3600 * 1000;
				var date = [];
				
				var data = [Math.random() * 300];
				
				for (var i = 1; i < 200; i++) {
					var now = new Date(base += oneDay);
					date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
					data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
				}

				return {
					id: 'echartA',
					tooltip: {
						trigger: 'axis',
						positionStatus: true,
						formatterStatus: true,
						// formatterUnit: '元', // 自定义变量：数值后面的单位
						// formatFloat2: false, // 自定义变量：是否格式化为两位小数
						position: function (pt) {
							return [pt[0], '10%'];
						}
					},
					grid: {
						left: 20,
						top: 10,
						bottom: 20,
						right: 20,
						containLabel: true
					},
					title: {
						left: 'center',
						show: false,
						text: '',
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						axisLine: {
							lineStyle: {
								color: '#666'
							}  
						},
						data: date
					},
					yAxis: {
						type: 'value',
						axisLine: {
							lineStyle: {
								color: '#666'
							}  
						},
						boundaryGap: [0, '100%']
					},
					series: [
						{
							name: '模拟数据',
							type: 'line',
							smooth: true,
							symbol: 'none',
							sampling: 'average',
							itemStyle: {
							color: 'rgb(255, 70, 131)'
							},
							// 自定义变量，以数组形式传递渐变参数
							areaGradient: [0, 0, 0, 1,[{
								offset: 0,
								color: 'rgb(255, 158, 68)'
							}, {
								offset: 1,
								color: 'rgb(255, 70, 131)'
							}]],
							// areaStyle: {
							// },
							data: data
						}
					],
				}
			},
				
			getOption2() {
				let getTime = new Date().getTime()
				let array = []
				for(var i = 1; i <= 12; i++) {
					let c = i * (2 * 60 * 60 * 1000)
					array.push([getTime - c, i ])
				}
				return {
					notMerge: true, // 自定义变量：true代表不合并数据，比如从折线图变为柱形图则需设置为true；false或不写代表合并
					tooltip: {
						trigger: 'axis',
						positionStatus: true,
						formatterStatus: true, // 自定义变量：是否格式化tooltip，设置为false时下面三项均不起作用
						// formatterUnit: '元', // 自定义变量：数值后面的单位
						// formatFloat2: true, // 自定义变量：是否格式化为两位小数
						// formatThousands: true // 自定义变量：是否添加千分位
					},
					legend: {
						show: false
					},
					grid: {
						left: '5%',
						right: '6%',
						bottom: '5%',
						top: 10,
						containLabel: true
					},
					xAxis: [{
						type: 'time',
						axisLine: {
							lineStyle: {
								color: '#666'
							}  
						},
						data: array.map(function(item) {
							return item[0]
						})
					}],
					yAxis: [{
						type: 'value',
						axisLine: {
							lineStyle: {
								color: '#666'
							}  
						}
					}],
					series: [{
							name: '邮件',
							type: 'bar',
							data: array,
							// 自定义变量，以数组形式传递渐变参数
							linearGradient: [0, 0, 0, 1,
								[{
										offset: 0,
										color: '#2378f7'
									},
									{
										offset: 0.7,
										color: '#2378f7'
									},
									{
										offset: 1,
										color: '#83bff6'
									}
								]
							]
						}
					]
				}
			},
			toggleTabs(current, dataTime) {
				// 获取存储的当前模块下的时间选项
				let dateTimeIndex = tabbars[current].dateTimeIndex
				this.dateTimeIndex = dateTimeIndex
				this.tabs.forEach((item, index) => {
					if (index === dateTimeIndex) {
						let obj = null

						if (item.days !== null) {
							obj = dateRangeUtils.getDateRange(new Date(), item.days, true)
						} else if (dataTime) {
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
			getCharts() {
				var chartData = [
					["2014-09-26", 170],
					["2014-09-27", 58],
					["2014-09-28", 87],
					["2014-09-29", 70],
					["2014-09-30", 53],
					["2014-10-01", 92],
					["2014-10-02", 78],
					["2014-10-03", 123],
					["2014-10-04", 95],
					["2014-10-05", 54],
					["2014-10-06", 68],
					["2014-10-07", 200],
					["2014-10-08", 314],
					["2014-10-09", 379],
					["2014-10-10", 346],
					["2014-10-11", 233],
					["2014-10-14", 80],
					["2014-10-15", 73],
					["2014-10-16", 76],
					["2014-10-17", 132],
					["2014-10-18", 211],
					["2014-10-19", 289],
					["2014-10-20", 250],
					["2014-10-21", 82],
					["2014-10-22", 99],
					["2014-10-23", 163],
					["2014-10-24", 267],
					["2014-10-25", 353],
					["2014-10-26", 78],
					["2014-10-27", 72],
					["2014-10-28", 88],
					["2014-10-29", 140],
					["2014-10-30", 206],
					["2014-10-31", 204],
					["2014-11-01", 65],
					["2014-11-03", 59],
					["2014-11-04", 150],
					["2014-11-05", 79],
					["2014-11-07", 63],
					["2014-11-08", 93],
					["2014-11-09", 80],
					["2014-11-10", 95],
					["2014-11-11", 59],
					["2014-11-13", 65],
					["2014-11-14", 77],
					["2014-11-15", 143],
					["2014-11-16", 98],
					["2014-11-17", 64],
					["2014-11-18", 93],
					["2014-11-19", 282],
					["2014-11-23", 155],
					["2014-11-24", 94],
					["2014-11-25", 196],
					["2014-11-26", 293],
					["2014-11-27", 83],
					["2014-11-28", 114],
					["2014-11-29", 276],
					["2014-12-01", 54],
					["2014-12-02", 65],
					["2014-12-03", 51],
					["2014-12-05", 62],
					["2014-12-06", 89],
					["2014-12-07", 65],
					["2014-12-08", 82],
					["2014-12-09", 276],
					["2014-12-10", 153],
					["2014-12-11", 52],
					["2014-12-13", 69],
					["2014-12-14", 113],
					["2014-12-15", 82],
					["2014-12-17", 99],
					["2014-12-19", 53],
					["2014-12-22", 103],
					["2014-12-23", 100],
					["2014-12-25", 73],
					["2014-12-26", 155],
					["2014-12-27", 243],
					["2014-12-28", 155],
					["2014-12-29", 125],
					["2014-12-30", 65],
					["2015-01-01", 65],
					["2015-01-02", 79],
					["2015-01-03", 200],
					["2015-01-04", 226],
					["2015-01-05", 122],
					["2015-01-06", 60],
					["2015-01-07", 85],
					["2015-01-08", 190],
					["2015-01-09", 105],
					["2015-01-10", 208],
					["2015-01-11", 59],
					["2015-01-12", 160],
					["2015-01-13", 211],
					["2015-01-14", 265],
					["2015-01-15", 386],
					["2015-01-16", 118],
					["2015-01-17", 89],
					["2015-01-18", 94],
					["2015-01-19", 77],
					["2015-01-20", 113],
					["2015-01-22", 143],
					["2015-01-23", 257],
					["2015-01-24", 117],
					["2015-01-25", 185],
					["2015-01-26", 119],
					["2015-01-28", 65],
					["2015-01-29", 87],
					["2015-01-31", 60],
					["2015-02-01", 108],
					["2015-02-02", 188],
					["2015-02-03", 143],
					["2015-02-05", 62],
					["2015-02-06", 100],
					["2015-02-09", 152],
					["2015-02-10", 166],
					["2015-02-11", 55],
					["2015-02-12", 59],
					["2015-02-13", 175],
					["2015-02-14", 293],
					["2015-02-15", 326],
					["2015-02-16", 153],
					["2015-02-18", 73],
					["2015-02-19", 267],
					["2015-02-20", 183],
					["2015-02-21", 394],
					["2015-02-22", 158],
					["2015-02-23", 86],
					["2015-02-24", 207]
				]
				return chartData
			},
			getOptions() {
				var data = this.getCharts()
				return {
					id: 'echartB',
					title: {
						show: false
						// text: 'Beijing AQI'
					},
					tooltip: {
						trigger: 'axis',
						positionStatus: true,
						formatterStatus: true, // 自定义变量：是否格式化tooltip，设置为false时下面三项均不起作用
						// formatterUnit: '元', // 自定义变量：数值后面的单位
						// formatFloat2: true, // 自定义变量：是否格式化为两位小数
					},
					grid: {
						top: 10,
						left: 20,
						right: 30,
						bottom: 40,
						containLabel: true
					},
					xAxis: {
						axisLine: {
							lineStyle: {
								color: '#666'
							}  
						},
						nameTextStyle: {
							color: '#ccc',
						},
						data: data.map(function(item) {
							return item[0];
						})
					},
					yAxis: {
						axisLine: {
							lineStyle: {
								color: '#666'
							}  
						},
						splitLine: {
							show: true
						}
					},
					visualMap: {
						orient: 'horizontal',
						bottom: 10,
						pieces: [{
							gt: 0,
							lte: 50,
							color: '#096'
						}, {
							gt: 50,
							lte: 100,
							color: '#ffde33'
						}, {
							gt: 100,
							lte: 150,
							color: '#ff9933'
						}, {
							gt: 150,
							lte: 200,
							color: '#cc0033'
						}, {
							gt: 200,
							lte: 300,
							color: '#660099'
						}, {
							gt: 300,
							color: '#7e0023'
						}],
						outOfRange: {
							color: '#999'
						},
						// formatter: function (value, value2) {
						// 	return value + 'ml' + '--' + value2 + 'ml'; // 范围标签显示内容。
						// }
					},
					series: {
						name: 'Beijing AQI',
						type: 'line',
						data: data.map(function(item) {
							return item[1];
						}),
						markLine: {
							silent: true,
							// data: [{
							// 	yAxis: 50
							// }, {
							// 	yAxis: 100
							// }, {
							// 	yAxis: 150
							// }, {
							// 	yAxis: 200
							// }, {
							// 	yAxis: 300
							// }]
						}
					}
				}
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
		.chart {
			background-color: #fff;
		}
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
		font-size: 12px;
		padding: 12rpx 20rpx;
		line-height: 16px;
		text-align: center;
		color: #fff;
	}
	
	.echarts {
		height: 500rpx;
	}

	#canvasLineA,
	#echarts {
		width: 375px;
		height: 250px;
		background-color: $color-white;
	}
</style>
