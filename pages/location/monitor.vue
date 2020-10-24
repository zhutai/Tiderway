<template>
	<view v-if="token">
		<web-view :src="webViewStr" @message="message">
			
		</web-view>
	</view>
	
</template>
<script>
	import { mapState, mapMutations } from 'vuex'
	import { getDeviceToken } from '@/api/device.js'
	export default {
		data() {
			return {
				token: '',
				webViewStr: '',
			}
		},
		computed: {
			...mapState(['deviceImei', 'userInfo'])
		},
	  async onLoad() {
			let result = await getDeviceToken()
			this.token = result.Data
			this.webViewStr = `http://web.tiderway.com/H5Location/H5Monitor?token=${this.token}`
			// this.webViewStr = "http://web.tiderway.com/H5Location/H5Monitor?token=EmFOaO8hE5Hw2XzZrE2J6GJSHrX5zpWL12APP6c2oIE="
			console.log(this.webViewStr)
		},
		methods: {
			openLocation(e) {
				uni.openLocation({
					longitude: Number(this.longitude),
					latitude: Number(this.latitude),
					name: "",
					address: this.address
				})
			},
			message(e) {
				console.log(e)
				this.$api.msg('message成功了')
			},
			clickSatellite() {
				this.enableSatellite = true;
			},
			handleClick(item) {
				this[item.fun](item)
			},
			layerSwitch(item) {
				this.enableSatellite = true;
				//this.$api.msg(item.name)
			},
			getLocation(item) {
				this.location();
				// this.$api.msg(item.name)
			},
			callPhone(item) {
				this.$api.msg(item.name)
			},
			otherFun(item) {
				this.$api.msg(item.name)
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
				
				let mapContent=uni.createMapContext("map",this)
				console.log(mapContent)
				
				mapContent.moveToLocation({longitude:this.longitude,latitude:this.latitude})
				
				let point = new plus.maps.Point(this.longitude, this.latitude);
				plus.maps.Map.reverseGeocode(point, {}, function(event) {
					var address = event.address; // 转换后的地理位置
					console.log("Address:" + address);
					this.address = address
				}, function(e) {
					console.log("Failed:" + JSON.stringify(e));
				});

			}
		}
	}
</script>
<style>
	
</style>
