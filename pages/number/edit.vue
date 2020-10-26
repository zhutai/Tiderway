<template>
	<view class="page-number-edit">
		<view class="content">
			<view class="uni-form-item">
				<view class="uni-form-item__title"><text>姓名</text></view>
				<view class="uni-input-wrapper">
					<input class="uni-input" type="text" v-model="userName" placeholder="请输入姓名" />
				</view>
			</view>
			<view class="uni-form-item">
				<view class="uni-form-item__title"><text>手机号码</text></view>
				<view class="uni-input-wrapper">
					<input class="uni-input" type="number" v-model="mobile" placeholder="请输入手机号码" />
				</view>
			</view>
			<view class="books" v-if="isApp">
				<uni-icons class="add-icon" type="person" size="16" color="#4499fc" />
				<text>从通讯录中快速选择</text>
			</view>
			<view class="uni-form-item">
				<view class="uni-form-item__title" style="width: 150px;"><text>设为SOS号码</text></view>
				<view class="uni-input-wrapper" style="justify-content: flex-end;">
					<switch :checked="switchBool" color="#4399fc" style="transform:scale(0.8)" @change="switchChange" />
				</view>
			</view>
			<view class="button-padding">
				<button class="mini-btn" type="primary"  @click="edit">保存</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { nativeCommon } from '@/utils/addressBook/nativeCommon.js'
	import { setCmdSend } from '@/api/cmd.js'
	export default {
		data() {
			return {
				userName: '',
				mobile: '',
				switchBool: false,
				isApp: false
			};
		},
		components: {
		},
		computed: {
			...mapState['deviceImei']
		},
		onLoad(option) {
			this.index = option.index || null
			this.getNumberInfo(this.index)
			// #ifdef APP-NVUE
			this.isApp = true
			// #endif
		},
		mounted() {
		},
		methods: {
			edit() {
				if (this.userName.length < 2) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '姓名不能小于2位'
					});
					return;
				}
				if (this.mobile.length < 11) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '手机号码格式不正确'
					});
					return;
				}
				this.setNumberList()
				this.savaConfig()
			},
			async savaConfig() {
				let phoneData = []
				this.numberList.forEach(item => {
					let str = item.label + ',' + item.phone
					phoneData.push(str)
				})
				let strPhone = phoneData.join(',')
				let sosList = this.numberList.filter(item => {
					if (item.isSos) {
						return item.value
					}
				})
				let sosStr = sosList.join(',')
				try{
					await setCmdSend({ CmdCode: '1009', CmdContent: strPhone, Source: 4 })
					if (sosStr) {
						await setCmdSend({ CmdCode: '1004', CmdContent: sosStr, Source: 4 })
					}
				}catch(e){
					console.log(e)
					//TODO handle the exception
				}
			},
			setNumberList() {
				// index 有值为编辑  null为新增
				if (this.index) {
					this.numberList.forEach((item, index) => {
						if (index == this.index) {
							item.label = this.userName
							item.phone = this.mobile
							item.isSos = this.switchBool
						}
					})
				} else {
					let obj = {
						label: this.userName,
						phone: this.mobile,
						isSos: this.switchBool
					}
					this.numberList.push(obj)
				}
			},
			getNumberInfo(index) {
				let numberList = uni.getStorageSync('numberList')
				this.numberList = numberList
				if (index && numberList && numberList.length) {
					this.userName = numberList[index].label
					this.mobile = numberList[index].phone
					this.switchBool = numberList[index].isSos
				}
			},
			switchChange(e) {
				this.switchBool = e.detail.value
			},
			// 获取通讯录
			getContacts() {
				// 获取通讯录对象
				// #ifdef APP-NVUE
				var that = this
				nativeCommon.contacts.getContact(function(name,phoneNumber){
					that.userName = name
					that.mobile = phoneNumber;
				})
				// #endif
			}
		}
	}
</script>

<style scoped>
	.books {
		padding: 16rpx 24rpx;
		text-align: right;
		color: #4399fc;
	}
	.uni-form-item {
		/* width: 200rpx; */
		margin: 20rpx 0;
		padding: 0 0 0 32rpx;
		background-color: #fff;
	}
	.uni-form-item__title {
		width: 200rpx;
		font-size: 16px;
		line-height: 24px;
		align-self: center;
	}
	
	.uni-input-wrapper {
	    /* #ifndef APP-NVUE */
	    display: flex;
	    /* #endif */
	    padding: 24rpx;
	    flex-direction: row;
	    flex-wrap: nowrap;
	    background-color: #FFFFFF;
	}
	
	.uni-input {
		height: 60rpx;
		line-height: 60rpx;
		font-size: 16px;
		padding: 0px;
		flex: 1;
		background-color: #FFFFFF;
	}
	
	.uni-icon {
		font-family: uniicons;
		font-size: 24px;
		font-weight: normal;
		font-style: normal;
		width: 24px;
		height: 24px;
		line-height: 24px;
		color: #999999;
	}
	.button-padding {
		padding: 40rpx 100rpx;
	}
</style>
