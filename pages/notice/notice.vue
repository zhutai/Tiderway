<template>
	<view class="page-notice">
		
		<view class="nav-bar">
			<uni-nav-bar :border="false" :statusBar="true" left-icon="arrowleft" title="我的消息" :right-text="tabCurrentIndex ? '批量' : ''"  @clickLeft="back" @clickRight="clickRight"  />
		</view>
		
		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{current: tabCurrentIndex === index}"
			 @click="tabClick(index)">
				{{item.text}}
			</view>
		</view>
		
		<scroll-view class="list-scroll-content" :style="{ height: scrollHeight + 'px' }" scroll-y @scrolltolower="loadData">
			<view v-if="!tabCurrentIndex">
				<view class="notice-item" v-for="item in noticeList">
					<text class="time">{{item.CreatedAt}}</text>
					<view class="content">
						<text class="title">{{ item.Title }}</text>
						<text class="introduce">{{ item.Content }}</text>
						<view class="bot b-t">
							<text>查看详情</text>
							<text class="more-icon yticon icon-you"></text>
						</view>
					</view>
				</view>
			</view>

			<view v-else>
				<checkbox-group @change="checkboxChange">
					<view class="content-box" v-for="(item, index) in alarmList" :key="item.IMEI + index" @click="alarmHandle(item)">
						<label>
							<view class="content-title">
								<checkbox class="checkbox" v-if="isCheck" :value="item.alarmId" :checked="item.checked" />
								<text class="content-text">{{ alarmType[item.AlarmType] }}</text>
								<text class="content-text color1" v-if="item.AlarmValue">-{{ item.AlarmValue }}</text>
								<text class="content-status" :class="`color${item.Status}`">{{ item.Status === 1 ? '待处理' : item.Status === 2 ? '已处理' : '已清除' }}</text>
							</view>
							
							<view class="content-title">
								<text class="content-imei">{{ item.IMEI }}</text>
								<text class="content-time">{{ item.AlarmedAt }}</text>
							</view>
						</label>
					</view>
				</checkbox-group>
				<uni-load-more :class="isCheck ? 'more-margin' : '' " :status="status" />
			</view>
		</scroll-view>
		
		<view class="fixed-part" v-if="isCheck">
			<label class="all-select">
				<checkbox-group @change="checkClick">
					<checkbox class="checkbox" value="value" :checked="isAllSelect" />全选({{ selectAlarm.length }})
				</checkbox-group>
			</label>
			<view>
				<button class="mini-btn" :disabled="!selectAlarm.length" type="primary" size="mini" @click="alarmHandle(null)">处理</button>
				<button class="mini-btn" :disabled="!selectAlarm.length" type="warn" size="mini" @click="alarmClear">删除</button>
				<button class="mini-btn" type="default" size="mini" @click="cancel">取消</button>
			</view>
		</view>
		
		<uni-popup id="dialogInput" ref="dialogInput" type="dialog">
			<uni-popup-dialog mode="input" title="预警处理" :value="dialogInput" placeholder="备注" @confirm="dialogInputConfirm"></uni-popup-dialog>
		</uni-popup>
				
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import { getNoticeList } from '@/api/user.js'
	import { getAlarmList, alarmClear, alarmHandle, batchHandle, batchClear } from '@/api/alarm.js'
	import alarmType from './alarmType.js'
	
	const navList = [{
			state: 0,
			text: '系统消息',
			loadingType: 'more',
			orderList: []
		},
		{
			state: 1,
			text: '预警列表',
			loadingType: 'more',
			orderList: []
		}
	]
	const options = [
		{
			text: '清除',
			style: {
				backgroundColor: '#007aff'
			}
		},
		{
			text: '处理',
			style: {
				backgroundColor: '#dd524d'
			}
		}
	]
	export default {
		data() {
			return {
				navList,
				options,
				page: 0,
				alarmType,
				isCheck: false,
				dialogInput: '',
				isAllSelect: false,
				selectAlarm: [],
				alarmList: [],
				noticeList: [],
				tabCurrentIndex: 0,
				scrollHeight: 300,
				loading: false,
				status: 'loading',
			}
		},
		async onLoad() {
			uni.showLoading({
				title: '加载中...'
			})
			this.getScrollHeight()
			this.getAlarmTypes()
			await this.getNoticeList()
			uni.hideLoading()
			await this.getAlarmList()
		},
		computed: {
			...mapState(['deviceImei', 'userInfo'])
		},
		methods: {
			getScrollHeight() {
				uni.getSystemInfo({
					success: (res) => {
						let windowHeight = res.windowHeight
						let titleHeight =  90
						this.scrollHeight = windowHeight - titleHeight - res.statusBarHeight
						console.log(this.scrollHeight, windowHeight, titleHeight, res.statusBarHeight)
					}
				})
			},
			getAlarmTypes() {
				let alarmType = {
					0: [],
					1: ["182"],
					2: ["176", "177", "178", "179", "180", "181"],
					3: ["1", "2", "3", "4", "6", "7", "109", "110", "174", "175"],
					4: ["5"],
				}
				let selectIndex = uni.getStorageSync('alarmTypeVisible') || 0
				this.AlarmTypes = alarmType[selectIndex].join(',')
			},
			loadData() {
				if (this.loading || this.status == 'noMore') return;
				this.loading = true
				this.page += 1
				this.getAlarmList()
			},
			
			async getNoticeList() {
				let result = await getNoticeList()
				this.noticeList = result.Data
			},
			async getAlarmList() {
				let result = await getAlarmList({page: this.page, limit: 20, Imei: this.deviceImei, AlarmTypes: this.AlarmTypes })
				let alarmList = result.Data
				let isAllSelect = this.isAllSelect
				alarmList.forEach(item => {
					item.checked = isAllSelect
					item.alarmId = item.Id + ''
				})
				if (!alarmList.length || alarmList.length < 20) this.status = 'noMore'
				this.alarmList = this.alarmList.concat(alarmList)
				let selectAlarm = []
				this.alarmList.forEach(item => {
					if (item.checked) {
						selectAlarm.push(item.alarmId)
					}
				})
				if (selectAlarm.length) {
					this.selectAlarm = selectAlarm
				}
				this.loading = false
			},
			//swiper 切换
			changeTab(e) {
				this.tabCurrentIndex = e.target.current;
				this.loadData('tabChange');
			},
			async dialogInputConfirm(done, val) {
				let alarmIds = []
				if (this.isCheck) {
					alarmIds = this.selectAlarm
				} else {
					let alarmId = String(this.selectAlarmId)
					alarmIds = [ alarmId ]
				}
				let params = this.getParmas(alarmIds)
				params.note = val
				let result = await batchHandle(params)
				this.alarmList.forEach(item => {
					if (alarmIds.includes(item.alarmId)) {
						item.Status = 2
					}
				})
				done()
				this.cancel()
				this.$api.msg('处理成功')
			},
			getParmas(alarmIds) {
				let ids = []
				this.alarmList.forEach(item => {
					if (alarmIds.includes(item.alarmId)) {
						ids.push(item.Id)
					}
				})
				return { ids: ids, imei: this.deviceImei }
			},
			async alarmClear(index, item) {
				let selectAlarms = this.selectAlarm
				if (selectAlarms.length) {
					let params = this.getParmas(selectAlarms)
					let result = await batchClear(params)
					let alarmList = []
					this.alarmList.forEach(item => {
						if (!selectAlarms.includes(item.alarmId)) {
							alarmList.push(item)
						}
					})
					this.alarmList = alarmList
					this.cancel()
					this.$api.msg('清除成功')
				}
			},
			alarmHandle(item) {
				if (!this.isCheck) {
					if (item.Status !== 1) {
						this.$api.msg('该告警已处理')
						return false
					}
					this.selectAlarmId = item.Id
					this.$refs.dialogInput.open()
				} else {
					if (item === null) {
						this.$refs.dialogInput.open()
					}
				}
			},
			checkboxChange(e) {
				let values = e.detail.value
				this.selectAlarm = values
			},
			checkClick(e) {
				let values = e.detail.value
				let isAllSelect = !!values.length
				this.isAllSelect = isAllSelect
				this.alarmList.forEach(item => {
					item.checked = this.isAllSelect
				})
				if (isAllSelect) {
					this.selectAlarm = this.alarmList.map(item => item.alarmId)
				} else {
					this.selectAlarm = []
				}
			},
			back() {
				uni.navigateBack({})
			},
			clickRight() {
				this.isCheck = true
				this.alarmList.forEach(item => {
					item.checked = false
				})
			},
			cancel() {
				this.isCheck = false
				this.alarmList.forEach(item =>{
					item.checked = false
				})
				this.isAllSelect = false
				this.selectAlarm = []
			},
			//顶部tab点击
			tabClick(index) {
				this.isCheck = false
				this.tabCurrentIndex = index;
			}
		}
	}
</script>

<style lang='scss'>
	page,
	.page-notice {
		background: $page-color-base;
		height: 100%;
	}

	/* .list-scroll-content {
		height: calc(100% - 92px);
	} */

	.notice-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.time {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80upx;
		padding-top: 10upx;
		font-size: 26upx;
		color: #7d7d7d;
	}

	.content {
		width: 710upx;
		padding: 0 24upx;
		background-color: #fff;
		border-radius: 4upx;
	}

	.title {
		display: flex;
		align-items: center;
		height: 90upx;
		font-size: 32upx;
		color: #303133;
	}

	.img-wrapper {
		width: 100%;
		height: 260upx;
		position: relative;
	}

	.pic {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 6upx;
	}

	.cover {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .5);
		font-size: 36upx;
		color: #fff;
	}

	.introduce {
		display: inline-block;
		padding: 16upx 0;
		font-size: 28upx;
		color: #606266;
		line-height: 38upx;
	}

	.bot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 80upx;
		font-size: 24upx;
		color: #707070;
		position: relative;
	}

	.more-icon {
		font-size: 32upx;
	}
	
	.content-box {
		flex: 1;
		font-size: 0;
		height: 132rpx;
		padding: 12rpx 24rpx;
		background-color: #fff;
		border-bottom-color: #f5f5f5;
		border-bottom-width: 1px;
		border-bottom-style: solid;
	}
	
	.content-title{
		display: flex;
		line-height: 48rpx;
		align-items: center;
		/* justify-content: space-between; */
	}
	
	.content-status {
		flex: 1;
		text-align: right;
	}
	.checkbox {
		transform: scale(0.7);
	}
	.content-imei {
		font-size: 14px;
		line-height: 60rpx;
		color: $font-color-dark;
	}
	.content-text {
		font-size: 16px;
		color: $font-color-base;
	}
	.content-time {
		flex: 1;
		text-align: right;
		font-size: 14px;
		color: $font-color-light;
	}
	.color1 {
		color: $uni-color-error;
	}
	.color2 {
		color: $uni-color-success;
	}
	.color3 {
		color: $font-color-light;
	}
	
	.more-margin {
		/* height: 200rpx;*/
		padding-top: 60rpx;
		padding-bottom: 150rpx;
	}
	/* .uni-load-more {
		padding-bottom: 20px;
		height: 80px;
	} */
	
	.fixed-part {
		position: fixed;
		height: 88rpx;
		width: 100%;
		left: 0;
		bottom: 0;
		background: #fff;
		padding: 16rpx 32rpx;
		display: flex;
		align-items: center;
		border-top: 1rpx solid #eee;
		justify-content: space-between;
	}
	
	.mini-btn {
		margin: 0 12rpx;
	}
	
	.navbar {
		display: flex;
		height: 40px;
		padding: 0 6px;
		margin-bottom: 6px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0, 0, 0, .06);
		position: relative;
		z-index: 10;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: $font-color-dark;
			position: relative;

			&.current {
				color: $font-color-spec;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid $font-color-spec;
				}
			}
		}
	}
</style>
