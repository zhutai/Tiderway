<template>
	<view class="container">
		
		<!--  自定义顶部栏 -->
		<uni-nav-bar fixed :border="true" :statusBar="true">
			<view class="user-center">
				<image class="user-avatar" :src="userInfo.Avatar || defaultAvatar"></image>
			</view>
			<view class="bar-text" slot="left" @click="jumpDevice('/pages/device/list')">切换设备</view>
			<view class="bar-text" slot="right" @click="jumpDevice('/pages/device/add')">添加设备</view>
		</uni-nav-bar>
		
		<!--  设备状态显示 -->
		<view class="example-body">
			<view class="device-info">
				
				<view class="device-online">
					
					<view class="info-list">
						<view class="info-item left-radius" v-for="(item, index) in infoList.slice(0,2)">
							<!-- <text class="iconfont" :class="item.icon"></text> -->
							<text class="title">{{ item.name }}：</text>
							<text class="value">{{ (item.value || '--') + item.unit }}</text>
						</view>
					</view>
					
					<view>
						<view class="countdown">
							<view class="box"><text class="dotdot" :style="countColor"></text></view>
							<text class="seconds" :style="countFontSize">{{ bigRadio || '--' }}</text>
							<view class="timeRefSeconds">μSv/h</view>
						</view>
						<view class="device-status">
							<text class="title">设备状态：</text>
							<text class="value gray" v-if="!deviceImei">无设备</text>
							<text class="value" v-else-if="isOnLine == 5">{{ deviceStatus[isOnLine - 1] }}</text>
							<text class="value gray" v-else>{{ deviceStatus[isOnLine - 1] }}</text>
						</view>
					</view>
					
					<view class="info-list">
						<view class="info-item right-radius" v-for="(item, index) in infoList.slice(2,4)">
							<!-- <text class="iconfont" :class="item.icon"></text> -->
							<text class="title">{{ item.name }}：</text>
							<text class="value">{{ (item.value || '--') + item.unit }}</text>
						</view>
					</view>
				</view>
				
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

		<xy-dialog
			:title="dialogTitle"
			:show="dialogVisible"
			:content="dialogContent"
			:isShowCancel="false"
			@confirmButton="confirmButton">
		</xy-dialog>
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
		name: '实时剂量率',
		unit: 'µSv/h',
		icon: 'iconshijian1',
		key: 'Radio',
		color: '#4399fc',
		num: '--'
	},{
		name: '累计剂量',
		unit: 'µSv',
		icon: 'iconleiji',
		color: '#F59A23',
		key: 'TotalRadio',
		num: '--'
	}
]

const infoList = [
	{
		icon: 'iconiconfontdingwei3',
		name: '电量',
		key: 'Battery',
		value: '',
		unit: '%',
		color: '#43ff9c'
	},{
		icon: 'iconiconfontdingwei3',
		name: '电压',
		key: 'Voltage',
		value: '',  
		unit: 'V',
		color: '#F59A23'
	},{
		icon: 'iconiconfontdingwei3',
		name: '预警',
		key: 'AlarmCount',
		value: '',
		unit: '次',
		color: '#ec6e6e'
	},{
		icon: 'iconiconfontdingwei3',
		name: '温度',
		key: 'Temperature',
		value: '',
		unit: '℃',
		color: '#9c9bf5'
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
		url: '/pages/location/activity',
	},{
		icon: 'iconshebeishezhi',
		name: '设备配置',
		url: "/pages/device/setting"
	},{
		icon: 'iconqinqinghaomachaxun',
		name: '联系人',
		url: '/pages/number/list',
	},{
		icon: 'iconboda',
		name: '拨打设备'
	},{
		icon: 'iconjianyixiaxian',
		name: '预警设置',
		url: '/pages/alarm/set',
	}
]
var wv;
export default {
	data() {
		return {
			ifMap: true,
			isOnLine: 0,
			defaultAvatar,
			status: 'loading',
			infoList,
			deviceStatus: ['未激活', '已激活', '过期', '黑名单', '在线', '离线'],
			showLeft: false,
			scrollHeight: 400,
			deviceLoading: false,
			deviceList: [],
			healthyList,
			optionList,
			radiaList,
			cancelText: '',
			dialogTitle: '',
			dialogVisible: false,
			dialogContent: '',
			bigRadio: '--'
		};
	},
	components: {
		uniNavBar
	},
	computed: {
		...mapState(['deviceImei', 'deviceEmpey', 'userInfo', 'deviceItem']),
		countFontSize() {
			let bigRadio = this.bigRadio
			if (bigRadio) {
				let big = bigRadio.split('.')
				let len = String(big[0]).length + String(big[1]).length
				let colors = ['#06f204', '#f29f04', '#f06f51']
				let colorObj = {}
				if (bigRadio < 0.5) {
					colorObj.color = colors[0]
				} else if (bigRadio < 1) {
					colorObj.color = colors[1]
				} else {
					colorObj.color = colors[2]
				}
				if (len === 4) {
					return { 'font-size' : '46px', 'padding-top': '10px', 'padding-bottom':' 10px', ...colorObj }
				} else if (len === 5) {
					return { 'font-size' : '42px', 'padding-top': '16px', 'padding-bottom':' 12px', ...colorObj }
				} else if (len === 6) {
					return { 'font-size' : '32px', 'padding-top': '20px', 'padding-bottom':' 18px', ...colorObj }
				}
				return colorObj
			}
		},
		countColor() {
			let colorObj = {}
			let bigRadio = this.bigRadio
			let colors = ['#06f204', '#f29f04', '#f06f51']
			if (bigRadio < 0.5) {
				colorObj.backgroundColor = colors[0]
			} else if (bigRadio < 1) {
				colorObj.backgroundColor = colors[1]
			} else {
				colorObj.backgroundColor = colors[2]
			}
			return colorObj
		}
	},
	onLoad() {
		uni.getSystemInfo({
			success: (res) => {
				let windowHeight = res.windowHeight
				let titleHeight = uni.upx2px(120)
				this.statusBarHeight = res.statusBarHeight
				this.scrollHeight = windowHeight - titleHeight - res.statusBarHeight
			}
		})
	},
	onShow() {
		if (this.deviceEmpey) {
			this.dialogTitle = '未添加设备'
			this.dialogContent = '用户未添加设备，无法查看相应的设备信息，请添加设备后进行查看。'
			this.dialogVisible = true
		} else {
			if (this.deviceImei) {
				this.loadData()
				this.timer = setInterval(() => {
					this.loadData()
				}, 10000)
			}
			let bool = uni.getStorageSync('isSwitchDevice')
			if (bool) {
				uni.removeStorageSync('isSwitchDevice')
			}
		}
	},
	methods: {
		...mapMutations(['selectDevice']),
		confirmButton() {
			this.dialogVisible = false
			if (this.dialogTitle === '未添加设备') {
				uni.navigateTo({
					url: '/pages/device/add'
				})
			}
		},
		scrolltolower(e) {
			page += 1
			this.getDeviceList()
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
				let num = result.Data[item.key]
				num = Math.floor(num * 100)
				item.num = num / 100
			})
			let Radio = Math.floor(result.Data.Radio * 100 ) / 100
			this.bigRadio = String( Radio || '')
			this.isOnLine = result.Data.Status
			this.infoList.forEach((item, index) => {
				item.value = String(result.Data[item.key])
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
					this.dialogTitle = ''
					this.dialogContent = '用户未添加手机号码，暂时无法拨打，请添加手机号码后再进行拨打'
					this.dialogVisible = true
				}
			}
		}
	},
	// app端拦截返回事件 ，仅app端生效
	onHide() {
		console.log('隐藏了')
		clearInterval(this.timer)
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
	
	page {
		background: #f5f5f5;
	}
	
	.container {
		background: #f5f5f5;
	}
	
	.block {
		display: block;
	}
	
	.text {
		color: #999;
		padding-top: 8rpx;
		font-size: 14px;
		text-align: center;
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
			padding-bottom: 6px;
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
	
	.device-online {
		padding: 24px 0px;
		// text-align: center;
		background: #fff;
		display: flex;
	}
	
	.device-status {
		height: 32px;
		width: 70%;
		text-align: center;
		padding: 0 6px;
		opacity: 0.8;
		margin: 0 auto;
		margin-top: 12px;
		line-height: 32px;
		border-radius: 32px;
		color: $font-color-spec;
		border: 1px solid $font-color-spec;
		.gray {
			color: #aaa;
		}
	}
	
	.countdown {
		display: inline-block;
		width: 140px;
		height: 140px;
		margin: 0 24px;
		text-align: center;
		padding: 12px;
		border: 1px solid $font-color-spec;
		border-radius:50%;
		position: relative;
	}
	
	/*倒计时加上圆圈*/
	.countdown .box{
		width: 110px;
		height: 110px;  
		position: absolute;  
		display: block;
		/*旋转动画*/  
		animation:circleRoate 3s infinite linear;
	}  
	.countdown .dotdot{  
		position: absolute;  
		left:-2px;  
		width: 10px;  
		height: 10px;  
		border-radius: 50%;  
		background:	$font-color-spec;  
	}
	.timeRefSeconds {
		color: $font-color-spec;
		font-size: 16px;
		font-weight: 300;
		line-height: 0px;
	}
	.countdown .seconds{  
		font-size: 56px;
		color: $font-color-spec;
		font-weight: 100;
		padding-top: 6px;
		display: block;
	}  
	@keyframes circleRoate{  
		from{transform: rotate(0deg);}  
		to{transform: rotate(360deg);}  
	}
	
	.info-list {
		flex: 1;
		.info-item { 
			height: 30px;
			margin: 24px 0;
			opacity: 0.8;
			font-size: 12px;
			line-height: 30px;
		}
		// .left-radius {
		// 	color: #fff;
		// 	background-color: $font-color-spec;
		// 	border-top-right-radius: 6px;
		// 	border-bottom-right-radius: 6px;
		// }
		// .right-radius {
		// 	color: #fff;
		// 	background-color: $font-color-spec;
		// 	border-top-left-radius: 6px;
		// 	border-bottom-left-radius: 6px;
		// }
		.left-radius {
			background-color: #fff;
			color: $font-color-spec;
			border: 1px solid;
			padding-left: 12rpx;
			border-left: none;
			border-top-right-radius: 36px;
			border-bottom-right-radius: 36px;
		}
		.right-radius {
			text-align: right;
			border: 1px solid;
			border-right: none;
			padding-right: 12rpx;
			background-color: #fff;
			color: $font-color-spec;
			border-top-left-radius: 36px;
			border-bottom-left-radius: 36px;
		}
	}
</style>
