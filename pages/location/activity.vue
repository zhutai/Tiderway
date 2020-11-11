<template>
	
	<view class="activity-page">
		<uni-nav-bar class="nav-bar" :statusBar="true" left-icon="arrowleft" @clickLeft="back">
			<view class="input-view">
				<picker mode="date" :value="dateTime" :start="startDate" :end="endDate" @change="bindDateChange">
					<view class="uni-input">
						<!-- <uni-icons class="input-uni-icon" type="compose" size="22" color="#666666" /> -->
						<text class="iconfont iconrili"></text>
						<text>{{dateTime}}</text>
					</view>
				</picker>
			</view>
		</uni-nav-bar>
		<view class="map" v-if="token">
			<web-view :src="webViewStr">

			</web-view>
		</view>
	</view>

</template>
<script>
	import { getDeviceToken } from '@/api/device.js'
	import { mapState, mapMutations } from 'vuex'
	var wv;
	function getDate(str) {
		let date = ''
		if (str) {
			date = new Date(str);	
		} else {
			date = new Date();	
		}
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
	
		month = month > 9 ? month : '0' + month;;
		day = day > 9 ? day : '0' + day;
	
		return `${year}-${month}-${day}`;
	}
	export default {
		data() {
			return {
				token: '',
				webViewStr: '',
				dateTime: '',
				startDate: getDate('2000-01-01'),
				endDate: getDate(),
				h5Url: 'http://web.tiderway.com/H5Location/H5History'
			}
		},
		computed: {
			...mapState(['deviceImei', 'userInfo', 'deviceItem'])
		},
		async onLoad() {
			uni.showLoading({
				title: '加载中...'
			})
			let result = await getDeviceToken()
			this.token = result.Data
			let time = new Date().getTime()
			let startDate = getDate()
			let endDate = getDate(time + (24*60*60*1000))
			this.dateTime = startDate
			this.webViewStr = `${this.h5Url}?token=${this.token}&start=${startDate}&end=${endDate}`
			uni.hideLoading()
		},
		onReady() {
			uni.getSystemInfo({
				success: (res) => {
					let windowHeight = res.windowHeight
					let titleHeight = uni.upx2px(120)
					this.windowHeight = windowHeight
					this.statusBarHeight = res.statusBarHeight
				}
			})
			// #ifdef APP-PLUS
			var currentWebview = this.$scope.$getAppWebview() 
			//此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效，非v3编译模式使用this.$mp.page.$getAppWebview()
			setTimeout(() => {
				wv = currentWebview.children()[0]
				wv.setStyle({ top: 45 + this.statusBarHeight, height: this.windowHeight - 44 - this.statusBarHeight })
			}, 400); //如果是页面初始化调用时，需要延时一下
			// #endif
		},
		methods: {
			back(){
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			handleDate() {
				
			},
			bindDateChange(e) {
				this.dateTime = e.detail.value
				let time = new Date(this.dateTime).getTime()
				let startDate = this.dateTime
				let endDate = getDate(time + (24*60*60*1000))
				this.webViewStr = ''
				setTimeout(() => {
					this.webViewStr = `${this.h5Url}?token=${this.token}&start=${startDate}&end=${endDate}`
				}, 200)
			}
		}
	}
</script>
<style>

.activity-page {
	height: 100%;
}

/deep/ .uni-navbar__header-container {
	align-items: center;
	justify-content: center;
}

.uni-input {
	padding: 0;
}

.map {
	width: 100vw;
	height: 1246rpx;
	position: relative;
}

</style>
