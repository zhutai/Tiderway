<template>
	<view class="page-number-edit">
		<view class="content">
			<view class="uni-form-item">
				<view class="uni-form-item__title"><text>姓名</text></view>
				<view class="uni-input-wrapper">
					<input class="uni-input" type="text" placeholder="请输入姓名" />
				</view>
			</view>
			<view class="uni-form-item">
				<view class="uni-form-item__title"><text>手机号码</text></view>
				<view class="uni-input-wrapper">
					<input class="uni-input" type="number" placeholder="请输入手机号码" />
				</view>
			</view>
			<view class="books">
				<uni-icons class="add-icon" type="person" size="16" color="#4499fc" />
				<text>从通讯录中快速选择</text>
			</view>
			<view class="uni-form-item">
				<view class="uni-form-item__title" style="width: 150px;"><text>设为SOS号码</text></view>
				<view class="uni-input-wrapper" style="justify-content: flex-end;">
					<switch checked color="#4399fc" @change="switchChange" />
				</view>
			</view>
			<view class="button-padding">
				<button class="mini-btn" type="primary"  @click="edit">保存</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	export default {
		data() {
			return {
			};
		},
		components: {
		},
		computed: {
			...mapState['deviceImei']
		},
		mounted() {
		},
		methods: {
			...mapMutations(['login', 'setDeviceImei']),
			edit() {
				
			},
			switchChange() {
				
			}
		}
	}
</script>

<style scoped>
	.books {
		padding: 16rpx 24rpx;
		text-align: right;
		color: #4399fc;
	}
	.uni-form-item {
		/* width: 200rpx; */
		margin: 20rpx 0;
		padding: 0 0 0 32rpx;
		background-color: #fff;
	}
	.uni-form-item__title {
		width: 200rpx;
		font-size: 16px;
		line-height: 24px;
		align-self: center;
	}
	
	.uni-input-wrapper {
	    /* #ifndef APP-NVUE */
	    display: flex;
	    /* #endif */
	    padding: 24rpx;
	    flex-direction: row;
	    flex-wrap: nowrap;
	    background-color: #FFFFFF;
	}
	
	.uni-input {
		height: 60rpx;
		line-height: 60rpx;
		font-size: 16px;
		padding: 0px;
		flex: 1;
		background-color: #FFFFFF;
	}
	
	.uni-icon {
		font-family: uniicons;
		font-size: 24px;
		font-weight: normal;
		font-style: normal;
		width: 24px;
		height: 24px;
		line-height: 24px;
		color: #999999;
	}
	.button-padding {
		padding: 40rpx 100rpx;
	}
</style>
