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
			<view class="info-item" v-for="(item, index) in heartInfo" :key="index">
				<view class="info-label">
					<text class="round" :class="item.className"></text>
					<text class="label">{{ item.name }}</text>
				</view>
				<view class="info-num">
					<text class="num">{{ item.num }}</text>
					<text class="unit">{{ item.unit }}</text>
				</view>
				
			</view>
		</view>

		<view class="motion" v-if="current === 0">
			
			<view class="content">
				<view class="title-style">
					<text class="title-dot-light">实时剂量</text>
				</view>
				
				<view class="chart" :style="{height: `${chartHeight}px`}">
					<echarts-el v-if="chartLoading && motionOption" key="2" class="echarts" :option="motionOption"></echarts-el>
					<empty v-if="chartLoading && !motionOption" title=" 暂无图表数据"></empty>
				</view>
			</view>
			
			<view class="bar-fixed" @click="telemetering">
				<text>监测</text>
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
			
			<!-- <view class="content">
				<view class="title-style">
					<view class="title-dot-light">
						<text>标准范围说明</text>
					</view>
				</view>
				<view class="describe">
					<text>累计剂量正常范围在</text>
				</view>
			</view> -->
			
			<view class="bar-fixed" @click="telemetering">
				<text>监测</text>
			</view>
			
		</view>

		
		<view class="content">
			<view class="title-style">
				<view class="title-dot-light">
					<text>个人辐射剂量说明</text>
				</view>
			</view>
			<view class="describe">
				<text class="text">辐射剂量常用单位：希沃特（Sv），毫希沃特（mSv）、微希沃特（μSv）。</text>
				<text class="text">1μSv=0.001mSv，1 mSv=0.001Sv，1μSv=0.000001Sv。</text>
				<text class="text bold">我国对健康人群设定的年平均电离辐射剂量限值为1mSv，医务工作者的剂量限值为20mSv。</text>
				<text style="display:block;margin: 6px 0;">国家电离辐射防护与辐射源安全级别标准 ：</text>
				<table class="table-class">
					<tr>
						<th style="min-width: 140px;">类型</th>
						<th>职业人群	</th>
						<th>大众人群</th>
					</tr>
					<tr v-for="item in tableList" :key="item.id">
						<td style="min-width: 140px;">{{ item.name }}</td>
						<td>{{ item.vocation }}</td>
						<td>{{ item.public }}</td>
					</tr>
				</table>
				<text class="h3 bold">电离辐射小知识：</text>
				<text class="text">在日常生活中，电离辐射主根据来源可以分为天然辐射和人造辐射两类</text>
				<text class="text">一是天然本底辐射，如宇宙射线及存在于自然界中天然放射性核素发出的射线，如土壤、岩石、水和大气中的铀-238、铀-235、钍-232、钾-40、镭-226等；</text>
				<text class="text">全球不同地区的天然本底辐射剂量值存在差别，我国天然本底辐射平均剂量约3.1mSv/年（约0.35μSv/h），芬兰和瑞典较高，约6~8mSv。</text>
				<text class="text">二是人造辐射，包括医疗辐射（如胸片、CT、全身骨显像、PET-CT等）及核事故等。</text>
				<text class="text"></text>
				<text class="text">香烟内具有放射性的钋和铅，如果每天一包烟，每年受到的辐射剂量约为35mSv。</text>
				<text class="text">香蕉当中约有 0.0117% 的放射性钾（钾40），每吃一根香蕉，就受到约 0.1μSv的辐射；</text>
				<text class="text">在飞行到30000英尺高空时，辐射的强度约2μSv/h，也就是飞行10小时，接受的辐射约20μSv；</text>
			</view>
		</view>

		<uni-calendar ref="calendar" class="uni-calendar--hook" :clear-date="true" :date="info.date" :insert="info.insert"
		 :lunar="info.lunar" :startDate="info.startDate" :endDate="info.endDate" :range="info.range" @confirm="confirm"
		 @close="close" />

	</view>
</template>

<script>
	import empty from '@/components/empty.vue'
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
	import EchartsEl from '@/components/echarts/echarts-el.vue'
	import { dateRangeUtils } from '@/common/util.js'
	import { getHistoryData } from '@/api/history.js'
	
	const tabbars = [{
		name: '实时剂量',
		dateTimeIndex: 0,
		path: 'RadioHistory',
		dateKey: 'RecivedAt',
		valueKey: 'Radio',
		dataParams: [{
			name: '最小值',
			unit: 'μSv/h',
			key: 'min',
			num: '--',
			className: 'blue'
		}, {
			name: '平均值',
			unit: 'μSv/h',
			key: 'normal',
			num: '--',
			className: 'green'
		}, {
			name: '最大值',
			unit: 'μSv/h',
			key: 'max',
			num: '--',
			className: 'yellow'
		}],
		dataFormat(HistoryList) {
			let Heart = this.valueKey
			let data = HistoryList.map(item => item[Heart]);
			let max = Math.max.apply(null, data);
			let min = Math.min.apply(null, data);
			let total = 0
			data.forEach(item => {
				total += item
			})
			let normal = (total / data.length) || 0
			
			let param = {
				max: max ? max.toFixed(2) : 0,
				min: min ? min.toFixed(2) : 0,
				normal: normal ? normal.toFixed(2) : 0
			}
			return { param, echartData: { data }  }
		}
	}, {
		name: '累计辐射',
		dateTimeIndex: 0,
		path: 'ReportRadioHistory',
		dateKey: 'ReportTime',
		valueKey: 'Radio',
		dataParams: [{
			name: '最小值',
			unit: 'μSv',
			key: 'min',
			num: '--',
			className: 'blue'
		}, {
			name: '平均值',
			unit: 'μSv',
			key: 'normal',
			num: '--',
			className: 'green'
		}, {
			name: '最大值',
			unit: 'μSv',
			key: 'max',
			num: '--',
			className: 'yellow'
		}],
		dataFormat(HistoryList) {
			let Heart = this.valueKey
			let data = HistoryList.map(item => item[Heart]);
			let max = Math.max.apply(null, data);
			let min = Math.min.apply(null, data);
			let total = 0
			data.forEach(item => {
				total += item
			})
			let normal = (total / data.length) || 0
			
			let param = {
				max: max ? max.toFixed(2) : 0,
				min: min ? min.toFixed(2) : 0,
				normal: normal ? normal.toFixed(2) : 0
			}
			return { param, echartData: { data }  }
		}
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
	
	const tableList = [
		{
			name: '连续五年平均有效剂量',
			vocation: '< 20mSv',
			public: '<= 1mSv'
		},
		{
			name: '任何一年不超过',
			vocation: '<= 50mSv',
			public: '<= 5mSv'
		},
		{
			name: '一年内晶体受照射量',
			vocation: '<= 150mSv',
			public: '<= 15mSv'
		},
		{
			name: '一年内四肢和皮肤',
			vocation: '<= 500mSv',
			public: '<= 50mSv'
		}
	]
	export default {

		data() {
			let heartInfo = tabbars[0].dataParams
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
				tableList,
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
			EchartsEl
		},
		onLoad() {
			this.chartHeight = uni.upx2px(500)
			this.isLoad = false
			this.toggleTabs(this.current)
		},
		onShow() {
			if (this.isLoad) {
				this.getHistoryData(false)
			}
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
			getHistoryData(isloading = true) {
				if (isloading) uni.showLoading({title: ' 加载中...', mask: true})
				let tabbar = tabbars[this.current]
				let path = tabbar.path
				let currentTab = this.tabs.find(item => item.active) || {}
				// 查询截止为今天，时间要添加一天
				let endTime = new Date(currentTab.endTime).getTime()
				endTime = new Date(endTime + (24 * 60 * 60 * 1000))
				endTime = dateRangeUtils.formateDate(endTime)
				let params = {
					Limit: 10000,
					Page: 0,
					StartTime: currentTab.createTime,
					EndTime: endTime,
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
							this.bloodOption = this.getTotalBooldParams(obj)
						} else {
							this.dataFormat(HistoryList, tabbar)
							this.bloodOption = null
						}
					}
					uni.hideLoading()
					this.isLoad = true
				})
			},
			// 对数据进行格式化赋值
			dataFormat(HistoryList, tabbar) {
				let { dateKey, dataParams, dataFormat } = tabbar
				let date = HistoryList.map(item => {
					return item[dateKey].replace(' ', '\n')
				})
				let obj = null
				if (HistoryList.length) {
					obj = dataFormat.call(tabbar, HistoryList)
					this.heartInfo.forEach(item => {
						item.num = obj.param[item.key]
					})
				} else {
					obj = { echartData: {} }
					this.heartInfo.forEach(item => {
						item.num = '--'
					})
				}
				return { date, ...obj.echartData }
			},
			getTotalBooldParams({ data, date, seriesName }) {
				let currentSize = 20;
				let startValue = date.length < currentSize ? date[0] : date[date.length - currentSize];
				
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
							name: seriesName,
							type: 'bar',
							data: data,
							// 自定义变量，以数组形式传递渐变参数
							linearGradient: [0, 0, 0, 1,
								[{
										offset: 0,
										color: '#f59a23'
									},
									{
										offset: 0.7,
										color: '#f6b560'
									},
									{
										offset: 1,
										color: '#f4d4a9'
									}
								]
							]
						}
					]
				}
			},
			getBooldParams({ data, date, seriesName }) {
				let currentSize = 20;
				let startValue = date.length < currentSize ? date[0] : date[date.length - currentSize]
				return {
					id: 'echartB',
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
				if (!this.deviceEmpey) {
					this.getHistoryData()
				}
			},
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
					this.heartInfo = tabbars[this.current].dataParams
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
			telemetering() {
				uni.showLoading({
					title: '正在监测中...',
				})
				setTimeout(() => {
					uni.hideLoading()
					this.$api.msg('辐射监测功能暂未开放')
				}, 1000)
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

<style lang="scss" scoped>
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
		padding: 12rpx 20rpx;
		background: #f5f5f5;
		.info-item {
			width: 100%;
			height: 40px;
			padding: 0 20rpx;
			line-height: 80rpx;
			display: flex;
			margin: 12rpx 16rpx 12rpx 0;
			background: $color-white;

			.info-num {
				flex: 1;
				padding-left: 12px;
				display: flex;
				justify-content: space-between;
				.num {
					font-size: 18px;
					color: $font-color-dark;
				}

				.unit {
					font-size: 14px;
					padding-left: 8rpx;
					color: $font-color-light;
				}
			}

			.info-label {
				display: inline-flex;
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
			.text {
				text-indent: 24px;
				display: block;
				font-size: 14px;
				min-height: 22px;
				line-height: 22px;
				padding: 2px 0px;
			}
			.h3 {
				display: block;
				padding: 12px 0px;
			}
			.bold {
				font-weight: bold;
			}
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
	
	table,
	table tr th,
	table tr td {
		border: 1px solid #4399fc;
	}
	
	.table-class {
		
		margin-top: 24rpx;
		width: 100%;
		min-height: 30px;
		line-height: 30px;
		text-align: center;
		border-collapse: collapse;
		padding: 6px;
		tr:nth-child(2n) {
			background-color: rgba(67, 153, 252, 0.6);
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
		padding: 12rpx;
		line-height: 60rpx;
		text-align: center;
		color: #fff;
	}
</style>
