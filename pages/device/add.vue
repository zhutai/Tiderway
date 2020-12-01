<template>
	<view class="page-addDevice">
		<view class="content">
			<!-- 头部logo -->
			<view class="header">
				<image src="/static/image/logo.png"></image>
			</view>
			
			<view class="main">
				<wInput v-model="deviceCode" type="text" maxlength="16" customIcon="iconsaomiao" placeholder="请输入设备编号" @onclick="InputClick"></wInput>
			</view>
			
			<wButton class="wbutton" text="添加设备" :rotate="isRotate" @click="addDevice"></wButton>
			
			<xy-dialog
				title="无法添加"
				:show="dialogVisible"
				:isShowCancel="false"
				content="抱歉，当前用户无法添加设备"
				@cancelButton="dialogVisible = false"
				@confirmButton="confirmButton">
			</xy-dialog>
			
			<xy-dialog
				:show="dialogVisible2"
				content="是否连接此设备"
				@cancelButton="dialogVisible2 = false"
				@confirmButton="confirm">
			</xy-dialog>
		</view>
	</view>
</template>

<script>
	import wInput from '@/components/watch-login/watch-input.vue' //input
	import wButton from '@/components/watch-login/watch-button.vue' //button
	import { bindDevice, getDeviceInfo } from '@/api/device.js'
	import { mapState, mapMutations } from 'vuex';
	export default {
		data() {
			return {
				deviceCode: '', //用户设备编号
				isRotate: false, //是否加载旋转
				dialogVisible: false, // admin用户系统无法添加设备
				dialogVisible2: false // 切换设备弹框
			};
		},
		components: {
			wInput,
			wButton,
		},
		computed: {
			...mapState(['deviceImei', 'userInfo'])
		},
		onLoad() {
			let UserType = this.userInfo.UserType
			if (UserType == 1 || UserType == 2) {
				this.dialogVisible = true
			}
		},
		methods: {
			...mapMutations(['login', 'selectDevice']),
			confirmButton() {
				uni.navigateBack({
					delta: 1
				})
			},
			InputClick() {
				uni.scanCode({
					success: (res) => {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
						this.deviceCode = res.result
					}
				});
			},
			async confirm() {
				let deviceItem = await this.queryDeviceInfo(this.deviceCode)
				this.selectDevice({ deviceItem: deviceItem , imeiLength: 1 })
				this.dialogVisible2 = false
				this.deviceCode = ''
				uni.showToast({
					title: '连接成功'
				});
			},
			async queryDeviceInfo(imei) {
				const result = await getDeviceInfo({ imei })
				return result.Data
			},
			async addDevice() {
				if (this.isRotate) {
					//判断是否加载中，避免重复点击请求
					return false;
				}
				let deviceCode = this.deviceCode
				if (deviceCode.length < 8) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '设备编号格式不正确'
					});
					return;
				}
				this.isRotate = true
				try{
					await bindDevice({ imei: deviceCode })
					// 无绑定设备的情况下默认添加
					if (!this.deviceImei) {
						let deviceItem = await this.queryDeviceInfo(deviceCode)
						this.selectDevice({ deviceItem: deviceItem , imeiLength: 1 })
						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: '添加设备成功'
						});
					} else {
						// 有绑定设备的弹出提示是否切换到当前设备
						this.dialogVisible2 = true
					}
					this.isRotate = false
					
				}catch(e){
					this.isRotate = false
				}
			}
		}
	}
</script>

<style scoped>
	@import url("@/common/login.css");

	/* 登录按钮 */
	.wbutton {
		margin-top: 96rpx;
	}

	.page-addDevice {
		
	}
</style>
