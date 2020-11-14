<template>
	<view class="page-number-list">
		<scroll-view style="height: 100vh;" scroll-y="true">
			<view class="content">
				<view class="number-item" v-for="(item, index) in numberList" :key="index">
					<view class="top flex">
						<text class="title">{{ item.label }}</text>
						<text class="sos" v-if="item.isSos">SOS</text>
					</view>
					<view class="bottom flex">
						<text class="phone">{{ item.phone }}</text>
						<button class="mini-btn" type="primary" size="mini" @click="JumpEdit(index)">编辑</button>
						<button class="mini-btn" type="default" size="mini" @click="handleDelete(index)">删除</button>
					</view>
				</view>
			</view>
			<view class="flex add-number" v-if="numberList.length < 10 && loading" @click="JumpEdit(null)">
				<uni-icons class="add-icon" type="plus" size="36" color="#606266" />
				<text class="tips">{{ numberList.length ? `您已添加个${numberList.length}亲情号` : '您暂未添加亲情号码' }}{{ `,还可以添加${10 - numberList.length}个亲情号码` }}</text>
			</view>
		</scroll-view>
		
		<xy-dialog
			title="确认删除"
			:show="dialogVisible"
			content="是否确认删除该号码"
			@cancelButton="dialogVisible = false"
			@confirmButton="confirmButton">
		</xy-dialog>
		
	</view>
</template>

<script>
	import wInput from '@/components/watch-login/watch-input.vue' //input
	import wButton from '@/components/watch-login/watch-button.vue' //button
	import { getCmdList, setCmdSend, getCmdCodeVlaue } from '@/api/cmd.js'
	import { mapState, mapMutations } from 'vuex';
	export default {
		data() {
			return {
				dialogVisible: false,
				numberList: []
			};
		},
		components: {
			// wInput,
			// wButton,
		},
		computed: {
			...mapState['deviceImei']
		},
		onShow() {
			this.getNumberList()
		},
		mounted() {
		},
		methods: {
			async getNumberList() {
				uni.showLoading({title: ' 加载中...', mask: true})
				this.loading = false
				const result = await getCmdList({ cmdCode: '1009' })
				let cmdList = result.Data.CmdList
				let numberList = ''
				if (cmdList.length) {
					numberList = this.parseData(cmdList[0].CmdTemplate)
				}
				const phoneValues = await getCmdCodeVlaue({cmdCode: '1009'})
				let array = []
				if (phoneValues.Data) {
					let phoneList = this.parseValues(phoneValues.Data)
					const sosValues = await getCmdCodeVlaue({cmdCode: '1004'})
					let str = sosValues.Data
					phoneList.forEach((item, index) => {
						let obj = {
							label: item.label,
							phone: item.value,
							isSos: str.includes(item.value)
						}
						array.push(obj)
					})
				}
				this.numberList = array
				this.loading = true
				uni.hideLoading()
				uni.setStorageSync('numberList', this.numberList)
			},
			parseData(str) {
				let types = str.split('|')
				let array = []
				types.forEach(item => {
					let arr = item.split(',')
					let obj = {
						label: arr[0] || '',
						value: arr[1] || '',
					}
					array.push(obj)
				})
				return array
			},
			parseValues(str) {
				let types = str.split(',')
				let array = []
				let arr1 = []
				let arr2 = []
				types.forEach((item, index) => {
					if (index % 2) {
						arr2.push(item)
					} else {
						arr1.push(item)
					}
				})
				arr1.forEach((item, index) => {
					let obj = {
						label: item,
						value: arr2[index]
					}
					array.push(obj)
				})
				return array
			},
			JumpEdit(index) {
				let url = '/pages/number/edit'
				if (typeof index === 'number') {
					url += `?index=${index}`
				}
				uni.navigateTo({
					url: url
				})
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
					this.dialogVisible = false
					uni.showToast("删除成功")
					uni.setStorageSync('numberList', this.numberList)
				}catch(e){
					console.log(e)
					this.dialogVisible = false
					//TODO handle the exception
				}
			},
			confirmButton(){
				this.numberList.splice(this.clickIndex, 1)
				this.savaConfig()
			},
			handleDelete(index) {
				this.dialogVisible = true
				this.clickIndex = index
			}
		}
	}
</script>

<style lang="scss" scoped>
	.flex {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.page-number-list {
		.content {
			.number-item {
				height: 140rpx;
				background: #fff;
				color: $font-color-dark;
				border-left: 12rpx solid $font-color-spec;
				padding: 12rpx;
				margin: 12rpx 0;
				.top {
					.title {
						font-size: 14px;
						padding: 12rpx 0;
					}
					.sos {
						padding-right: 12rpx;
						font-weight: bold;
						color: $font-color-spec;
					}
				}
				.bottom {
					.phone {
						flex: 1;
						font-size: 14px;
					}
					.mini-btn {
						border-radius: 32rpx;
						line-height: 48rpx;
						padding: 0 32rpx;
						margin-left: 20rpx;
						&[type=primary] {
							background: $font-color-spec;
						}
						&[type=default] {
							color: $font-color-spec;
							border: 1rpx solid $font-color-spec;
							background: #fff;
						}
					}
				}
			}
		}
		.add-number {
			color: $font-color-base;
			background: #fff;
			flex-direction: column;
			margin-bottom: 12rpx;
			.add-icon {
				padding: 12rpx;
			}
			.tips {
				padding-bottom: 12rpx;
			}
		}
	}
</style>
