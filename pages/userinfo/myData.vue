<template>
	<view class="container">
		<view class="list-cell b-b m-t" hover-class="cell-hover" :hover-stay-time="50" @click="actionSheetTap">
			<text class="cell-tit">性别</text>
			<text class="cell-tip">{{ userData.Sex ? '男' : '女' }}</text>
			<uni-icons type="arrowright" size="18" color="#909399" />
			<!-- 0女  1男 -->
		</view>
		<view class="list-cell b-b" hover-class="cell-hover" :hover-stay-time="50">
			<picker class="cell-tit" mode="date" :value="birthDate" :start="startDate" :end="endDate" @change="bindDateChange">
				<view style="display: flex;">
					<text class="cell-tit">出生年月</text>
					<text class="cell-tip">{{ userData.BirthDate }}</text>
				</view>
			</picker>
			<uni-icons type="arrowright" size="18" color="#909399" />
		</view>
		<view class="list-cell b-b" hover-class="cell-hover" :hover-stay-time="50" @click="handleChange('Height')">
			<text class="cell-tit">身高</text>
			<text class="cell-tip">{{ userData.Height }}cm</text>
			<uni-icons type="arrowright" size="18" color="#909399" />
		</view>
		<view class="list-cell" hover-class="cell-hover" :hover-stay-time="50" @click="handleChange('Weight')">
			<text class="cell-tit">体重</text>
			<text class="cell-tip">{{ userData.Weight }}Kg</text>
			<uni-icons type="arrowright" size="18" color="#909399" />
		</view>
		<uni-popup id="dialogInput" ref="dialogInput" type="dialog">
			<uni-popup-dialog mode="input" :title="titleName" :value="inputValue" placeholder="请输入内容" @confirm="dialogInputConfirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import permision from "@/utils/permission.js"
	import { getUserInfo, setMyData } from "@/api/user.js"
	import { mapState, mapMutations } from 'vuex';
	import { dateRangeUtils } from '@/common/util.js'
	export default {
		data() {
			let date = dateRangeUtils.getDateRange(new Date(), 0, true)
			return {
				imageList: [],
				avartImageUrl: '',
				inputValue: '',
				userData: {},
				birthDate: '',
				titleName: '',
				endDate: date.endTime,
				startDate: '1900-01-01',
			};
		},
		computed:{
			...mapState(['userInfo']),
		},
		onLoad() {
			getUserInfo({}).then(res => {
				console.log(res)
				this.userData = res.Data
			})
		},
		methods:{
			...mapMutations(['login', 'logout']),
			navTo(url){
				uni.navigateTo({ url })
			},
			//switch
			switchChange(e){
				let statusTip = e.detail.value ? '打开': '关闭';
				this.$api.msg(`${statusTip}消息推送`);
			},
			handleChange(value) {
				this.selectCellValue = value
				this.inputValue = this.userData[value]
				if (value === 'Height') {
					this.titleName = '编辑身高'
				} else {
					this.titleName = '编辑体重'
				}
				this.$refs.dialogInput.open()
			},
			updateMyData() {
				let obj = Object.assign({} , this.userData)
				setMyData(obj).then(res => {
					uni.showToast({
						title: '修改成功'
					})
				})
			},
			bindDateChange(e) {
				let time = e.detail.value
				this.birthDate = time
				this.userData.BirthDate = time
				this.updateMyData()
			},
 			actionSheetTap() {
				uni.showActionSheet({
					title:'性别',
					itemList: ['男', '女'],
					success: (e) => {
						let index = e.tapIndex
						console.log(e.tapIndex);
						this.userData.Sex = Number(!index)
						this.updateMyData()
					}
				})
			},
			async dialogInputConfirm(done, val) {
				if (val) {
					this.inputValue = val
					done()
					let value = this.selectCellValue
					this.userData[value] = val
					this.updateMyData()
				} else {
					done()
				}
			},
			jumpPws() {
				uni.navigateTo({
					url: '/pages/public/forget'
				})
			},
			confirmButton() {
				this.logout();
				setTimeout(()=>{
					uni.reLaunch({
						url: '/pages/public/login',
						fail(err) {
							console.log(err)
						}
					})
				}, 200)
			}
		}
	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
	}
	
	.slot-image {
		display: block;
		margin-right: 10px;
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}
	
	.list-cell{
		display:flex;
		align-items:center;
		padding: 20upx $page-row-spacing;
		line-height:60upx;
		position:relative;
		background: #fff;
		justify-content: center;
		&.log-out-btn{
			margin-top: 40upx;
			.cell-tit{
				color: $font-color-spec;
				text-align: center;
				margin-right: 0;
			}
		}
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
			flex: 1;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-right:10upx;
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
