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
		
		<view class="info-scroll" >
			<view class="info-item" v-for="(item, index) in heartInfo" :key="index"
			:class="{ 'no-margin' : !(index % 3) }">
				<view class="info-num">
					<text class="num">{{ item.num }}</text>
					<text class="unit">{{ item.unit }}</text>
				</view>
				<view class="info-label">
					<text class="round" :class="item.className"></text>
					<text class="label">{{ item.name }}</text>
				</view>
			</view>
		</view>

		<view class="motion" v-if="current === 0">
			
			<view class="content">
				<view class="title-style">
					<text class="title-dot-light">实时剂量</text>
					<view class="select-time" @click="actionSheetTap">
						<text>{{ actionSheet[sheetIndex].value }}</text>
						<uni-icons type="arrowdown" size="16" color="#909399" />
					</view>
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
					<text>实时辐射正常范围在90--120之间</text>
				</view>
			</view>
			
			<view class="bar-fixed">
				<text>远程测量</text>
			</view>
			
		</view>

		<view class="blood-pressure" v-if="current === 1">
			
			<view class="content">
				<view class="title-style">
					<view class="title-dot-light">累计辐射</view>
					<view class="select-time" @click="actionSheetTap">
						<text>{{ actionSheet[sheetIndex].value }}</text>
						<uni-icons type="arrowdown" size="16" color="#909399" />
					</view>
				</view>
				
				<view class="chart" :style="{height: `${chartHeight}px`}">
					<echarts-el v-if="chartLoading && bloodOption" key="3" class="echarts" :option="bloodOption"></echarts-el>
					<empty v-if="chartLoading && !bloodOption" title=" 暂无图表数据"></empty>
				</view>
			</view>
			
			<view class="content">
				<view class="title-style">
					<view class="title-dot-light">
						<text>标准范围说明</text>
					</view>
				</view>
				<view class="describe">
					<text>累计剂量正常范围在</text>
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
		name: '实时剂量',
		dateTimeIndex: 0,
		path: 'RadioHistory',
		dateKey: 'RecivedAt',
		units: [{ unit: 'μSv/h' }],
		dataParams: [{
			key: 'Radio',
			value: 'data'
		}]
	}, {
		name: '累计辐射',
		dateTimeIndex: 0,
		path: 'ReportRadioHistory',
		dateKey: 'ReportTime',
		units: [{ unit: 'mSv' }],
		dataParams: [{
			key: 'Radio',
			value: 'data'
		}]
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

	const getHeartInfo = (companyArray) => {
		const heartInfo = [{
			name: '平均值',
			unit: '',
			key: 'average',
			num: '--',
			className: 'blue'
		}, {
			name: '最大值',
			unit: '',
			key: 'max',
			num: '--',
			className: 'green'
		}, {
			name: '最小值',
			unit: '',
			key: 'min',
			num: '--',
			className: 'yellow'
		}]
		let index = 0
		const heartList = []
		companyArray.forEach(item => {
			heartInfo.forEach(list => {
				let cruuent = Object.assign({}, list)
				cruuent.unit = item.unit
				heartList[index] = cruuent
				index += 1
			})
		})
		return heartList
	}

	const actionSheet = [
		{
			key: 1,
			value: '小时',
		},
		{
			key: 2,
			value: '天',
		},
		{
			key: 3,
			value: '周',
		},
		{
			key: 4,
			value: '月',
		},
		{
			key: 5,
			value: '年',
		}
	]

	export default {

		data() {
			let heartInfo = getHeartInfo([{ unit: 'μSv/h' }])
			var titleNames = tabbars.map(item => item.name)
			var today = dateRangeUtils.getDateRange(new Date(), 0, true)
			return {
				tabs,
				sheetIndex: 0,
				actionSheet,
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
		onShow() {
			this.getHistoryData(false)
		},
		methods: {
			actionSheetTap() {
				let itemLlst = this.actionSheet.map(item => item.value)
				uni.showActionSheet({
					title:'请选择图表时间点',
					itemList: itemLlst,
					success: (e) => {
						let tapIndex = e.tapIndex
						this.sheetIndex = tapIndex
						this.getHistoryData()
					}
				})
			},
			getHistoryData(isloading) {
				if (isloading) uni.showLoading({title: ' 加载中...', mask: true})
				let tabbar = tabbars[this.current]
				let path = tabbar.path
				let currentTab = this.tabs.find(item => item.active) || {}
				let params = {
					Limit: 0,
					Page: 10000,
					StartTime: currentTab.createTime,
					EndTime: currentTab.endTime,
					type: this.actionSheet[this.sheetIndex].key
				}
				this.chartLoading = false
				getHistoryData(path, params).then(res => {
					this.chartLoading = true
					let HistoryList = res.Data.HistoryList
					if (path === 'RadioHistory') {
						let str = 'RecivedAt'
						if (HistoryList.length) {
							let obj = this.dataFormat(HistoryList, tabbar)
							obj.seriesName = '实时剂量'
							this.motionOption = this.getBooldParams(obj)
						} else {
							this.dataFormat(HistoryList, tabbar)
							this.motionOption = null
						}
					} else {
						let str = 'ReportTime'
						if (HistoryList.length) {
							let obj = this.dataFormat(HistoryList, tabbar)
							obj.seriesName = '累计剂量'
							this.bloodOption = this.getBooldParams(obj)
						} else {
							this.dataFormat(HistoryList, tabbar)
							this.bloodOption = null
						}
					}
					uni.hideLoading()
				})
			},
			// 对数据进行格式化赋值
			dataFormat(HistoryList, tabbar) {
				let { dateKey, dataParams } = tabbar
				let date = HistoryList.map(item => {
					return item[dateKey].replace(' ', '\n')
				})
				let obj = {}
				dataParams.forEach((param, index) => {
					let data = HistoryList.map(item => item[param.key]);
					if (param.custom) {
						data = data.map(item => item * 7);
					}
					obj[param.value] = data
					let arr = this.computeData(data)
					let startIndex = 3 * index
					let endIndex = 3 * (index + 1)
					let heartInfo = this.heartInfo.slice(startIndex, endIndex)
					heartInfo.forEach(item => {
						item.num = arr[item.key]
					})
				})
				return { date, ...obj }
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
						max: Math.floor(max * 100) / 100,
						min: Math.floor(min * 100) / 100,
						average: Math.floor(average * 100) / 100
					}
				} else {
					arr = {
						max: '--',
						min: '--',
						average: '--'
					}
				}
				return arr
			},
			getBooldParams({ data, date, seriesName }) {
				let currentSize = 20;
				let startValue = date.length < currentSize ? date[0] : date[date.length - currentSize]
				return {
					id: 'echartA',
					tooltip: {
						trigger: 'axis',
						positionStatus: true,
						formatterStatus: true,
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
							type: 'inside',
							startValue: startValue
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
							name: seriesName,
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
						}
					],
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
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
					let HeartInfo = getHeartInfo(tabbars[this.current].units)
					this.heartInfo = HeartInfo
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
		padding: 12rpx 0;

		.info-item {
			width: 30%;
			height: 100%;
			padding: 20rpx;
			line-height: 60rpx;
			display: inline-block;
			margin: 12rpx 16rpx 12rpx 0;
			background: $color-white;

			&.no-margin{
				margin-left: 20rpx;
			}

			.info-num {
				.num {
					font-size: 22px;
					color: $font-color-dark;
				}

				.unit {
					font-size: 14px;
					padding-left: 8rpx;
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
		display: flex;
		justify-content: space-between;
		.title-dot-light {
			height: 18px;
			font-size: 14px;
			padding-left: 6px;
			color: $font-color-dark;
			border-left: 8rpx solid $font-color-spec;
		}
		.select-time {
			color: $font-color-light;
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
