<template>
	<view v-if="token">
		<web-view :src="webViewStr" @message="message">

		</web-view>
	</view>

</template>
<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	import {
		bdToGaoDe
	} from 'mock'

	import {
		getDeviceToken
	} from '@/api/device.js'
	export default {
		data() {
			return {
				token: '',
				webViewStr: '',
				curLat: 0,
				curLng: 0,
				longitude: 0,
				latitude: 0,
				h5Url: 'http://web.tiderway.com/H5Location/H5Monitor'
			}
		},
		computed: {
			...mapState(['deviceImei', 'userInfo', 'deviceItem'])
		},
		async onLoad() {

			let result = await getDeviceToken()
			this.token = result.Data

			let _this = this;
			//#ifdef APP-PLUS
			plus.geolocation.getCurrentPosition(function(position) {
				console.log(position)

				_this.curLat = position.coords.latitude
				_this.curLng = position.coords.longitude
				_this.webViewStr = `${_this.h5Url}?token=${_this.token}&lat=${_this.curLat}&lng=${_this.curLng}`
				console.log(_this.webViewStr)
			}, function(e) {
				plus.nativeUI.alert("获取定位位置信息失败：" + e.message);

				_this.webViewStr = `${_this.h5Url}?token=${_this.token}`
			}, {
				geocode: true
			});
			//#endif

			//#ifdef !APP-PLUS
			this.webViewStr = `${this.h5Url}?token=${this.token}`
			//#endif
			// console.log(this.webViewStr)
		},
		methods: {
			message(e) {
				let data = e.detail.data[0]
				let action = data.action;
				if (action == "to") {
					var latlng = bdToGaoDe(data.lat, data.lng)
					this.latitude = latlng.lat
					this.longitude = latlng.lng
		
					uni.openLocation({
						longitude: Number(this.longitude),
						latitude: Number(this.latitude),
						name: "",
						address: data.address
					})
				} else if (action == "call") {
					let phone = this.deviceItem.PhoneNum
					phone += ''
					if (phone) {
						uni.makePhoneCall({
							phoneNumber: phone
						})
					} else {
						uni.showModal({
							content: "用户未添加手机号码，暂时无法拨打，请添加手机号码后再进行拨打",
							showCancel: false,
							confirmText: "确定",
							success: function(res) {
								if (res.confirm) {
									uni.navigateTo({
										url: '/pages/device/setting'
									})
								}
							}
						})
					}
				}
			},
			async location() {
				let result = await monitor({})
				var latlng = bdToGaoDe(result.Data.Lat, result.Data.Lng)
				let market = {
					callout: {
						content: result.Data.RecivedAt,
						display: 'ALWAYS',
						padding: 10
					},
					latitude: latlng.lat,
					longitude: latlng.lng,
					iconPath: '../../static/icon/0.png'
				}
		
				this.latitude = latlng.lat
				this.longitude = latlng.lng
				this.markers = [market];
		
				let mapContent = uni.createMapContext("map", this)
				console.log(mapContent)
		
				//mapContent.moveToLocation({longitude:this.longitude,latitude:this.latitude})
		
				// let point = new plus.maps.Point(this.longitude, this.latitude);
				// plus.maps.Map.reverseGeocode(point, {}, function(event) {
				// 	var address = event.address; // 转换后的地理位置
				// 	console.log("Address:" + address);
				// 	this.address = address
				// }, function(e) {
				// 	console.log("Failed:" + JSON.stringify(e));
				// });
		
			}
		}
	}
</script>
<style>

</style>
