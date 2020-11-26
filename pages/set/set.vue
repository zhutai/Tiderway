<template>
	<view class="container">
		<!-- <view class="list-cell b-b m-t" @click="navTo('个人资料')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">个人信息</text>
			<uni-icons type="arrowright" size="20" color="#909399" />
		</view> -->
		<view class="list-cell m-t">
			<text class="cell-tit">消息推送</text>
			<switch checked color="#4399fc" @change="switchChange" />
		</view>
		<view class="list-cell m-t" @click="actionSheetTap" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">预警显示</text>
			<text class="cell-tip">{{ itemList[selectIndex] }}</text>
			<uni-icons type="arrowright" size="20" color="#909399" />
		</view>
		<view class="list-cell m-t b-b" @click="navTo('清除缓存')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">清除缓存</text>
			<uni-icons type="arrowright" size="20" color="#909399" />
		</view>
		
		<view class="list-cell">
			<text class="cell-tit">检查更新</text>
			<text class="cell-tip">当前版本 1.0.0</text>
			<uni-icons type="arrowright" size="20" color="#909399" />
		</view>
		<view class="list-cell log-out-btn" @click="dialogVisible = true">
			<text class="cell-tit">退出登录</text>
		</view>
		
		<xy-dialog
			title="退出登录"
			:show="dialogVisible"
			content="确定要退出登录么？"
			@cancelButton="dialogVisible = false"
			@confirmButton="confirmButton">
		</xy-dialog>
	</view>
</template>

<script>
	import { mapMutations } from 'vuex';
	export default {
		data() {
			return {
				dialogVisible: false,
				selectIndex: 0,
				itemList: ['全部', '辐射预警', '健康预警', '设备预警', 'SOS预警'],
			};
		},
		created() {
			let selectIndex = uni.getStorageSync('alarmTypeVisible')
			this.selectIndex = selectIndex || 0
		},
		methods:{
			...mapMutations(['logout']),

			navTo(url){
				this.$api.msg(`跳转到${url}`);
			},
			confirmButton() {
				this.logout();
				setTimeout(()=>{
					uni.reLaunch({
						url: '/pages/public/login',
					})
				}, 200)
			},
			actionSheetTap() {
				uni.showActionSheet({
					title: '预警显示',
					itemList: this.itemList,
					success: (e) => {
						let index = e.tapIndex
						this.selectIndex = index
						uni.setStorageSync('alarmTypeVisible', this.selectIndex)
					}
				})
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
	.list-cell{
		display:flex;
		align-items:baseline;
		padding: 20upx $page-row-spacing;
		line-height:60upx;
		position:relative;
		background: #fff;
		justify-content: center;
		&.log-out-btn{
			margin-top: 40upx;
			.cell-tit{
				color: $uni-color-primary;
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
