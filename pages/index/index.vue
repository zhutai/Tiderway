<template>
	<view class="container">
		
		<!--  自定义顶部栏 -->
		<uni-nav-bar fixed :border="false" :statusBar="true">
			<view class="user-center">
				<image class="user-avatar" :src="userInfo.Avatar || defaultAvatar"></image>
			</view>
			<view class="bar-text" slot="left" @click="jumpDevice('/pages/device/list')">切换设备</view>
			<view class="bar-text" slot="right" @click="jumpDevice('/pages/device/add')">添加设备</view>
		</uni-nav-bar>
		
		<!--  设备状态显示 -->
		<view class="device-info">
			<view class="map" >
				<web-view v-if="token" :src="webViewStr">
				</web-view>
			</view>
		</view>
		
		<view class="example-body">
			<uni-section title="健康数据" type="line">
				<view class="cell-more" @click="moreClick('/pages/health/health')">
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
				<view class="cell-more" @click="moreClick('/pages/radiation/radiation')">
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
			<uni-section title="功能列表" type="line"></uni-section>
			<view class="option-list">
				<uni-grid :column="3" :show-border="false" :square="false" @change="changeOption">
					<uni-grid-item v-for="(item ,index) in optionList" :index="index"  :key="index">
						<view class="cate-item">
								<text class="block text iconfont" :style="{ color: '#4399fc', fontSize: '30px' }" :class="item.icon"></text>
								<text class="block">{{ item.name }}</text>
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
		</view>

	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
// import { monitor } from '@/api/location'
import { getHealthInfo, getDeviceList } from '@/api/device.js'
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import { getDeviceToken } from '@/api/device.js'
const defaultAvatar = require('@/static/image/userAvatar.png')
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
		icon: 'iconchizi',
		key: 'Distance',
		color: '#95F204',
		num: '--'
	},{
		name: '心率',
		unit: 'bpm',
		icon: 'iconjiankang',
		key: 'Heart',
		color: '#9c9bf5',
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
		url: '/pages/location/activity',
	},{
		icon: 'iconboda',
		name: '拨打设备'
	},{
		icon: 'iconqinqinghaomachaxun',
		name: 'SOS号码',
		url: '/pages/number/list',
	},{
		icon: 'iconjianyixiaxian',
		name: '预警设置',
		url: '/pages/alarm/set',
	},{
		icon: 'iconshebeishezhi',
		name: '设备配置',
		url: "/pages/device/setting"
	}
]
var wv;
export default {
	data() {
		return {
			ifMap: true,
			defaultAvatar,
			status: 'loading',
			deviceStatus: ['未激活', '已激活', '过期', '黑名单', '在线', '离线'],
			showLeft: false,
			scrollHeight: 400,
			deviceLoading: false,
			deviceList: [],
			healthyList,
			optionList,
			radiaList,
			token: '',
			webViewStr: '',
			h5Url: 'http://web.tiderway.com/H5Location/H5Monitor'
		};
	},
	components: {
		uniNavBar
	},
	computed: {
		...mapState(['deviceImei', 'deviceEmpey', 'userInfo', 'deviceItem'])
	},
	onLoad() {
		this.getWebViewToken()
		uni.getSystemInfo({
			success: (res) => {
				let windowHeight = res.windowHeight
				let titleHeight = uni.upx2px(120)
				this.statusBarHeight = res.statusBarHeight
				this.scrollHeight = windowHeight - titleHeight - res.statusBarHeight
			}
		})
	},
	onReady() {
		this.setWebViewHeight()
	},
	onShow() {
		if (this.deviceEmpey) {
			uni.showModal({
				title: "未添加设备",
				content: "用户未添加设备，无法查看相应的设备信息，请添加设备后进行查看。",
				showCancel: false,
				confirmText: "确定",
				success: function(res) {
					if (res.confirm) {
						uni.navigateTo({
							url: '/pages/device/add'
						})
					}
				}
			})
		} else {
			// console.log(this.deviceImei)
			if (this.deviceImei) {
				this.loadData()
			}
			let bool = uni.getStorageSync('isSwitchDevice')
			if (bool) {
				this.getWebViewToken()
				uni.removeStorageSync('isSwitchDevice')
				this.setWebViewHeight()
			}
		}
	},
	methods: {
		...mapMutations(['selectDevice']),
		scrolltolower(e) {
			page += 1
			this.getDeviceList()
		},
		setWebViewHeight() {
			// #ifdef APP-PLUS
			var currentWebview = this.$scope.$getAppWebview() 
			//此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效，非v3编译模式使用this.$mp.page.$getAppWebview()
			setTimeout(() => {
				wv = currentWebview.children()[0]
				wv.setStyle({top: 45 + this.statusBarHeight, height: uni.upx2px(400)})
			}, 400); //如果是页面初始化调用时，需要延时一下
			// #endif
		},
		getWebViewToken() {
			this.token = ''
			getDeviceToken({}).then(res => {
				this.token = res.Data
				let url = this.h5Url + `?token=${this.token}&tool=0`
				this.webViewStr = url
			})
		},
		jumpDevice(url) {
			uni.navigateTo({
				url: url
			})
		},
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
		moreClick(url) {
			uni.switchTab({
				url: url
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
			if (item.url) {
				uni.navigateTo({
					url: item.url
				})
			} else {
				let phone = this.deviceItem.PhoneNum
				phone += ''
				if (phone) {
					uni.makePhoneCall({
						phoneNumber: phone
					})
				} else {
					uni.showModal({
						content: "用户未添加手机号码，暂时无法拨打，请添加手机号码后再进行拨打",
						showCancel: false,
						confirmText: "确定",
						success: function(res) {
							if (res.confirm) {
								// uni.navigateTo({
								// 	url: '/pages/device/setting'
								// })
							}
						}
					})
				}
			}
		}
	},
	// #ifdef APP-PLUS
	// app端拦截返回事件 ，仅app端生效
	onHide() {
		if (this.showLeft) {
			this.ifMap = true
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
			height: 368rpx;
			background-color: #fff;
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
