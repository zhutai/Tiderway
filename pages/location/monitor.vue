<template>
	<view class="page-monitor">
		<map class="map" :latitude="latitude" :longitude="longitude" :enable-satellite="enableSatellite" :markers="markers">
			<cover-image v-for="(item, index) in options" :key="index" :style="{ bottom: `${ fixedHeight + (height * (index % 2))}px` }"
				:class="item.icon" class="cover-image" 
				:src="item.imageUrl || '../../static/missing-face.png'" 
				@click="handleClick(item)">
			</cover-image>
			<cover-view class="back-block"></cover-view>
			<cover-view class="address">{{ address }}</cover-view>
			<cover-image class="navigation cover-image" src="../../static/image/monitor/monitor_img5.png" ></cover-image>
		</map>
	</view>
</template>
<script>
	import { mapState } from 'vuex';
	
	const options = [
		{
			name: '刷新定位',
			fun: "getLocation",
			icon: 'float-left',
			imageUrl: '../../static/image/monitor/monitor_img2.png'
		},
		{
			name: '图层切换',
			fun: "layerSwitch",
			icon: 'float-left',
			imageUrl: '../../static/image/monitor/monitor_img1.png'
		},
		{
			name: '拨打电话',
			fun: "callPhone",
			icon: 'float-right',
			imageUrl: '../../static/image/monitor/monitor_img4.png'
		}
		,{
			name: '设备响铃',
			fun: "otherFun",
			icon: 'float-right',
			imageUrl: '../../static/image/monitor/monitor_img3.png'
		},
	]

	export default {
		data() {
			return {
				options,
				height: uni.upx2px(100),
				fixedHeight: uni.upx2px(600),
				title: 'map',
				latitude: 39.909,
				longitude: 116.39742,
				address: '北京市天安门',
				enableSatellite: false,
				markers: [{
					latitude: 39.9085,
					longitude: 116.39747,
					iconPath: '../../static/icon/0.png',
					width: 300,
					height: 300
				}]
			}
		},
		computed: {
			...mapState(['deviceImei', 'userInfo'])
		},
		async created() {
			this.location()
		},
		methods: {
			clickSatellite() {
				this.enableSatellite = true;
			},
			handleClick(item) {
				this[item.fun](item)
			},
			layerSwitch(item) {
				this.enableSatellite=true;
				this.$api.msg(item.name)
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
				let result = await this.$http.post("v1.0/location/monitor", {})

				let market = {
					callout:{
						content:result.Data.RecivedAt,
						display:'ALWAYS',
						padding:10
					},
					latitude: result.Data.Lat,
					longitude: result.Data.Lng,
					iconPath: '../../static/icon/0.png',
					width: 30,
					height: 30
				}

				this.latitude = result.Data.Lat
				this.longitude = result.Data.Lng
				this.markers = [market];
				// #ifdef APP-PLUS
				var point = new plus.maps.Point(latitude,longitude);
				plus.maps.Map.reverseGeocode(point, {}, function(res) {
					this.address = res.address;
				})
				// #endif
			}
		}
	}
</script>
<style>
	.map {
		width: 100vw;
		height: 100vh;
		position: relative;
	}
	
	.cover-image {
		width: 100rpx;
		height: 100rpx;
		background-color: #ccc;
	}
	
	.float-left {
		position: fixed;
		left: 0;
		bottom: 700rpx;
	}
	
	.float-right {
		position: fixed;
		right: 0;
		bottom: 700rpx;
	}
	
	.back-block {
		position: absolute;
		bottom: 0;
		left: 0;
		height: 200rpx;
		width: 100%;
		background: #fff;
	}
	
	.address {
		position: absolute;
		bottom: 0;
		left: 0;
		width: calc(100vw - 160rpx);
		background: #fff;
		display: flex;
		height: 200rpx;
		font-size: 16px;
		padding: 24rpx;
		white-space: normal;
	}
	.navigation {
		position: absolute;
		bottom: 50rpx;
		right: 50rpx;
		background: #fff;
	}
</style>
