<template>
	<view class="page-notice">
		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{current: tabCurrentIndex === index}"
			 @click="tabClick(index)">
				{{item.text}}
			</view>
		</view>
		<!-- <swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem, tabIndex) in navList" :key="tabIndex"> -->
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">

					<view v-if="!tabCurrentIndex">
						<view class="notice-item" v-for="item in noticeList">
							<text class="time">{{item.CreatedAt}}</text>
							<view class="content">
								<text class="title">{{ item.Title }}</text>
								<view class="img-wrapper">
									<image class="pic" src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3761064275,227090144&fm=26&gp=0.jpg"></image>
									<view class="cover">活动结束</view>
								</view>
								<text class="introduce">{{ item.Content }}</text>
								<view class="bot b-t">
									<text>查看详情</text>
									<text class="more-icon yticon icon-you"></text>
								</view>
							</view>
						</view>
					</view>

					<view v-else>
						<uni-swipe-action>
							<uni-swipe-action-item :right-options="options" :auto-close="true" :disabled="item.Status !== 1"
							v-for="(item, index) in alarmList" :key="item.IMEI + index"
							@change="change" @click="bindClick($event, index)">
								<view class="content-box">
									<view class="content-title">
										<text class="content-imei">{{ item.IMEI }}</text>
										<text class="content-status" :class="`color${item.Status}`">{{ item.Status === 1 ? '待处理' : item.Status === 2 ? '已处理' : '已清除' }}</text>
									</view>
									<view class="content-title">
										<text class="content-text" v-if="!item.Note">{{ alarmType[item.AlarmType] }}</text>
										<text class="content-text" v-else>{{ item.Note }}</text>
										<text class="content-text color1" v-if="item.AlarmValue">-{{ item.AlarmValue }}</text>
										<text class="content-time">{{ item.AlarmedAt }}</text>
									</view>
								</view>
								
							</uni-swipe-action-item>
						</uni-swipe-action>
						<uni-load-more :status="status" />
					</view>
				</scroll-view>
				
				<uni-popup id="dialogInput" ref="dialogInput" type="dialog">
					<uni-popup-dialog mode="input" title="预警处理" :value="dialogInput" placeholder="备注" @confirm="dialogInputConfirm"></uni-popup-dialog>
				</uni-popup>
			<!-- </swiper-item>

		</swiper> -->
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import { getNoticeList } from '@/api/user.js'
	import { getAlarmList, alarmClear, alarmHandle } from '@/api/alarm.js'
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
				dialogInput: '',
				alarmList: [],
				noticeList: [],
				tabCurrentIndex: 0,
				loading: false,
				status: 'loading',
			}
		},
		async onLoad() {
			uni.showLoading({
				title: '加载中...'
			})
			await this.getNoticeList()
			uni.hideLoading()
			await this.getAlarmList()
		},
		computed: {
			...mapState(['deviceImei', 'userInfo'])
		},
		methods: {
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
				let result = await getAlarmList({page: this.page, limit: 20, Imei: this.deviceImei })
				let alarmList = result.Data
				if (!alarmList.length || alarmList.length < 20) this.status = 'noMore'
				this.alarmList = this.alarmList.concat(alarmList)
				this.loading = false
			},
			//swiper 切换
			changeTab(e) {
				this.tabCurrentIndex = e.target.current;
				this.loadData('tabChange');
			},
			bindClick(e, selectIndex) {
				let index = e.index
				let current = this.alarmList[selectIndex]
				if (index) {
					this.selectIndex = selectIndex
					this.$refs.dialogInput.open()
				} else {
					this.alarmClear(selectIndex, current)
				}
			},
			async dialogInputConfirm(done, val) {
				let current = this.alarmList[this.selectIndex]
				let result = await alarmHandle({ id: current.Id, imei: current.IMEI, note: val })
				this.alarmList.forEach(item => {
					if (item.Id === current.Id) {
						item.Status = 2
					}
				})
				done()
				this.$api.msg(' 处理成功')
				console.log(result)
			},
			async alarmClear(index, item) {
				let result = await alarmClear({ id: item.Id, imei: item.IMEI })
				this.alarmList.splice(index, 1)
				this.$api.msg('清除成功')
			},
			alarmHandle() {
				
			},
			change() {
				
			},
			//顶部tab点击
			tabClick(index) {
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

	.swiper-box {
		height: calc(100% - 40px);
	}

	.list-scroll-content {
		height: calc(100% - 46px);
		/* padding-top: 8px; */
	}

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
		padding: 12rpx 24rpx;
		background-color: #fff;
		border-bottom-color: #f5f5f5;
		border-bottom-width: 1px;
		border-bottom-style: solid;
	}
	
	.content-title{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.content-imei {
		font-size: 16px;
		line-height: 60rpx;
		color: $font-color-dark;
	}
	.content-text {
		font-size: 14px;
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
