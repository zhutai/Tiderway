<template>
	<view class="page-addDevice">
		<view class="content">
			<!-- 头部logo -->
			<view class="header">
				<image src="/static/image/logo.png"></image>
			</view>
			
			<view class="main">
				<wInput v-model="deviceCode" type="text" maxlength="16" placeholder="请输入设备编号"></wInput>
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
		</view>
	</view>
</template>

<script>
	import wInput from '@/components/watch-login/watch-input.vue' //input
	import wButton from '@/components/watch-login/watch-button.vue' //button
	import { bindDevice, getDeviceList } from '@/api/device.js'
	import { mapState, mapMutations } from 'vuex';
	export default {
		data() {
			return {
				deviceCode: '', //用户设备编号
				isRotate: false, //是否加载旋转
				dialogVisible: false
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
			console.log(this.userInfo)
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
					if (!this.deviceImei) {
						const result = await getDeviceList({Imei: deviceCode })
						let deviceList = result.Data.DeviceList[0]
						this.selectDevice({ deviceItem: deviceList , imeiLength: 1 })
					}
					this.isRotate = false
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '添加设备成功'
					});
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
