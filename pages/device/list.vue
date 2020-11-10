<template>
	<view class="container">
		<!-- <uni-nav-bar fixed :statusBar="true" left-icon="arrowleft" @clickLeft="back">
			<view class="input-view">
				<uni-icons class="input-uni-icon" type="search" size="20" color="#999" />
				<input confirm-type="search" class="nav-bar-input" type="text" placeholder="输入设备编号进行搜索" @confirm="confirm">
			</view>
		</uni-nav-bar> -->
		<uni-search-bar radius="100" @confirm="search" placeholder="输入设备编号进行搜索" bgColor="#f8f8f8" @input="input" @cancel="cancel" />
		<view class="device-box">
			<scroll-view :style="{height: `${scrollHeight}px`}" scroll-y="true" @scrolltolower="scrolltolower">
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

	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { getHealthInfo, getDeviceList } from '@/api/device.js'
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
const defaultAvatar = require('@/static/image/userAvatar.png')
let page = 0

export default {
	data() {
		return {
			status: 'loading',
			searchValue: '',
			deviceStatus: ['未激活', '已激活', '过期', '黑名单', '在线', '离线'],
			showLeft: false,
			scrollHeight: 400,
			deviceLoading: false,
			deviceList: []
		};
	},
	components: {
		uniNavBar
	},
	computed: {
		...mapState(['deviceImei', 'deviceEmpey', 'userInfo', 'deviceItem'])
	},
	onLoad() {
		page = 0
		uni.getSystemInfo({
			success: (res) => {
				let windowHeight = res.windowHeight
				console.log(res)
				this.scrollHeight = windowHeight - 52
			}
		})
		this.getDeviceList()
	},
	methods: {
		...mapMutations(['selectDevice']),
		scrolltolower(e) {
			page += 1
			this.getDeviceList()
		},
		swtichDevice(item) {
			if (item.IMEI) {
				if (this.deviceImei && item.IMEI) {
					if (this.deviceImei !== item.IMEI) {
						this.$api.msg('设备切换成功')
						uni.setStorage({ key: 'isSwitchDevice', data: true })
					}
				}
				this.selectDevice({ deviceItem: item, imeiLength: 1 })
			}
		},
		back() {
			uni.navigateBack()
		},
		search(e) {
			this.searchValue = e.value
			this.clearSearch()
		},
		input(e) {
			this.searchValue = e.value
		},
		cancel() {
			this.searchValue = ''
			this.clearSearch()
		},
		clearSearch() {
			page = 0
			this.deviceList = []
			this.status = 'loading'
			this.deviceLoading = false
			this.getDeviceList()
		},
		getDeviceList() {
			if (this.status != 'loading' || this.deviceLoading) return
			this.status = 'loading'
			this.deviceLoading = true
			let size = 20
			getDeviceList({Page: page, Limit: size, Imei: this.searchValue }).then(res => {
				let deviceList = res.Data.DeviceList || []
				if (!deviceList.length || deviceList.length < size) this.status = 'noMore'
				this.deviceList = this.deviceList.concat(deviceList)
				this.deviceLoading = false
			})
		}
	}
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
	.input-view {
		/* #ifndef APP-PLUS-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex: 1;
		background-color: #f8f8f8;
		height: 30px;
		border-radius: 32rpx;
		padding: 0 24rpx;
		flex-wrap: nowrap;
		align-items: center;
		margin: 16rpx 24rpx;
		line-height: 48px;
	}
	
	.nav-bar-input {
		height: 30px;
		line-height: 30px;
		padding: 0 6px;
		font-size: 14px;
		color: #666;
		background-color: #f8f8f8;
	}
	
	.input-uni-icon {
		line-height: 24px;
	}
</style>
