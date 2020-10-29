<template>
	<view class="container">
		<view class="list-cell b-b m-t" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">头像</text>
			<image class="slot-image" :src="userInfo.Avatar" ></image>
		</view>
		<view class="list-cell b-b" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">手机号</text>
			<text class="cell-tip">{{ userInfo.PhoneNum }}</text>
			<uni-icons type="arrowright" size="18" color="#909399" />
		</view>
		<view class="list-cell" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">昵称</text>
			<text class="cell-tip">{{ userInfo.LoginName }}</text>
			<uni-icons type="arrowright" size="18" color="#909399" />
		</view>
	</view>
</template>

<script>
	import permision from "@/utils/permission.js"
	import { mapState, mapMutations } from 'vuex';
	var sourceType = [
		['camera'],
		['album'],
		['camera', 'album']
	]
	var sizeType = [
		['compressed'],
		['original'],
		['compressed', 'original']
	]
	export default {
		data() {
			return {
				imageList: []
			};
		},
		computed:{
			...mapState(['userInfo']),
		},
		methods:{
			...mapMutations(['logout']),
			navTo(url){
				uni.navigateTo({ url })
			},
			//switch
			switchChange(e){
				let statusTip = e.detail.value ? '打开': '关闭';
				this.$api.msg(`${statusTip}消息推送`);
			},
			// 添加图片
			chooseImage: async function() {
				uni.chooseImage({
					sourceType: sourceType[2],
					sizeType: sizeType[2],
					count: this.imageList.length  ? 0 : 1,
					success: (res) => {
						console.log(res)
						this.imageList = this.imageList.concat(res.tempFilePaths);
					},
					fail: (err) => {
						// #ifdef APP-PLUS
						if (err['code'] && err.code !== 0) {
							this.checkPermission(err.code);
						}
						// #endif
					}
				})
			},
			async checkPermission(code) {
				let type = code ? code - 1 : 2;
				let status = permision.isIOS ? await permision.requestIOS(sourceType[type][0]) :
				await permision.requestAndroid(type === 0 ? 'android.permission.CAMERA' : 'android.permission.READ_EXTERNAL_STORAGE');
			
				if (status === null || status === 1) {
					status = 1;
				} else {
					uni.showModal({
						content: "没有开启权限",
						confirmText: "设置",
						success: function(res) {
							if (res.confirm) {
								permision.gotoAppSetting();
							}
						}
					})
				}
				return status;
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
		}
	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
	}
	
	.slot-image {
		display: block;
		margin-right: 10px;
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
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
