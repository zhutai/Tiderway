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
					<view class="title-dot-light">心率曲线(mmg)</view>
				</view>
				
				<view class="chart" :style="{height: `${chartHeight}px`}">
					<echarts-el v-if="chartLoading && heartRateOption" key="1" class="echarts" :option="heartRateOption"></echarts-el>
					<empty v-if="chartLoading && !heartRateOption" title=" 暂无图表数据"></empty>
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
				<text>远程测量</text>
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
					<view class="title-dot-light">运动步数</view>
				</view>
				
				<view class="chart" :style="{height: `${chartHeight}px`}">
					<echarts-el v-if="chartLoading && motionOption" key="2" class="echarts" :option="motionOption"></echarts-el>
					<empty v-if="chartLoading && !motionOption" title=" 暂无图表数据"></empty>
				</view>
			</view>
			
			<view class="content">
				<view class="title-style">
					<view class="title-dot-light">
						<text>标准范围说明</text>
					</view>
				</view>
				<view class="describe">
					<text>运动正常范围在90--120之间</text>
				</view>
			</view>
			
			<view class="bar-fixed">
				<text>远程测量</text>
			</view>
			
		</view>

		<view class="blood-pressure" v-if="current === 2">
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
					<view class="title-dot-light">血压</view>
				</view>
				
				<view class="chart" :style="{height: `${chartHeight}px`}">
					<echarts-el v-if="chartLoading && bloodOption" key="3" class="echarts" :option="bloodOption"></echarts-el>
					<empty v-if="chartLoading && !bloodOption" title="暂无图表数据"></empty>
				</view>
			</view>
			
			<view class="content">
				<view class="title-style">
					<view class="title-dot-light">
						<text>标准范围说明</text>
					</view>
				</view>
				<view class="describe">
					<text>血压正常范围在90--120之间</text>
				</view>
			</view>
			
			<view class="bar-fixed">
				<text>远程测量</text>
			</view>
			
		</view>

		<uni-calendar ref="calendar" class="uni-calendar--hook" :clear-date="true" :date="info.date" :insert="info.insert"
		 :lunar="info.lunar" :startDate="info.startDate" :endDate="info.endDate" :range="info.range" @confirm="confirm"
		 @close="close" />

	</view>
</template>

<script>
	import empty from '@/components/empty.vue'
	import uCharts from '@/components/u-charts/u-charts.js'
	import Echarts from '@/components/echarts/echarts.vue'
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
	import EchartsEl from '@/components/echarts/echarts-el.vue'
	import { dateRangeUtils } from '@/common/util.js'
	import { getHistoryData } from '@/api/history.js'
	var canvasObj = {};
	var _self;

	const tabbars = [{
		name: '心率',
		dateTimeIndex: 0,
		path: 'HeartHistory'
	}, {
		name: '运动',
		dateTimeIndex: 0,
		path: 'StepHistory'
	}, {
		name: '血压',
		dateTimeIndex: 0,
		path: 'BloodHistory'
	}, ]

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
		key: 'average',
		num: '--',
		className: 'blue'
	}, {
		name: '最大值',
		unit: '次/分钟',
		key: 'max',
		num: '--',
		className: 'green'
	}, {
		name: '最小值',
		unit: '次/分钟',
		key: 'min',
		num: '--',
		className: 'yellow'
	}]


	export default {

		data() {
			var titleNames = tabbars.map(item => item.name)
			var today = dateRangeUtils.getDateRange(new Date(), 0, true)
			return {
				tabs,
				chartLoading: false,
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
			empty,
			uniNavBar,
			Echarts,
			EchartsEl
		},
		onLoad() {
			this.chartHeight = uni.upx2px(500)
			this.toggleTabs(this.current)
		},
		onReady() {
		},
		methods: {
			getHistoryData() {
				uni.showLoading({title: ' 加载中...', mask: true})
				let path = tabbars[this.current].path
				let currentTab = this.tabs.find(item => item.active) || {}
				let params = {
					Limit: 0,
					Page: 10000,
					StartTime: currentTab.createTime,
					EndTime: currentTab.endTime
				}
				this.chartLoading = false
				getHistoryData(path, params).then(res => {
					this.chartLoading = true
					let HistoryList = res.Data.HistoryList
					if (path === 'HeartHistory') {
						let str = 'Heart'
						if (HistoryList.length) {
							let obj = this.dataFormat(HistoryList, str)
							this.heartRateOption = this.getHeartRateParams(obj)
						} else {
							this.dataFormat(HistoryList, str)
							this.heartRateOption = null
						}
					} else if (path === 'StepHistory') {
						let str = 'Step'
						if (HistoryList.length) {
							let obj = this.dataFormat(HistoryList, str)
							this.motionOption = this.getStepParams(obj)
						} else {
							this.dataFormat(HistoryList, str)
							this.motionOption = null
						}
					} else {
						let str = 'Shrink'
						if (HistoryList.length) {
							let obj = this.dataFormat(HistoryList, str, 'Diastole')
							this.bloodOption = this.getBooldParams(obj)
						} else {
							this.dataFormat(HistoryList, str)
							this.bloodOption = null
						}
					}
					uni.hideLoading()
				})
			},
			// 对数据进行格式化赋值
			dataFormat(HistoryList, key, key_2) {
				let date = HistoryList.map(item => {
					return item.RecivedAt.replace(' ', '\n')
				})
				let data = HistoryList.map(item => item[key]);
				let data2 = null
				if (key_2) data2 = HistoryList.map(item => item[key_2]);
				this.computeData(data)
				return { date, data, data2 }
			},
			// 计算计数最大值最小值和平均值
			computeData(data) {
				let arr = null
				if (data.length) {
					let max = Math.max.apply(null, data);
					let min = Math.min.apply(null, data);
					let total = 0
					data.forEach(item => {
						total += item
					})
					
					let average = (total / data.length) || 0
					arr = {
						max: Math.floor(max),
						min: Math.floor(min),
						average: Math.floor(average)
					}
				} else {
					arr = {
						max: '-',
						min: '-',
						average: '-'
					}
				}
				
				this.heartInfo.forEach(item => {
					item.num = arr[item.key]
				})
			},
			getBooldParams({ data, date, data2 }) {
				let currentSize = 16;
				let startValue = date.length < currentSize ? date[0] : date[date.length - currentSize]
				return {
					id: 'echartA',
					tooltip: {
						trigger: 'axis',
						positionStatus: true,
						formatterStatus: true,
						// formatterUnit: '元', // 自定义变量：数值后面的单位
						// formatFloat2: false, // 自定义变量：是否格式化为两位小数
						// position: function (pt) {
						// 	return [pt[0], '10%'];
						// }
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
					dataZoom: [
						{
							show: false,
							startValue: startValue
						},
						{
							type: 'inside'
						}
					],
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
							name: '收缩压',
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
							data: data
						},{
							name: '舒张压',
							type: 'line',
							smooth: true,
							symbol: 'none',
							sampling: 'average',
							itemStyle: {
							color: 'rgb(180, 80, 11)'
							},
							// 自定义变量，以数组形式传递渐变参数
							areaGradient: [0, 0, 0, 1,[{
								offset: 0,
								color: 'rgb(240, 173, 78)'
							}, {
								offset: 1,
								color: 'rgb(255, 70, 131)'
							}]],
							data: data2
						},
					],
				}
			},
			// 生成柱状图数据
			getStepParams({date, data}) {
				let currentSize = 16;
				let startValue = date.length < currentSize ? date[0] : date[date.length - currentSize]
				return {
					notMerge: true, // 自定义变量：true代表不合并数据，比如从折线图变为柱形图则需设置为true；false或不写代表合并
					tooltip: {
						trigger: 'axis',
						positionStatus: true,
						formatterStatus: true, // 自定义变量：是否格式化tooltip，设置为false时下面三项均不起作用
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
					dataZoom: [
						{
							show: false,
							startValue: startValue
						},
						{
							type: 'inside'
						}
					],
					xAxis: [{
						type: 'category',
						axisLine: {
							lineStyle: {
								color: '#666'
							}  
						},
						data: date
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
							name: '步数',
							type: 'bar',
							data: data,
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
				this.getHistoryData()
			},
			getHeartRateParams({ date, data }) {
				let currentSize = 16;
				let startValue = date.length < currentSize ? date[0] : date[date.length - currentSize]
				return {
					id: 'echartB',
					title: {
						show: false
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
					dataZoom: [
						{
							show: false,
							startValue: startValue
						},
						{
							type: 'inside'
						}
					],
					xAxis: {
						axisLine: {
							lineStyle: {
								color: '#666'
							}  
						},
						nameTextStyle: {
							color: '#ccc',
						},
						data: date
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
						left: '15%',
						pieces: [{
							gt: 0,
							lte: 60,
							label: '偏低',
							color: '#4399fc'
						}, {
							gt: 60,
							lte: 100,
							label: '正常',
							color: '#4cd964'
						}, {
							gt: 100,
							lte: 120,
							label: '较高',
							color: '#ff9933'
						}, {
							gt: 120,
							lte: 200,
							label: '危险',
							color: '#cc0033'
						}
						],
						outOfRange: {
							color: '#999'
						},
						// formatter: function (value, value2) {
						// 	return value + 'ml' + '--' + value2 + 'ml'; // 范围标签显示内容。
						// }
					},
					series: {
						name: '心率',
						type: 'line',
						data: data,
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
				let { before, after } = e.range
				if (before && after) {
					tabbars[this.current].dateTimeIndex = this.tabs.length - 1
					let dataTime = {
						createTime: before,
						endTime: after
					}
					this.toggleTabs(this.current, dataTime)
				}
				
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
			line-height: 60rpx;
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
</style>
