<template>
	<view class="register">
	
		<view class="content">
			<!-- 头部logo -->
			<view class="header">
				<image src="/static/image/logo.png"></image>
			</view>
			<!-- 主体 -->
			<view class="main">
				<wInput
					v-model="phoneData"
					type="text"
					maxlength="11"
					placeholder="请输入手机号"
				></wInput>
				<wInput
					v-model="passData"
					type="password"
					maxlength="11"
					placeholder="请输入登录密码"
					isShowPass
				></wInput>
				<wInput
					v-model="verCode"
					type="number"
					:maxlength="codeLength"
					placeholder="请输入验证码"
					isShowCode
					ref="runCode"
					@setCode="getVerCode()"
				></wInput>
					
			</view>
				
			<wButton 
				class="wbutton"
				text="注 册"
				:rotate="isRotate" 
				@click.native="startReg()"
			></wButton>
			
			<!-- 底部信息 -->
			<view class="footer">
				<text
					@tap="isShowAgree" 
					class="iconfont"
					style="color: #4399fc;"
					:class="showAgree?'iconradio_box':'iconround'"></text>
				<text style="margin: 0;" class="text" @tap="isShowAgree">同意</text>
				<!-- 协议地址 -->
				<view class="treaty">
					<navigator url="/pages/treaty/index?type=yhzc" open-type="navigate">《用户注册同意条款》</navigator>
					<navigator url="/pages/treaty/index?type=fysn" open-type="navigate">《法律声明及隐私权政策》</navigator>
					<navigator url="/pages/treaty/index?type=fsjk" open-type="navigate">《辐射健康监测设备许可协议》</navigator>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	var _this;
	import { register, sendCode } from '@/api/user'
	import wInput from '@/components/watch-login/watch-input.vue' //input
	import wButton from '@/components/watch-login/watch-button.vue' //button
	var codeLength = 4
	export default {
		data() {
			return {
				codeLength,
				phoneData:'', // 用户/电话
				passData:'', //密码
				verCode:"", //验证码
				showAgree:true, //协议是否选择
				isRotate: false, //是否加载旋转
			}
		},
		components:{
			wInput,
			wButton,
		},
		mounted() {
			_this= this;
		},
		methods: {
			isShowAgree(){
				//是否选择协议
				_this.showAgree = !_this.showAgree;
			},
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
				// console.log("获取验证码")
				this.$refs.runCode.$emit('runCode'); //触发倒计时（一般用于请求成功验证码后调用
				let params = {
					PhoneNumber: this.phoneData,
					SMSType: 1 // 1 手机注册   2 找回密码
				}
				sendCode(params).then(res => {
					this.$api.msg('验证码发送成功')
				}, err => {
					this.$api.msg('验证码发送失败，请重试')
				})
				// uni.showToast({
				//   icon: 'none',
				// 	position: 'bottom',
				//   title: '模拟倒计时触发'
				// });
				
				// setTimeout(function(){
				// 	_this.$refs.runCode.$emit('runCode',0); //假装模拟下需要 终止倒计时
				// 	uni.showToast({
				// 	  icon: 'none',
				// 		position: 'bottom',
				// 	  title: '模拟倒计时终止'
				// 	});
				// },3000)
			},
		  startReg() {
				//注册
				if(this.isRotate){
					//判断是否加载中，避免重复点击请求
					return false;
				}
				if (this.showAgree == false) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '请先同意《用户注册协议》'
					});
					return false;
				}
				if (this.phoneData.length != 11) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '手机号格式不正确'
					});
					return false;
				}
				if (this.passData.length < 6) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '密码不能少于6位'
					});
					return false;
				}
				if (this.verCode.length != codeLength) {
				  uni.showToast({
				    icon: 'none',
						position: 'bottom',
				    itle: '验证码不正确'
				  });
				  return false;
				}
				
				this.register()
		  },
			register() {
				_this.isRotate = true
				var params = {
					PhoneNumber: this.phoneData,
					Code: this.verCode,
					IMEI: '',
					Pwd: this.passData
				}
				register(params).then(res => {
					_this.isRotate = false
					uni.navigateTo({
						url: '/pages/public/login'
					})
				}, err => {
					this.isRotate = false
				})
			}
		}
	}
</script>

<style scoped>
	@import url("@/common/login.css");
	
	.wbutton {
		margin-top: 60rpx;
	}
	.footer {
		margin-top: 100rpx;
	}
</style>