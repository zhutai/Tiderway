<template>
	<view class="container">
		<view class="list-cell b-b m-t" @click="navTo('头像')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">头像</text>
			<image class="slot-image" :src="userInfo.Avatar" mode="widthFix" style="width: 40px;border-radius: 50%;"></image>
			<!-- <text class="cell-more yticon icon-you"></text> -->
		</view>
		<view class="list-cell b-b" @click="navTo('手机号')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">手机号</text>
			<text class="cell-tip">{{ userInfo.PhoneNum }}</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell" @click="navTo('昵称')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">昵称</text>
			<text class="cell-tip">{{ userInfo.LoginName }}</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		
	<!-- 	<view class="list-cell m-t">
			<text class="cell-tit">消息推送</text>
			<switch checked color="#4399fc" @change="switchChange" />
		</view> -->
		
	<!-- 	<view class="list-cell m-t" @click="navTo('/pages/public/forget')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">修改密码</text>
			<text class="cell-more yticon icon-you"></text>
		</view> -->
	
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	export default {
		data() {
			return {
				
			};
		},
		computed:{
			...mapState(['userInfo']),
		},
		methods:{
			...mapMutations(['logout']),

			navTo(url){
				uni.navigateTo({
					url
				})
				// this.$api.msg(`跳转到${url}`);
			},
			//退出登录
			toLogout(){
				uni.showModal({
				    content: '确定要退出登录么',
				    success: (e)=>{
				    	if(e.confirm){
				    		this.logout();
				    		setTimeout(()=>{
									uni.navigateTo({
										url: '/pages/public/login',
										fail(err) {
											console.log(err)
										}
									})
				    		}, 200)
				    	}
				    }
				});
			},
			//switch
			switchChange(e){
				let statusTip = e.detail.value ? '打开': '关闭';
				this.$api.msg(`${statusTip}消息推送`);
			},

		}
	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
	}
	
	.slot-image {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		margin-right: 10px;
		width: 80rpx;
		height: 80rpx;
	}
	
	.list-cell{
		display:flex;
		align-items:center;
		padding: 20upx $page-row-spacing;
		line-height:60upx;
		position:relative;
		background: #fff;
		justify-content: center;
		&.log-out-btn{
			margin-top: 40upx;
			.cell-tit{
				color: $font-color-spec;
				text-align: center;
				margin-right: 0;
			}
		}
		&.cell-hover{
			background:#fafafa;
		}
		&.b-b:after{
			left: 30upx;
		}
		&.m-t{
			margin-top: 16upx; 
		}
		.cell-more{
			align-self: baseline;
			font-size:$font-lg;
			color:$font-color-light;
			margin-left:10upx;
		}
		.cell-tit{
			flex: 1;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-right:10upx;
		}
		.cell-tip{
			font-size: $font-base;
			color: $font-color-light;
		}
		switch{
			transform: translateX(16upx) scale(.84);
		}
	}
</style>
