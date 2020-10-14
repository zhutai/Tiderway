<template>
	<view class="content">
		<swiper class="swiper" 
		:autoplay="autoplay" 
		:duration="duration">
			<swiper-item>
				<view class="swiper-item">
					<view class="swiper-item-img"><image src="../../static/image/guide/guide_1.png"></image></view>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item">
					<view class="swiper-item-img"><image src="../../static/image/guide/guide_2.png"></image></view>
					<!-- <view class="swiper-item-img"><image src="../../static/guide/icon_02.png" mode="aspectFit"></image></view> -->
				</view>
				<!-- <view class="jump-over" @tap="launchFlag()">{{jumpover}}</view> -->
			</swiper-item>
			<swiper-item>
				<view class="swiper-item">
					<view class="swiper-item-img"><image src="../../static/image/guide/guide_3.png"></image></view>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item">
					<view class="swiper-item-img"><image src="../../static/image/guide/guide_4.png"></image></view>
				</view>
				
				<view class="btn-list">
					<view class="experience blue" @tap="launchFlag('/pages/public/login')">登录</view>
					<view class="experience white" @tap="launchFlag('/pages/public/register')">注册</view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				autoplay: false,
				duration: 500
			}
		},
		methods: {
			launchFlag: function(url){
				/**
				 * 向本地存储中设置launchFlag的值，即启动标识；
				 */
				uni.setStorage({
					key: 'launchFlag',
					data: true,
				});
				uni.reLaunch({
					url: url
				});
				
			}
		}
	}
</script>
<style>
	page,
	.content{
		width: 100%;
		height: 100%;
		background-size: 100% auto ;
		padding: 0;
	}
	.swiper{
		width: 100%;
		height: 100%;
		background: #FFFFFF;
	}
	.swiper-item {
		width: 100%;
		height: 100%;
		text-align: center;
		position: relative;
		display: flex;
		/* justify-content: center; */
		align-items:flex-end;
		flex-direction:column-reverse
	}
	.swiper-item-img{
		height: 100%;
		width: 100%;
		/* height: auto; */
		margin: 0 auto;
	}
	
	.swiper-item-img uni-image {
		width: 100%;
		height: 100%;
	}
	
/* 	.swiper-item-img image{
		width: 80%;
	} */
	.uniapp-img{
		height: 20%;
		background: #FFFFFF;
		display: flex;
		justify-content: center;
		align-items:center;
		overflow: hidden;
	}
	.uniapp-img image{
		/* width: 40%; */
		/* height: 20%; */
		width: 100%;
		height: 100%;
	}
	
	.jump-over,.experience{
		width: 120px;
		height: 60upx;
		line-height: 60upx;
		padding: 0 40upx;
		border-radius: 30upx;
		font-size: 32upx;
		color: #454343;
		text-align: center;
		border: 1px solid #454343;
		z-index: 999;
	}
	
	.btn-list {
		padding: 32rpx;
		position: absolute;
		bottom: 80rpx;
		width: 100%;
		display: flex;
		justify-content: space-around;
	}
	.blue {
		color: #fff;
		font-size: 16px;
		border: 0;
		background-color: #4399fc;
	}
	.white {
		color: #4399fc;
		font-size: 16px;
		background-color: #fff;
		border: 0;
	}
	
</style>
