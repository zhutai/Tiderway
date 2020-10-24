<template>
	<view class="container">
		
		<view class="list-cell" v-for="(item, index) in cmdList" :key="index"
			:class="{ 'm-t': !(index % 3), 'b-b': (index % 3) < 2 }" @click="handleClick(item, index)">
			<text class="cell-tit">{{ item.CmdName }}</text>
			<view class="cell-value">
			</view>
			<uni-icons type="arrowright" size="18" color="#909399" />
		</view>
		<uni-popup id="popupShare" ref="popupShare" type="share" @change="change">
			<view class="cmd-body">
				<scroll-view class="scroll-view" scroll-y="true">
					<view class="uni-form-item uni-column" v-for="(item, index) in currentList" :key="index">
						<view class="uni-form-item__title"><text>{{ item.label }}</text></view>
						<view class="uni-input-wrapper">
							<input class="uni-input" type="text" v-model="item.value" :placeholder="`请输入${item.label}`" />
						</view>
					</view>
				</scroll-view>
				<view class="button-padding">
					<button class="mini-btn" type="primary"  @click="confirm">确认</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { getCmdList, setCmdSend, getCmdCodeVlaue } from '@/api/cmd.js'
	import { mapMutations } from 'vuex';
	
	export default {
		data() {
			return {
				cmdItem: null,
				cmdList: [],
				currentList: [],
				activeIndex: 0,
				alarmTypeIndex: 0,
			};
		},
		async onLoad() {
			const result = await getCmdList()
			this.cmdList = result.Data.CmdList
		},
		methods:{
			...mapMutations(['logout']),
			async handleClick(item, index) {
				this.cmdItem = item
				if (item.CmdTemplate) {
					let currentList = this.parseData(item.CmdTemplate)
					this.currentList = currentList
					this.$refs.popupShare.open()
					try{
						const result = await getCmdCodeVlaue({ cmdCode: item.CmdCode })
						let str = result.Data
						str = str.split(',')
						this.currentList.forEach((item, index) => {
							if (index < str.length) {
								item.value = str[index]
							}
						})
					}catch(e){
						//TODO handle the exception
					}
				} else {
					uni.showModal({
						content: "是否立即下发",
						showCancel: true,
						confirmText: "确定",
						cancelText: "取消",
						success: (res) => {
							if (res.confirm) {
								this.confirm()
							}
						}
					})
				}
			},
			parseData(str) {
				let types = str.split('|')
				let array = []
				types.forEach(item => {
					let arr = item.split(',')
					let obj = {
						type: arr[0],
						label: arr[1],
						value: ''
					}
					array.push(obj)
				})
				return array
			},
			confirm() {
				let params = this.cmdParams(this.cmdItem, this.currentList)
				setCmdSend(params).then(res => {
					console.log(res)
				},err => {
					
				})
			},
			cmdParams(cmdItem, currentList) {
				let params = {
					CmdCode: cmdItem.CmdCode,
					Source: 4
				}
				let CmdContent = []
				currentList.forEach(item => {
					if (item.value) {
						CmdContent.push(item.value)
					}
				})
				params.CmdContent = CmdContent.join(',')
				return params
			},
			change() {
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background: $page-color-base;
	}
	.list-cell{
		display:flex;
		align-items:baseline;
		padding: 20upx $page-row-spacing;
		line-height:60upx;
		position:relative;
		background: #fff;
		justify-content: center;
		&.cell-hover{
			background:#fafafa;
		}
		&.b-b:after{
			left: 30upx;
		}
		&.m-t{
			margin-top: 16upx; 
		}
		.cell-more{
			align-self: baseline;
			font-size:$font-lg;
			color:$font-color-light;
			margin-left:10upx;
		}
		.cell-tit{
			width: 400rpx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-right:10upx;
		}
		.cell-value {
			flex: 1;
		}
	}
	
	.cmd-body {
		max-height: 1000rpx;
		background-color: #fff;
		.scroll-view {
			max-height: 800rpx;
			padding: 24rpx;
			
		}
		.button-padding {
			padding: 24rpx 48rpx;
		}
	}
	
	
	.uni-form-item {
		padding: 0;
	}
	.uni-form-item__title {
		width: 200rpx;
		color: #aaa;
		font-size: 14px;
		line-height: 48rpx;
		padding-left: 24rpx;
	}
	
	.uni-input-wrapper {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		padding: 16rpx 24rpx;
		flex-direction: row;
		flex-wrap: nowrap;
		background-color: #FFFFFF;
	}
	
	.uni-input {
		height: 72rpx;
		line-height: 72rpx;
		flex: 1;
		background: #f4f4f4;
		padding: 4rpx 24rpx;
		font-size: 14px;
	}
</style>
