<template>
	<view class="page-addDevice">
		<view class="content">
			<!-- 头部logo -->
			<view class="header">
				<image src="/static/image/logo.png"></image>
			</view>
			
			<view class="main">
				<wInput v-model="deviceCode" type="text" maxlength="11" placeholder="请输入设备编号"></wInput>
			</view>
			
			<wButton class="wbutton" text="添加设备" :rotate="isRotate" @click="addDevice"></wButton>
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
			};
		},
		components: {
			wInput,
			wButton,
		},
		computed: {
			...mapState['deviceImei']
		},
		mounted() {
		},
		methods: {
			...mapMutations(['login', 'setDeviceImei']),
			addDevice() {
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
				bindDevice({ imei: deviceCode }).then(res => {
					if (!this.deviceImei) {
						this.setDeviceImei({ deviceImei: deviceCode , imeiLength: 1 })
					}
					this.isRotate = false
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '添加绑定成功'
					});
				}, err => {
					this.isRotate = false
				})
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
