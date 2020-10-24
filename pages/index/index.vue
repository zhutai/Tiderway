<template>
	<view class="container">
		
		<!--  自定义顶部栏 -->
		<uni-nav-bar fixed :border="false" :statusBar="true">
			<view class="user-center">
				<image class="user-avatar" src="../../static/missing-face.png"></image>
			</view>
			<view class="bar-text" slot="left" @click="showDrawer('showLeft')">切换设备</view>
			<view class="bar-text" slot="right" @click="addDevice">添加设备</view>
		</uni-nav-bar>
		
		<!--  设备状态显示 -->
		<view class="device-info">
			<map class="map" :latitude="latitude" :longitude="longitude" :enable-satellite="enableSatellite" :markers="markers">
				<cover-view class="back-block"></cover-view>
				<!-- <cover-view class="address">{{ address }}</cover-view> -->
			</map>
		</view>
		
		<view class="example-body">
			<uni-section title="健康数据" type="line">
				<view class="cell-more">
					<text class="cell-text">更多</text>
					<uni-icons type="arrowright" size="18" color="#C0C4CC" />
				</view>
			</uni-section>
			<view class="grid-list health-data">
				<uni-grid :column="4" :show-border="false" :square="false" @change="changeHealth">
					<uni-grid-item v-for="(item ,index) in healthyList" :index="index" :key="index">
						<view class="grid-item-box">
							<text class="block text iconfont" :style="{ color: item.color, fontSize: '24px' }" :class="item.icon"></text>
							<text class="block text">{{item.num}}</text>
							<text class="block text">{{item.name}}</text>
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
		</view>
		
		<view class="example-body">
			<uni-section title="辐射数据" type="line" style="margin: 0;">
				<view class="cell-more">
					<text class="cell-text">更多</text>
					<uni-icons type="arrowright" size="18" color="#C0C4CC" />
				</view>
			</uni-section>
			<view class="grid-list radia-data">
				<uni-grid :column="2" :show-border="false" :square="false" @change="changeRadia">
					<uni-grid-item v-for="(item ,index) in radiaList" :index="index" :key="index">
						<view class="radia-box">
							<view class="box-left">
								<text class="block iconfont" :style="{ color: item.color, fontSize: '32px' }" :class="item.icon"></text>
							</view>
							<view class="box-right">
								<text class="block">{{item.num}}</text>
								<text class="block">{{item.name}}({{item.unit}})</text>
								<!-- <text class="block text"></text> -->
							</view>
							
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
		</view>
		
		<!--  设备功能表模块 -->
		<view class="example-body">
			<uni-section title="设备功能表" type="line"></uni-section>
			<view class="grid-list option-list">
				<uni-grid :column="3" :show-border="false" :square="false" @change="changeOption">
					<uni-grid-item v-for="(item ,index) in optionList" :index="index"  :key="index">
						<view class="cate-item">
							<!-- <view> -->
								<text class="block text iconfont" :style="{ color: '#4399fc', fontSize: '30px' }" :class="item.icon"></text>
							<!-- </view>
							<view> -->
								<text class="block">{{ item.name }}</text>
							<!-- </view> -->
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
		</view>

		<uni-drawer ref="showLeft" mode="left" :width="260" @change="changeDrawer($event,'showLeft')">
			<uni-status-bar />
			<view class="device-box">
				<view class="device-title">设备列表</view>
				<scroll-view :style="{height: `${scrollHeight}px`}" scroll-y="true" @scrolltolower="scrolltolower">
					<!-- <view v-for="index in 100">{{ index }}</view> -->
					<uni-list class="device-list">
						<uni-list-item v-for="(item, index) in deviceList" :key="index" clickable @click="swtichDevice(item)">
							<view slot="body" class="device-left" :class="{ 'select-device' : item.IMEI === deviceImei }">
								<view class="block">
									<text class="login-name" v-if="item.LoginName">{{ item.LoginName }}</text>
									<text v-if="item.LoginName && !item.sex"
									style="color: #fa436a"
									class="iconfont iconiconfontdingwei3" />
									<text style="color: #4399fc"
									v-if="item.LoginName && item.sex" 
									class="iconfont iconbushu" />
									<text v-if="!item.LoginName">未绑定</text>
								</view>
								<text class="block">{{ item.IMEI }}</text>
							</view>
							<text slot="footer" class="device-right" :class="{blue: item.Status === 5}">{{ deviceStatus[item.Status - 1]  }}</text>
						</uni-list-item>
					</uni-list>
					<uni-load-more :status="status" />
				</scroll-view>
			</view>
		</uni-drawer>

	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { monitor } from '@/api/location'
import { getHealthInfo, getDeviceList } from '@/api/device.js'
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import { bdToGaoDe } from '@/mock'

let page = 0
const healthyList = [
	{
		name: '步',
		unit: 'step',
		icon: 'iconbushu',
		key: 'Step',
		color: '#4399fc',
		num: '--'
	},
	{
		name: ' 距离',
		unit: 'step',
		icon: 'iconbushu',
		key: 'Distance',
		color: '#95F204',
		num: '--'
	},{
		name: '心率',
		unit: 'bpm',
		icon: 'iconjiankang',
		key: 'Heart',
		color: '#95F204',
		num: '--'
	},{
		name: '血压',
		unit: 'mmHg',
		icon: 'iconxieya',
		color: '#F59A23',
		key: 'Rate',
		num: '-'
	},
]

const radiaList = [
	{
		name: '实时剂量',
		unit: 'µSv/h',
		icon: 'iconshijian1',
		key: 'Radio',
		color: '#4399fc',
		num: '--'
	},{
		name: '累计剂量',
		unit: 'mSv',
		icon: 'iconleiji',
		color: '#F59A23',
		key: 'TotalRadio',
		num: '--'
	}
]

const optionList = [
	{
		icon: 'iconiconfontdingwei3',
		name: '地图定位',
		url: '/pages/location/monitor'
	},{
		icon: 'iconhuodongguiji',
		name: '活动轨迹',
		url: '',
	},{
		icon: 'iconboda',
		name: '拨打设备',
		url: '',
	},{
		icon: 'iconqinqinghaomachaxun',
		name: '亲情号码',
		url: '/pages/number/list',
	},{
		icon: 'iconshebeishezhi',
		name: '预警设置',
		url: '/pages/alarm/set',
	},{
		icon: 'iconshebeishezhi',
		name: '设备设置',
		url: "/pages/device/setting"
	}
]

export default {
	data() {
		return {
			status: 'loading',
			deviceStatus: ['未激活', '已激活', '过期', '黑名单', '在线', '离线'],
			showLeft: false,
			scrollHeight: 400,
			titleNViewBackground: '',
			swiperCurrent: 0,
			swiperLength: 0,
			carouselList: [],
			goodsList: [],
			deviceLoading: false,
			deviceList: [],
			healthyList,
			optionList,
			radiaList,
			// 地图部分数据
			latitude: 39.909,
			longitude: 116.39742,
			address: '北京市天安门',
			enableSatellite: false,
			markers: [{
				latitude: 39.9085,
				longitude: 116.39747,
				iconPath: '../../static/icon/0.png',
				width: 24,
				height: 24
			}]
		};
	},
	components: {
		uniNavBar
	},
	computed: {
		...mapState(['deviceImei', 'deviceEmpey', 'userInfo'])
	},
	onLoad() {
		uni.getSystemInfo({
			success: (res) => {
				let windowHeight = res.windowHeight
				let titleHeight = uni.upx2px(120)
				console.log(res)
				this.scrollHeight = windowHeight - titleHeight - res.statusBarHeight
			}
		})
	},
	onShow() {
		if (this.deviceEmpey) {
			uni.showModal({
				title: "未添加设备",
				content: "用户未添加设备，无法查看相应的设备信息，请添加设备后进行查看。",
				showCancel: false,
				confirmText: "确定",
				success: function(res) {
					console.log(res)
					if (res.confirm) {
						uni.navigateTo({
							url: '/pages/device/add'
						})
					}
				}
			})
		} else {
			this.loadData();
			this.location()
			// // #ifdef APP-PLUS
			// var ptObj = new plus.maps.Point('116.39747', '39.9085' );
			// plus.maps.Map.reverseGeocode(ptObj, {}, function(res) {
			// 	console.log(res)
			// },function () {
			// })
			// // #endif
		}
	},
	onReady() {
		console.log(3)
	},
	methods: {
		...mapMutations(['setDeviceImei']),
		scrolltolower(e) {
			page += 1
			this.getDeviceList()
		},
		addDevice() {
			uni.navigateTo({
				url:'/pages/device/add'
			})
		},
		swtichDevice(item) {
			if (item.IMEI) {
				this.setDeviceImei({ deviceImei: item.IMEI, imeiLength: 1 })
				this.$refs.showLeft.close()
				this.loadData();
			}
		},
		/**
		 * 请求静态数据只是为了代码不那么乱
		 * 分次请求未作整合
		 */
		async loadData() {
			const result = await getHealthInfo()
			let healthInfo = result.Data || {}
			healthInfo.Rate = (healthInfo.Shrink + healthInfo.Diastole) / 2
			this.healthyList.forEach(item => {
				item.num = result.Data[item.key]
			})
			this.radiaList.forEach(item => {
				item.num = result.Data[item.key]
			})
		},
		// 地图数据请求
		async location() {
			let result = await monitor({})
		
			var latlng = bdToGaoDe(result.Data.Lat, result.Data.Lng)
			console.log(latlng)
			let market = {
				callout:{
					content: result.Data.RecivedAt,
					display: 'ALWAYS',
					padding: 10
				},
				latitude: latlng.lat,
				longitude: latlng.lng,
				iconPath: '../../static/icon/0.png',
				width: 30,
				height: 30
			}
		
			this.latitude = latlng.lat
			this.longitude = latlng.lng
			this.markers = [market];
			// #ifdef APP-PLUS
			var point = new plus.maps.Point(latitude,longitude);
			plus.maps.Map.reverseGeocode(point, {}, function(res) {
				this.address = res.address;
			})
			// #endif
		},
		showDrawer(e) {
			this.$refs[e].open()
		},
		async changeDrawer(bool) {
			this.showLeft = bool
			if (bool) {
				this.getDeviceList(true)
			} else {
				page = 0
				this.deviceList = []
			}
		},
		getDeviceList(isFirst) {
			this.status = 'loading'
			getDeviceList({Page: page, Limit: 10 }).then(res => {
				this.deviceLoading = true
				let deviceList = res.Data.DeviceList || []
				if (!deviceList.length) this.status = 'noMore'
				this.deviceList = this.deviceList.concat(deviceList)
				if (isFirst) {
					this.checkHeight()
				}
			})
		},
		checkHeight() {
			uni.getSystemInfo({
				success: (res) => {
					let windowHeight = res.windowHeight
					setTimeout(() => {
						let obj = uni.createSelectorQuery().select('.device-list')
						obj.boundingClientRect((data) => { // data - 各种参数
							let height = data.height
							if (height < windowHeight) {
								let bool = (height + (height / (page || 1))) < windowHeight
								page += 1;
								this.getDeviceList(bool)
							}
						}).exec()
					}, 0)
				}
			})
		},
		changeHealth(e) {
			let index = e.detail.index
		},
		changeRadia(e) {
			let index = e.detail.index
		},
		changeOption(e) {
			let index = e.detail.index
			let item = this.optionList[index]
			console.log(item)
			uni.navigateTo({
				url: item.url
			})
		}
	},
	// #ifdef APP-PLUS
	// app端拦截返回事件 ，仅app端生效
	onHide() {
		if (this.showLeft) {
			this.$refs.showLeft.close()
			return true
		}
	},
	// #endif
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
	
	page {
		background: #f5f5f5;
	}
	
	.container {
		background: #f5f5f5;
	}
	
	.block {
		display: block;
	}
	
	.map {
		width: 100vw;
		height: 400rpx;
		position: relative;
	}
	
	.text {
		color: #999;
		padding-top: 8rpx;
		font-size: 14px;
		text-align: center;
	}
	
	.scroll-Y {
		height: calc(100vh - 120rpx);
	}
	
	.bar-text {
		width: auto;
		font-size: 14px;
		color: $font-color-spec;
	}
	
	.example-body {
		margin-bottom: 24rpx;
		.grid-list {
			/* #ifndef APP-NVUE */
			display: flex;
			/* #endif */
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: center;
			padding-bottom: 24rpx;
			font-size: 14px;
			background-color: #ffffff;
				
			.radia-box {
				/* #ifndef APP-NVUE */
				display: flex;
				/* #endif */
				flex-direction: row;
				justify-content: center;
				align-items: center;
				padding: 10px;
				.box-right {
					color: #666;
					font-size: 14px;
					padding-left: 24rpx;
				}
			}
		}
		.health-data {
			height: 176rpx;
		}
		.radia-data {
			height: 140rpx;
		}
		.option-list {
			// height: 368rpx;
		}
	}
	
	.user-center {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		image {
			width: 42px;
			height: 42px;
			border-radius: 50%;
		}
	}
	
	.device-box {
		.device-title {
			padding: 32rpx;
			height: 120rpx;
			font-size: 16px;
		}
		.device-left {
			flex: 1;
			color: #aaa;
			.login-name {
				color: $font-color-dark;
				padding-right: 6px;
			}
		}
		.select-device {
			color: $font-color-spec;
			.login-name {
				color: $font-color-spec;
			}
		}
		.device-right {
			color: #aaa;
			align-self: center;
		}
		.blue {
			color: $font-color-spec;
		}
	}
	
	.cell-more {
		.cell-text {
			color: #C0C4CC;
			align-self: center;
			font-size: 14px;
		}
	}
	
	.cate-item {
		padding: 24rpx 0;
		color: $font-color-dark;
		text-align: center;
	}
</style>
