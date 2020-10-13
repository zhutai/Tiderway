<template>
	<view>
		<view class="uni-common-mt">
			<form>
				<view class="uni-list">
					<view class="uni-list-cell"  style="height: 50px;">
						<view class="uni-list-cell-left">
							当前选择
						</view>
						<view class="uni-list-cell-db">
							<picker @change="bindPickerChange" :value="pickerIndex" :range="pickerArray" range-key="name">
								<view class="uni-input">{{pickerArray[pickerIndex]}}</view>
							</picker>
						</view>
					</view>
				</view>

				<view class="uni-list list-pd">
					<view class="uni-textarea">
						<textarea placeholder="请输入遇到的问题或建议" :value="feedbackValue" />
					</view>
					<view class="uni-list-cell cell-pd">
						<view class="uni-uploader">
							<view class="uni-uploader-body">
								<view class="uni-uploader__files">
									<block v-for="(image,index) in imageList" :key="index">
										<view class="uni-uploader__file">
											<image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage"></image>
										</view>
									</block>
									<view class="uni-uploader__input-box">
										<view class="uni-uploader__input" @tap="chooseImage"></view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<view class="uni-button">
					<button type="primary">提交</button>
				</view>
				
			</form>
		</view>
	</view>
</template>
<script>
	import permision from "@/utils/permission.js"
	var sourceType =['camera', 'album']
	var sizeType = ['original']
	
	const pickerArray = [
		'闪退/卡顿',
		'建议/优化',
		'帐户安全',
		'其它'
	]
		// ['compressed', 'original']
	export default {
		data() {
			return {
				pickerIndex: 0,
				pickerArray,
				feedbackValue: '',
				imageList: [],
				sourceTypeIndex: 2,
				sourceType: ['拍照', '相册', '拍照或相册'],
				sizeTypeIndex: 2,
				sizeType: ['压缩', '原图', '压缩或原图'],
				countIndex: 8,
				count: [1, 2, 3, 4, 5, 6, 7, 8, 9]
			}
		},
		onUnload() {
			this.imageList = [],
				// this.sourceTypeIndex = 2,
				// this.sourceType = ['拍照', '相册', '拍照或相册'],
				// this.sizeTypeIndex = 2,
				// this.sizeType = ['压缩', '原图', '压缩或原图'],
				this.countIndex = 8;
		},
		methods: {
			sourceTypeChange: function(e) {
				this.sourceTypeIndex = parseInt(e.detail.value)
			},
			sizeTypeChange: function(e) {
				this.sizeTypeIndex = parseInt(e.detail.value)
			},
			countChange: function(e) {
				this.countIndex = e.detail.value;
			},
			chooseImage: async function() {
				// #ifdef APP-PLUS
				// TODO 选择相机或相册时 需要弹出actionsheet，目前无法获得是相机还是相册，在失败回调中处理
				if (this.sourceTypeIndex !== 2) {
					let status = await this.checkPermission();
					if (status !== 1) {
						return;
					}
				}
				// #endif

				if (this.imageList.length === 9) {
					let isContinue = await this.isFullImg();
					console.log("是否继续?", isContinue);
					if (!isContinue) {
						return;
					}
				}
				uni.chooseImage({
					sourceType: sourceType,
					sizeType: sizeType,
					count: this.imageList.length + this.count[this.countIndex] > 9 ? 9 - this.imageList.length : this.count[this.countIndex],
					success: (res) => {
						this.imageList = this.imageList.concat(res.tempFilePaths);
					},
					fail: (err) => {
						// #ifdef APP-PLUS
						if (err['code'] && err.code !== 0 && this.sourceTypeIndex === 2) {
							this.checkPermission(err.code);
						}
						// #endif
						// #ifdef MP
						uni.getSetting({
							success: (res) => {
								let authStatus = false;
								switch (this.sourceTypeIndex) {
									case 0:
										authStatus = res.authSetting['scope.camera'];
										break;
									case 1:
										authStatus = res.authSetting['scope.album'];
										break;
									case 2:
										authStatus = res.authSetting['scope.album'] && res.authSetting['scope.camera'];
										break;
									default:
										break;
								}
								if (!authStatus) {
									uni.showModal({
										title: '授权失败',
										content: 'Hello uni-app需要从您的相机或相册获取图片，请在设置界面打开相关权限',
										success: (res) => {
											if (res.confirm) {
												uni.openSetting()
											}
										}
									})
								}
							}
						})
						// #endif
					}
				})
			},
			isFullImg: function() {
				return new Promise((res) => {
					uni.showModal({
						content: "已经有9张图片了,是否清空现有图片？",
						success: (e) => {
							if (e.confirm) {
								this.imageList = [];
								res(true);
							} else {
								res(false)
							}
						},
						fail: () => {
							res(false)
						}
					})
				})
			},
			previewImage: function(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.imageList
				})
			},
			bindPickerChange: function(e) {
				this.pickerIndex = e.detail.value
			},
			async checkPermission(code) {
				let type = code ? code - 1 : this.sourceTypeIndex;
				let status = permision.isIOS ? await permision.requestIOS(sourceType[type][0]) :
					await permision.requestAndroid(type === 0 ? 'android.permission.CAMERA' :
						'android.permission.READ_EXTERNAL_STORAGE');

				if (status === null || status === 1) {
					status = 1;
				} else {
					uni.showModal({
						content: "没有开启权限",
						confirmText: "设置",
						success: function(res) {
							if (res.confirm) {
								permision.gotoAppSetting();
							}
						}
					})
				}

				return status;
			}
		}
	}
</script>

<style scoped>
	.cell-pd {
		padding: 24rpx;
	}

	.list-pd {
		margin-top: 32rpx;
	}
	
	.uni-list-cell-db .uni-input{
		height: auto;
	}
	
	uni-textarea {
		width: 100%;
		padding: 32rpx;
		padding-bottom: 0;
		max-height: 80px;
	}
	
	.uni-button {
		padding: 32rpx;
		margin-top: 40rpx;
	}
	
	.uni-uploader__input-box, .uni-uploader__file, .uni-uploader__img {
		width: 80px;
		height: 80px;
	}
</style>
