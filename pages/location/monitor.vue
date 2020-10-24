<template>
	<view class="page-monitor">
		<map class="map" id="map" :latitude="latitude" :longitude="longitude" :enable-satellite="enableSatellite" :markers="markers">
			<cover-image v-for="(item, index) in options" :key="index" :style="{ bottom: `${ fixedHeight + (height * (index % 2))}px` }"
			 :class="item.icon" class="cover-image" :src="item.imageUrl" @click="handleClick(item)">
			</cover-image>
			<cover-view class="back-block"></cover-view>
			<cover-view class="address"><text>{{ address }}</text></cover-view>
			<cover-image class="navigation cover-image" @click="openLocation" src="../../static/image/monitor/monitor_img5.png"></cover-image>
		</map>
	</view>
</template>
<script>
	import {
		mapState
	} from 'vuex';
	import {
		monitor
	} from '@/api/location'
	import {
		bdToGaoDe
	} from '@/mock'

	const options = [{
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
		}, {
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
				address: '',
				enableSatellite: false,
				markers: [{
					latitude: 39.9085,
					longitude: 116.39747,
					iconPath: '../../static/icon/0.png'
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
			openLocation(e) {
				uni.openLocation({
					longitude: Number(this.longitude),
					latitude: Number(this.latitude),
					name: "",
					address: this.address
				})
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
