<template>
	<view class="page-notice">
		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{current: tabCurrentIndex === index}"
			 @click="tabClick(index)">
				{{item.text}}
			</view>
		</view>
		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem, tabIndex) in navList" :key="tabIndex">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">

					<view v-if="!tabIndex">
						<view class="notice-item" v-for="item in noticeList">
							<text class="time">{{item.CreatedAt}}</text>
							<view class="content">
								<view class="bot b-t" style="border-bottom: 1px solid #D8D8D8;">
									<text>{{item.Title}}</text>
								</view>
								<text class="title">{{item.Content}}</text>
							</view>
						</view>
					</view>

					<view v-else>
						<uni-swipe-action>
							<view class="content-box">
								<text class="content-text">使使插槽</text>
							</view>
							<template v-slot:right>
								<view class="slot-button"><text class="slot-button-text">删除</text></view>
							</template>
						</uni-swipe-action>
					</view>
				</scroll-view>
			</swiper-item>

		</swiper>
	</view>
</template>

<script>
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
	export default {
		data() {
			return {
				noticeList: [],
				navList,
				alarmList: [],
				tabCurrentIndex: 0
			}
		},
		async created() {
			let nResult = await this.$http.post("v1.0/notice/list", {})
			let aResult = await this.$http.post("v1.0/alarm/list", {page:0,limit:20})
			this.noticeList = nResult.Data
			this.alarmList = aResult.Data
		},
		methods: {
			loadData() {

			},
			//swiper 切换
			changeTab(e) {
				this.tabCurrentIndex = e.target.current;
				this.loadData('tabChange');
			},
			//顶部tab点击
			tabClick(index) {
				this.tabCurrentIndex = index;
			},
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
		height: 100%;
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

	.navbar {
		display: flex;
		height: 40px;
		padding: 0 5px;
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
