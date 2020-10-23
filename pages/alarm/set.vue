<template>
	<view class="container">
		<view class="list-cell m-t" @click="actionSheetTap">
			<text class="cell-tit">预警方式</text>
			<view class="cell-value">{{ alarmTypeOptions[alarmTypeIndex].value }}</view>
			<text class="cell-more yticon icon-you"></text>
		</view>
		
		<view class="list-cell" v-for="(item, index) in cellList" :key="index"
			:class="{ 'm-t': item.space, 'b-b': item.isBorder }" @click="handleClick(item, index)">
			<text class="cell-tit">{{ item.label }}</text>
			<view class="cell-value">
				<picker @change="bindPickerChange" :value="item.index" :range="item.options">
					<view class="uni-input">{{ item.num + item.unit }}</view>
				</picker>
			</view>
			<text class="cell-more yticon icon-you"></text>
		</view>
		
	</view>
</template>

<script>
	import { mapMutations } from 'vuex';
	
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
			key: 'alarmType',
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
			key: 'alarmType',
			options: []
		},
		{
			label: '舒张压低值',
			space: true,
			isBorder: true,
			min: 60,
			max: 90,
			num: 80,
			index: 30,
			unit: 'mmHg',
			key: 'alarmType',
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
			key: 'alarmType',
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
			key: 'alarmType',
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
			key: 'alarmType',
			options: []
		},
		{
			label: '辐射低值',
			space: true,
			isBorder: true,
			min: 60,
			max: 90,
			num: 80,
			index: 26,
			unit: 'µSv/h',
			key: 'alarmType',
			options: []
		},
		{
			label: '辐射高值',
			space: false,
			isBorder: false,
			min: 60,
			max: 90,
			num: 80,
			index: 27,
			unit: 'µSv/h',
			key: 'alarmType',
			options: []
		},
	]
	
	const alarmTypeOptions = [{
		key: 1,
		value: '声音'
	}, {
		key: 2,
		value: '推送'
	}, {
		key: 3,
		value: '短信'
	}]
	
	export default {
		data() {
			return {
				cellList,
				activeIndex: 0,
				alarmTypeIndex: 0,
				alarmTypeOptions
			};
		},
		methods:{
			...mapMutations(['logout']),
			handleClick(item, index) {
				this.activeIndex = index
				if (item.options.length === 0) {
					let array = []
					for(let i = item.min; i <= item.max; i++) {
						array.push(i)
					}
					item.options = array
				}
				let findIndex = item.options.findIndex(list => list == item.num)
				item.index = findIndex
			},
			actionSheetTap(item) {
				let itemLlst = this.alarmTypeOptions.map(item => item.value)
				uni.showActionSheet({
					title:'选择预警方式',
					itemList: itemLlst,
					success: (e) => {
						let tapIndex = e.tapIndex
						this.alarmTypeIndex = tapIndex
					}
				})
			},
			bindPickerChange(e) {
				let index = e.detail.value
				let activeIndex = this.activeIndex
				this.cellList.forEach((item, listIndex) => {
					if (activeIndex === listIndex) {
						item.num = item.options[index]
						item.index = index
					}
				})
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
