<template>
	<view class="container">
		<view class="list-cell m-t" @click="actionSheetTap">
			<text class="cell-tit">预警方式</text>
			<view class="cell-value">{{ alarmTypeOptions[alarmTypeIndex].value }}</view>
			<uni-icons type="arrowright" size="18" color="#909399" />
		</view>
		
		<view class="list-cell" v-for="(item, index) in cellList" :key="index"
			:class="{ 'm-t': item.space, 'b-b': item.isBorder }" @click="handleClick(item, index)">
			<text class="cell-tit">{{ item.label }}</text>
			<view class="cell-value">
				<picker v-if="item.min && item.max" @change="bindPickerChange" :value="item.index" :range="item.options">
					<view class="uni-input">{{ (item.num || '-') + ' ' + item.unit }}</view>
				</picker>
				<text v-else>{{ (item.num || '-') + ' ' + item.unit }}</text>
			</view>
			<uni-icons type="arrowright" size="18" color="#909399" />
		</view>
		
		<uni-popup id="dialogInput" ref="dialogInput" type="dialog">
			<uni-popup-dialog mode="input" title="辐射值设置" :value="dialogInput" placeholder="请输入辐射值" @confirm="dialogInputConfirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import { mapMutations } from 'vuex';
	import { getConfig, saveConfig } from '@/api/alarm.js'
	const cellList = [
		{
			label: '心率低值',
			space: true,
			isBorder: true,
			min: 60,
			max: 90,
			num: 80,
			index: 10,
			unit: 'bpm',
			key: 'HeartMin',
			options: []
		},
		{
			label: '心率高值',
			space: false,
			isBorder: false,
			min: 60,
			max: 90,
			num: 80,
			index: 20,
			unit: 'bpm',
			key: 'HeartMax',
			options: []
		},
		{
			label: '舒张压低值',
			space: true,
			isBorder: true,
			min: 90,
			max: 120,
			num: 80,
			index: 30,
			unit: 'mmHg',
			key: 'DiastoleMin',
			options: []
		},
		{
			label: '舒张压高值',
			space: false,
			isBorder: true,
			min: 60,
			max: 90,
			num: 80,
			index: 23,
			unit: 'mmHg',
			key: 'DiastoleMax',
			options: []
		},
		{
			label: '缩收压低值',
			space: false,
			isBorder: true,
			min: 60,
			max: 90,
			num: 80,
			index: 24,
			unit: 'mmHg',
			key: 'ShrinkMin',
			options: []
		},
		{
			label: '缩收压高值',
			space: false,
			isBorder: false,
			min: 60,
			max: 90,
			num: 80,
			index: 25,
			unit: 'mmHg',
			key: 'ShrinkMax',
			options: []
		},
		{
			label: '辐射低值',
			space: true,
			isBorder: true,
			num: 80,
			index: 26,
			unit: 'µSv/h',
			key: 'RadioMin',
			options: []
		},
		{
			label: '辐射高值',
			space: false,
			isBorder: false,
			num: 80,
			index: 27,
			unit: 'µSv/h',
			key: 'RadioMax',
			options: []
		},
	]
	
	const alarmTypeOptions = [
		{
			key: 0,
			value: '无'
		},{
		key: 1,
		value: '声音'
		}, {
			key: 2,
			value: '推送'
		}, {
			key: 3,
			value: '短信'
		}, {
			key: 4,
			value: '推送和短信'
		},
	]
	
	export default {
		data() {
			return {
				cellList,
				activeIndex: 0,
				alarmTypeIndex: 0,
				alarmTypeOptions,
				dialogInput: ''
			};
		},
		onLoad(){
			this.getConfig()
		},
		methods:{
			...mapMutations(['logout']),
			async getConfig() {
				const config = await getConfig({UserId: 1})
				this.configData = config.Data
				this.alarmTypeIndex = this.configData.AlarmNotityType
				this.cellList.forEach(item => {
					item.num = this.configData[item.key]
				})
			},
			async saveConfig(obj) {
				obj.AlarmNotityType = this.alarmTypeIndex
				let params = Object.assign(this.configData, obj)
				saveConfig(params).then(res => {
					console.log(res)
				}, err => {
					console.log(err)
				})
			},
			confirmDialog(num) {
				if (num) this.dialogInput = num
				this.$refs.dialogInput.open()
			},
			async dialogInputConfirm(done, val) {
				if (val) {
					let activeIndex = this.activeIndex
					let current = this.cellList.find((item, index) => index === activeIndex) || {}
					current.num = val
					let obj = {}
					obj[current.key] = val
					await this.saveConfig(obj)
					done()
				} else {
					done()
				}
			},
			handleClick(item, index) {
				this.activeIndex = index
				if (item.min && item.max) {
					if (item.options.length === 0) {
						let array = []
						for(let i = item.min; i <= item.max; i++) {
							array.push(i)
						}
						item.options = array
					}
					let findIndex = item.options.findIndex(list => list == item.num)
					item.index = findIndex
				} else {
					this.confirmDialog(item.num)
				}
			},
			actionSheetTap(item) {
				let itemLlst = this.alarmTypeOptions.map(item => item.value)
				uni.showActionSheet({
					title:'选择预警方式',
					itemList: itemLlst,
					success: (e) => {
						let tapIndex = e.tapIndex
						this.alarmTypeIndex = tapIndex
						this.saveConfig({})
					}
				})
			},
			bindPickerChange(e) {
				let index = e.detail.value
				let activeIndex = this.activeIndex
				let obj = {}
				this.cellList.forEach((item, listIndex) => {
					if (activeIndex === listIndex) {
						item.num = item.options[index]
						item.index = index
					}
					obj[item.key] = item.num
				})
				this.saveConfig(obj)
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
			width: 200rpx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-right:10upx;
		}
		.cell-value {
			flex: 1;
			text-align: right;
			color: $font-color-light;
			/deep/ .uni-input {
				height: 100%;
				padding: 0;
			}
		}
		.cell-tip{
			font-size: $font-base;
			color: $font-color-light;
		}
		switch{
			transform: translateX(16upx) scale(.84);
		}
	}
</style>
