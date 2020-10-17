<template>
	<view class="forget">
		<view class="content">
			<!-- 主体 -->
			<view class="main">
				<wInput
					v-model="oldPassData"
					type="password"
					maxlength="11"
					placeholder="请输入旧密码"
					isShowPass
				></wInput>
				
				<wInput
					v-model="newPassData"
					type="password"
					maxlength="11"
					placeholder="请输入新密码"
					isShowPass
				></wInput>
			
			<wButton 
				class="wbutton"
				text="修改密码"
				:rotate="isRotate" 
				@click.native="startRePass()"
			></wButton>
			</view>
		</view>
	</view>
</template>

<script>
	var _this;
	import { mapState, mapMutations } from 'vuex';
	import { editPwd, sendCode } from '@/api/user'
	import md5 from '@/utils/md5/md5.min.js'
	import wInput from '@/components/watch-login/watch-input.vue' //input
	import wButton from '@/components/watch-login/watch-button.vue' //button
	export default {
		data() {
			return {
				oldPassData: "", //旧密码
				newPassData: "", //新密码
				isRotate: false, //是否加载旋转
			}
		},
		components:{
			wInput,
			wButton
		},
		mounted() {
			_this= this;
		},
		methods: {
			...mapMutations(['logout']),
			startRePass() {
				//重置密码
				if(this.isRotate){
					//判断是否加载中，避免重复点击请求
					return false;
				}
				if (this.oldPassData.length < 6) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '旧密码格式不正确'
					});
					return false;
				}
				if (this.newPassData.length < 6) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '新密码格式不正确'
					});
					return false;
				}
				if (this.newPassData === this.oldPassData) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '新旧密码不能相同'
					});
					return false;
				}
				
				this.setPassWord()
			},
			setPassWord() {
				let params = {
					newPwd: md5(this.newPassData),
					oldPwd: this.oldPassData,
				}
				this.isRotate = true
				editPwd(params).then(res => {
					this.isRotate = false
					this.logout()
					this.$api.mag('密码修改成功')
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/public/login'
						})
					}, 300)
				}, err => {
					this.isRotate = false
				})
			}
		}
	}
</script>

<style scoped>
	@import url("@/common/login.css");
	
	.tips {
		color: #999;
		font-size: 28rpx;
		margin-top: 64rpx;
		margin-left: 48rpx;
	}
	
	.wbutton {
		margin-top: 60rpx;
	}
	
	.content {
		padding-top: 100rpx;
	}
</style>

