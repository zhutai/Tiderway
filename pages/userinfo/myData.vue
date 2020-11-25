<template>
	<view class="container">
		<view class="list-cell b-b m-t" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">头像</text>
			<text class="cell-tip">{{ userInfo.PhoneNum }}</text>
		</view>
		<view class="list-cell b-b" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">手机号</text>
			<text class="cell-tip">{{ userInfo.PhoneNum }}</text>
			<uni-icons type="arrowright" size="18" color="#909399" />
		</view>
		<view class="list-cell" hover-class="cell-hover" :hover-stay-time="50" @click="handleChange">
			<text class="cell-tit">昵称</text>
			<text class="cell-tip">{{ userInfo.UserName }}</text>
			<uni-icons type="arrowright" size="18" color="#909399" />
		</view>
		<view class="list-cell b-b m-t" hover-class="cell-hover" :hover-stay-time="50" @click="jumpPws">
			<text class="cell-tit">修改密码</text>
			<uni-icons type="arrowright" size="18" color="#909399" />
		</view>
		<view class="list-cell" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">绑定微信</text>
			<uni-icons type="arrowright" size="18" color="#909399" />
		</view>
		<view class="list-cell log-out-btn" @click="dialogVisible = true">
			<text class="cell-tit">退出登录</text>
		</view>
		<uni-popup id="dialogInput" ref="dialogInput" type="dialog">
			<uni-popup-dialog mode="input" title="修改昵称" :value="inputValue" placeholder="请输入内容" @confirm="dialogInputConfirm"></uni-popup-dialog>
		</uni-popup>
		<xy-dialog
			title="退出登录"
			:show="dialogVisible"
			content="确定要退出辐射健康监测系统吗？"
			@cancelButton="dialogVisible = false"
			@confirmButton="confirmButton">
		</xy-dialog>
	</view>
</template>

<script>
	import permision from "@/utils/permission.js"
	import { getUserInfo, setMyData } from "@/api/user.js"
	import { mapState, mapMutations } from 'vuex';
	const defaultAvatar = require('@/static/image/userAvatar.png')
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
				imageList: [],
				avartImageUrl: '',
				defaultAvatar,
				inputValue: '',
				dialogVisible: false
			};
		},
		computed:{
			...mapState(['userInfo']),
		},
		onLoad() {
			getUserInfo({}).then(res => {
				console.log(res)
			})
		},
		methods:{
			...mapMutations(['login', 'logout']),
			navTo(url){
				uni.navigateTo({ url })
			},
			//switch
			switchChange(e){
				let statusTip = e.detail.value ? '打开': '关闭';
				this.$api.msg(`${statusTip}消息推送`);
			},
			handleChange(value) {
				this.selectCellValue = value
				this.inputValue = this.userInfo.UserName
				this.$refs.dialogInput.open()
			},
			async dialogInputConfirm(done, val) {
				if (val) {
					this.inputValue = val
					done()
					await setUserName({ UserName: this.inputValue  })
					let obj = Object.assign({}, this.userInfo, { UserName: this.inputValue } )
					this.login(obj)
				} else {
					done()
				}
			},
			jumpPws() {
				uni.navigateTo({
					url: '/pages/public/forget'
				})
			},
			confirmButton() {
				this.logout();
				setTimeout(()=>{
					uni.reLaunch({
						url: '/pages/public/login',
						fail(err) {
							console.log(err)
						}
					})
				}, 200)
			}
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
