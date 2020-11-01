<template>
	<view class="device-list">
		<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">
			<view>
				<uni-swipe-action>
					<uni-swipe-action-item :right-options="options" :auto-close="true"
					v-for="(item, index) in deviceList" :key="item.IMEI + index" @click="bindClick($event, index)">
						<view class="content-box" :class="{'b-b': index !== deviceList.length - 1 }">
							<view class="avatar">
								<text v-if="item.UserName">{{ item.UserName.slice(0,1) }}</text>
								<text v-else>空</text>
							</view>
							<view class="content">
								<text class="block">{{ item.UserName || '暂未绑定' }}</text>
								<text class="block">IMEI: {{ item.IMEI }}</text>
							</view>
							<view class="deviceType">
								<text class="block iconfont icontubiaozhizuomoban-1-05 icon-device"></text>
								<text class="block">{{ item.ModelName }}</text>
							</view>
						</view>
					</uni-swipe-action-item>
				</uni-swipe-action>
			</view>
			<uni-load-more :status="status" />
		</scroll-view>
		<view class="button-list">
			<button class="mini-btn" type="primary"  @click="addDevece">绑定设备</button>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import { getDeviceList, unBindDevice } from '@/api/device.js'
	const options = [
		{
			text: '解绑',
			style: {
				backgroundColor: '#dd524d'
			}
		}
	]
	export default {
		data() {
			return {
				page: 0,
				options,
				deviceList: [],
				loading: false,
				status: 'loading',
			}
		},
		async onLoad() {
			uni.showLoading({
				title: '加载中...'
			})
			this.getDeviceList()
			uni.hideLoading()
		},
		computed: {
			...mapState(['deviceImei', 'userInfo'])
		},
		methods: {
			async getDeviceList() {
				this.loading = true
				let result = await getDeviceList({page: this.page, limit: 20, imei: this.deviceImei })
				let deviceList = result.Data.DeviceList
				if (!deviceList.length || deviceList.length < 20) this.status = 'noMore'
				this.deviceList = this.deviceList.concat(deviceList)
				this.loading = false
			},
			loadData() {
				if (this.loading || this.status == 'noMore') return;
				this.page += 1
				this.getDeviceList()
			},
			addDevece() {
				uni.navigateTo({
					url: '/pages/device/add'
				})
			},
			async bindClick(e, index) {
				if (!e.index) {
					let current = this.deviceList[index]
					await unBindDevice({ imei: current.IMEI })
					this.deviceList.splice(index, 1)
					this.$api.msg('解绑成功')
				}
			},
		}
	}
</script>

<style lang='scss' scoped>
	page,
	.device-list {
		background: $page-color-base;
		height: 100%;
	}

	.list-scroll-content {
		height: calc(100% - 58px);
	}

	.content-box {
		width: 100%;
		display: flex;
		padding: 24rpx;
		background-color: #fff;
	}
	.avatar {
		height: 88rpx;
		width: 88rpx;
		text-align: center;
		line-height: 88rpx;
		border-radius: 50%;
		background: $font-color-spec;
	}
	
	.content {
		flex: 1;
		padding-left: 20rpx;
	}
	
	.block {
		display: block;
		font-size: 14px;
		line-height: 44rpx;
		color: $font-color-dark;
	}
	
	.icon-device {
		color: $font-color-spec;
		text-align: center;
		font-size: 18px;
	}
	
	.button-list {
		padding: 12rpx 60rpx;
	}
</style>
