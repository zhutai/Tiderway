<template>
	<view class="container">
		
		<!--  自定义顶部栏 -->
		<uni-nav-bar fixed :border="false" :statusBar="true">
			<view class="user-center">
				<image class="user-avatar" src="../../static/missing-face.png"></image>
			</view>
			<view class="bar-text" slot="left" @click="showDrawer('showLeft')">切换设备</view>
			<view class="bar-text" slot="right">添加设备</view>
		</uni-nav-bar>
		
		<!--  设备状态显示 -->
		<view class="device-info">
			<view class="device-icon">
				<uni-icons type="info" color="#8f8f94" size="48" />
			</view>
			<view class="device-text">
				<text>很遗憾您的设备不在线~	~</text>
			</view>
			<view class="device-btn">
				<button class="mini-btn" type="default" :plain="true" size="mini">查看原因</button>
			</view>
		</view>
		
		<view class="example-body">
			<uni-section title="健康数据" type="line">
				<view class="cell-more">
					<text class="cell-text">更多</text>
					<text class="cell-icon yticon icon-you"></text>
				</view>
			</uni-section>
			<view class="grid-list">
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
			<uni-section title="辐射数据" type="line">
				<view class="cell-more">
					<text class="cell-text">更多</text>
					<text class="cell-icon yticon icon-you"></text>
				</view>
			</uni-section>
			<view class="grid-list">
				<uni-grid :column="3" :show-border="false" :square="false" @change="changeRadia">
					<uni-grid-item v-for="(item ,index) in radiaList" :index="index" :key="index">
						<view class="grid-item-box">
							<text class="block text iconfont" :style="{ color: item.color, fontSize: '24px' }" :class="item.icon"></text>
							<text class="block text">{{item.num}}</text>
							<text class="block text">{{item.name}}</text>
							<text class="block text">({{item.unit}})</text>
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
		</view>
		
		<!--  设备功能表模块 -->
		<view class="example-body">
			<uni-section title="设备功能表" type="line"></uni-section>
			<view class="grid-list">
				<uni-grid :column="3" :show-border="false" :square="false" @change="changeOption">
					<uni-grid-item class="cate-section" v-for="(item ,index) in optionList" :index="index"  :key="index">
						<view class="cate-item">
							<text class="block text iconfont" :style="{ color: '#4399fc', fontSize: '30px' }" :class="item.icon"></text>
							<!-- <image :src="item.imageUrl"></image> -->
							<text style="padding-top: 12rpx;">{{ item.name }}</text>
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
		</view>
		
		<uni-drawer ref="showLeft" mode="left" :width="260" @change="changeDrawer($event,'showLeft')">
			<view class="device-box">
				<view class="device-title">我的设备列表</view>
				<scroll-view class="scroll-Y" scroll-y="true" @scrolltolower="scrolltolower">
					<!-- <view v-for="index in 100">{{ index }}</view> -->
					<uni-list >
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
							<text slot="footer" class="device-right">在线</text>
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
import { getHealthInfo, getDeviceList } from '@/api/device.js'
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"

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
		num: '--'
	},
]

const radiaList = [
	{
		name: '峰值剂量',
		unit: 'µSv/h',
		icon: 'iconfengzhiguzhituli',
		key: 'step',
		color: '#4399fc',
		num: 3264
	},{
		name: '累计时间',
		unit: 'Seconds',
		icon: 'iconshijian1',
		key: 'bpm',
		color: '#95F204',
		num: 90
	},{
		name: '累计剂量',
		unit: 'µSv/h',
		icon: 'iconleiji',
		color: '#F59A23',
		key: 'mmHg',
		num: 36.5
	},
]

const optionList = [
	{
		icon: 'iconiconfontdingwei3',
		name: '地图定位',
		url: '/pages/location/monitor'
	},{
		icon: 'iconhuodongguiji',
		name: '活动轨迹',
		url:'',
	},{
		icon: 'iconboda',
		name: '拨打设备',
		url:'',
	},{
		icon: 'iconqinqinghaomachaxun',
		name: ' 亲情号码',
		url:'',
	},{
		icon: 'iconshebeishezhi',
		name: ' 设备设置',
		url:'',
	}
]

export default {

	data() {
		return {
			status: 'loading',
			showLeft: false,
			titleNViewBackground: '',
			swiperCurrent: 0,
			swiperLength: 0,
			carouselList: [],
			goodsList: [],
			deviceLoading: false,
			deviceList: [],
			healthyList,
			optionList,
			radiaList
		};
	},
	components: {
		uniNavBar
	},
	computed: {
		...mapState(['deviceImei', 'deviceEmpey', 'userInfo'])
	},
	onLoad() {
	},
	onShow() {
		console.log(this.deviceImei)
		console.log(this.deviceEmpey)
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
							url: '/pages/set/set'
						})
					}
				}
			})
		} else {
			this.loadData();
			// #ifdef APP-PLUS
			var ptObj = new plus.maps.Point('116.39747', '39.9085' );
			plus.maps.Map.reverseGeocode(ptObj, {}, function(res) {
				console.log(res)
				alert(res)
			},function () {
				
			})
			// #endif
		}
	},
	onReady() {
		console.log(3)
	},
	methods: {
		...mapMutations(['setDeviceImei']),
		scrolltolower() {
			page += 1
			this.getDeviceList()
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
		},
		showDrawer(e) {
			this.$refs[e].open()
		},
		async changeDrawer(bool) {
			this.showLeft = bool
			if (bool) {
				this.getDeviceList()
			} else {
				page = 0
				this.deviceList = []
			}
		},
		getDeviceList() {
			this.status = 'loading'
			getDeviceList({Page: page, Limit: 10 }).then(res => {
				this.deviceLoading = true
				let deviceList = res.Data.DeviceList || []
				if (!deviceList.length) this.status = 'noMore'
				this.deviceList = this.deviceList.concat(deviceList)
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
			uni.navigateTo({
				url: item.url
			})
		}
	},
	// #ifdef APP-PLUS
	// app端拦截返回事件 ，仅app端生效
	onBackPress() {
		if (this.showLeft) {
			this.$refs.showLeft.closwe()
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
	.m-t{
		margin-top: 16upx;
	}
	
	.container {
		background: #f5f5f5;
	}
	
	.block {
		display: block;
	}
	
	.text {
		color: #999;
		font-size: 12px;
		text-align: center;
	}
	
	.scroll-Y {
		height: 1214rpx;
	}
	
	.bar-text {
		width: auto;
		font-size: 14px;
		color: $font-color-spec;
	}
	
	.example-body {
		margin-bottom: 24rpx;
		.grid-list {
			// height: 1500upx;
			/* #ifndef APP-NVUE */
			display: flex;
			/* #endif */
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: center;
			padding-bottom: 24rpx;
			font-size: 14px;
			background-color: #ffffff;
		}
	}
	
	.user-center {
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: center;
		image {
			width: 42px;
			height: 42px;
			border-radius: 50%;
		}
	}
	
	.device-info {
		padding: 16px;
		text-align: center;
		.device-icon {
			font-size: 0;
			padding-top: 12px;
		}
		.device-text {
			font-size: 12px;
			color: #C0C4CC;
		}
		.device-btn {
			font-size: 0;
			padding-top: 12px;
			/deep/ uni-button[type=default] {
				color: #C0C4CC;
				transform: scale(0.8);
				border: 1px solid #C0C4CC;
			}
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
			color: $font-color-spec;
			align-self: center;
		}
	}
	
	.cell-more {
		.cell-text, .cell-icon {
			color: #C0C4CC;
			align-self: center;
			font-size: 12px;
		}
	}
	
	/* 分类 */
	.cate-section {
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-wrap: wrap;
		// padding: 30upx 22upx; 
		background: #fff;
		.cate-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 24rpx 0;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
		}
		/* 原图标颜色太深,不想改图了,所以加了透明度 */
		image {
			width: 88upx;
			height: 88upx;
			margin-bottom: 14upx;
			border-radius: 50%;
			opacity: .7;
			box-shadow: 4upx 4upx 20upx rgba(250, 67, 106, 0.3);
		}
	}
	.ad-1{
		padding: 4upx 30upx 24upx;
		background: #fff;
		.s-header{
			display:flex;
			align-items:center;
			height: 92upx;
			line-height: 1;
			.s-img{
				width: 140upx;
				height: 30upx;
			}
			.tip{
				font-size: $font-base;
				color: $font-color-light;
				margin: 0 20upx 0 40upx;
			}
			.timer{
				display:inline-block;
				width: 40upx;
				height: 36upx;
				text-align:center;
				line-height: 36upx;
				margin-right: 14upx;
				font-size: $font-sm+2upx;
				color: #fff;
				border-radius: 2px;
				background: rgba(0,0,0,.8);
			}
			.icon-you{
				font-size: $font-lg;
				color: $font-color-light;
				flex: 1;
				text-align: right;
			}
		}
		.floor-list{
			white-space: nowrap;
		}
		.scoll-wrapper{
			display:flex;
			align-items: flex-start;
		}
		.floor-item{
			width: 150upx;
			margin-right: 20upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;
			line-height: 1.8;
			image{
				width: 150upx;
				height: 150upx;
				border-radius: 6upx;
			}
			.price{
				color: $uni-color-primary;
			}
		}
	}

</style>
