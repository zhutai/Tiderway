<template>
	<view class="findPwd">
		
		<view class="content">
			<!-- 主体 -->
			<view class="main">
				<view class="tips">如果忘记了密码，在这里重置新密码。</view>
				<wInput
					v-model="phoneData"
					type="text"
					maxlength="11"
					placeholder="请输入手机号码"
				></wInput>
				<wInput
					v-model="passData"
					type="password"
					maxlength="11"
					placeholder="请输入新密码"
					isShowPass
				></wInput>
				
				<wInput
					v-model="verCode"
					type="number"
					maxlength="4"
					placeholder="验证码"
					isShowCode
					ref="runCode"
					@setCode="getVerCode()"
				></wInput>
			</view>
			
			<wButton 
				class="wbutton"
				text="重置密码"
				:rotate="isRotate" 
				@click.native="startRePass()"
			></wButton>

		</view>
	</view>
</template>

<script>
	var _this;
	import { mapState, mapMutations } from 'vuex';
	import { findPwd, sendCode } from '@/api/user'
	import md5 from '@/utils/md5/md5.min.js'
	import wInput from '@/components/watch-login/watch-input.vue' //input
	import wButton from '@/components/watch-login/watch-button.vue' //button
	export default {
		data() {
			return {
				phoneData: "", //电话
				passData: "", //密码
				verCode:"", //验证码
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
			getVerCode(){
				//获取验证码
				if (_this.phoneData.length != 11) {
					 uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '手机号不正确'
					});
					return false;
				}
				this.$refs.runCode.$emit('runCode'); //触发倒计时（一般用于请求成功验证码后调用）
				
				let params = {
					PhoneNumber: this.phoneData,
					SMSType: 2 // 1 手机注册   2 找回密码
				}
				sendCode(params).then(res => {
					this.$api.msg('验证码发送成功')
				}, err => {
					this.$api.msg('验证码发送失败，请重试')
				})
			},
			startRePass() {
				//重置密码
				if(this.isRotate){
					//判断是否加载中，避免重复点击请求
					return false;
				}
				if (this.phoneData.length != 11) {
				  uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '手机号不正确'
					});
					return false;
				}
				if (this.passData.length < 6) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '密码不正确'
					});
					return false;
				}
				if (this.verCode.length != 4) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '验证码不正确'
					});
					return false;
				}
				
				this.setPassWord()
			},
			setPassWord() {
				let params = {
					Phone: this.phoneData,
					Code: this.verCode,
					// Pwd: md5(this.passData)
					Pwd: this.passData
				}
				this.isRotate = true
				findPwd(params).then(res => {
					this.isRotate = false
					this.logout()
					this.$api.msg('密码修改成功')
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

<style lang="scss" scoped>
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

