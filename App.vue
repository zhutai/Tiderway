<script>
	/**
	 * vuex管理登陆状态，具体可以参考官方登陆模板示例
	 */
	import {
		mapMutations
	} from 'vuex';
	import { getDeviceList } from "@/api/device.js"
	export default {
		methods: {
			...mapMutations(['login', 'selectDevice']),
			 // 判断用户是否第一次进入程序，是则跳入程序引导页面
			loadExecution: function(option){
				/**
				 * 获取本地存储中launchFlag的值
				 * 若存在，说明不是首次启动，直接进入首页；
				 * 若不存在，说明是首次启动，进入引导页；
				 */
				try {
					// 获取本地存储中launchFlag标识
				  const value = uni.getStorageSync('launchFlag');
				  if (!value) {
						// launchFlag=true直接跳转到首页
						uni.reLaunch({
							url: '/pages/index/guide'
						});
				  } else {
						// launchFlag!=true显示引导页
						this.loadUserInfo(option)
				  }
				} catch(e) {
					console.log(e)
					// error 
					uni.setStorage({ 
						key: 'launchFlag', 
						data: true, 
						success: function () {
							console.log('error时存储launchFlag');
						} 
					});
				}
			},
			// 判断用户是否有登录信息，没有则跳转登录页面
			loadUserInfo(option) {
				let userInfo = uni.getStorageSync('userInfo') || '';
				if(userInfo){
					//更新登陆状态
					this.login(userInfo)
					// 默认选中第一个设备数据
					let deviceItem = uni.getStorageSync('deviceItem') || {};
					if (deviceItem.IMEI) {
						this.selectDevice({ deviceItem: deviceItem, imeiLength: 1 })
					} else{
						this.selectDevice({ deviceItem: {}, imeiLength: 0 })
					}
				} else {
					let arr = ["pages/public/register", "pages/public/login"]
					if (!arr.includes(option.path)) {
						uni.reLaunch({ url: '/pages/public/login' })
					}
				}
			}
		},
		onLaunch: function(option) {
			// this.loadExecution(option)
			this.loadUserInfo(option)
		},
		onShow: function() {
			// console.log('App Show')
		},
		onHide: function() {
			// console.log('App Hide')
		},
	}
</script>

<style lang='scss'>
	@import './common/uni.css'; 	
	@import './common/common.css';
	@import './common/icon.css';
</style>
