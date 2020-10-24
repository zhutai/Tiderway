<template>
	<view class="page-number-list">
		<scroll-view style="height: 100vh;" scroll-y="true">
			<view class="content">
				<view class="number-item" v-for="(item, index) in numberList" :key="index">
					<view class="top flex">
						<text class="title">{{ item.title }}</text>
						<text class="sos" v-if="item.isSos">SOS</text>
					</view>
					<view class="bottom flex">
						<text class="phone">{{ item.phone }}</text>
						<button class="mini-btn" type="primary" size="mini" @click="JumpEdit">编辑</button>
						<button class="mini-btn" type="default" size="mini" @click="handleDelete">删除</button>
					</view>
				</view>
			</view>
			<view class="flex add-number" v-if="numberList.length < 10">
				<uni-icons class="add-icon" type="plus" size="36" color="#606266" />
				<text class="tips">{{ numberList.length ? `您已添加个${numberList.length}亲情号` : '`您暂未添加亲情号码' }}{{ `,还可以添加${10 - numberList.length}个亲情号码` }}</text>
			</view>
		</scroll-view>
		
	</view>
</template>

<script>
	import wInput from '@/components/watch-login/watch-input.vue' //input
	import wButton from '@/components/watch-login/watch-button.vue' //button
	import { bindDevice, getDeviceList } from '@/api/device.js'
	import { mapState, mapMutations } from 'vuex';
	export default {
		data() {
			return {
				numberList: []
			};
		},
		components: {
			// wInput,
			// wButton,
		},
		computed: {
			...mapState['deviceImei']
		},
		onLoad() {
			let numberList = []
			for (let i = 0; i < 10; i++) {
				let obj = {
					title: '亲情号码' + i,
					phone: 13678965689,
					isSos: !!(i % 2)
				}
				numberList.push(obj)
			}
			this.numberList = numberList
		},
		mounted() {
		},
		methods: {
			JumpEdit() {
				uni.navigateTo({
					url: '/pages/number/edit'
				})
			},
			handleDelete() {
				uni.showModal({
					content: "是否确认删除该号码",
					confirmText: "确定",
					cancelText: "取消",
					success: function(res) {
						if (res.confirm) {
							// uni.showToast("删除成功")
							// uni.navigateTo({
							// 	url: '/pages/device/add'
							// })
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.flex {
		/* #ifndef APP-PLUS */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.page-number-list {
		.content {
			.number-item {
				height: 140rpx;
				background: #fff;
				color: $font-color-dark;
				border-left: 12rpx solid $font-color-spec;
				padding: 12rpx;
				margin-bottom: 12rpx;
				.top {
					
					.title {
						font-size: 14px;
						padding: 12rpx 0;
					}
					.sos {
						padding-right: 12rpx;
						font-weight: bold;
						color: $font-color-spec;
					}
				}
				.bottom {
					.phone {
						flex: 1;
						font-size: 14px;
					}
					.mini-btn {
						border-radius: 32rpx;
						line-height: 48rpx;
						padding: 0 32rpx;
						margin-left: 20rpx;
						&[type=primary] {
							background: $font-color-spec;
						}
						&[type=default] {
							color: $font-color-spec;
							border: 1rpx solid $font-color-spec;
							background: #fff;
						}
					}
				}
			}
		}
		.add-number {
			color: $font-color-base;
			background: #fff;
			flex-direction: column;
			margin-bottom: 12rpx;
			.add-icon {
				padding: 12rpx;
			}
			.tips {
				padding-bottom: 12rpx;
			}
		}
	}
</style>
