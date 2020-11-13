<template>  
   <view class="container">  
		
		<view class="cover-container">
			<uni-list>
				<!-- <uni-list-item title="列表左侧带略缩图" note="列表描述信息" showArrow thumb="https://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png" thumb-size="lg" rightText="" /> -->
				<uni-list-item style="line-height: 1.8;" :title="userInfo.UserName" :note="userInfo.PhoneNum" showArrow to="../userinfo/userinfo" thumb-size="lg" direction="row">
					<template slot="header">
						<image class="slot-image" :src="userInfo.Avatar || defaultAvatar" @error="imageError" style="width:50px;height: 50px;border-radius: 50%;margin-right: 10px;" ></image>
					</template>
				</uni-list-item>
			</uni-list>
			<!-- 浏览历史 -->
			<view class="history-section icon">
				<list-cell v-for="item in cellList.slice(0, 3)"
				:icon="`iconfont ${item.icon}`" 
				:iconColor="item.iconColor"
				:title="item.title" 
				:tips="item.tips"
				@eventClick="navTo(item.url)">
				</list-cell>
			</view>
			<view class="history-section icon">
				<list-cell v-for="item in cellList.slice(3, 6)"
				:icon="`iconfont ${item.icon}`" 
				:iconColor="item.iconColor"
				:title="item.title" 
				:tips="item.tips"
				@eventClick="navTo(item.url)">
				</list-cell>
			</view>
		</view>
    </view>
</template>  
<script>  
	import listCell from '@/components/mix-list-cell';
  import { mapGetters } from 'vuex';
	const defaultAvatar = require('@/static/image/userAvatar.png')
	const cellList = [
		{
			icon: 'iconxiaoxi',
			iconColor: '#e07472',
			title: '我的消息',
			tips: '',
			url: '/pages/notice/notice'
		},{
			icon: 'icontubiaozhizuomoban-1-05',
			iconColor: '#5fcda2',
			title: '我的设备',
			tips: '',
			url: '/pages/device/myDevice'
		},{
			icon: 'iconGroup',
			iconColor: '#9789f7',
			title: '我的数据',
			tips: '',
			url: ''
		},{
			icon: 'iconyijian',
			iconColor: '#ee883b',
			title: '意见反馈',
			tips: '',
			url: '/pages/user/feedback'
		},{
			icon: 'iconshebeishezhi',
			iconColor: '#54b4ef',
			title: '设置',
			tips: '',
			url: '/pages/set/set'
		},{
			icon: 'iconguanyu',
			iconColor: '#795548',
			title: '关于',
			tips: '',
			url: '/pages/user/about'
		}
	]
	
  export default {
		components: {
			listCell
		},
		data(){
			return {
				cellList,
				defaultAvatar
			}
		},
		onLoad(){
			console.log(this.userInfo)
		},
    computed: {
			...mapGetters(['hasLogin','userInfo'])
		},
    methods: {
			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			imageError(err) {
				console.log(err)
			},
			navTo(url){
				if (url) {
					uni.navigateTo({ url })
				} else {
					this.$api.msg('功能正在开发中，敬请期待...')
				}
			}
    }  
    }  
</script>  
<style lang='scss'>
	%flex-center {
	 display:flex;
	 flex-direction: column;
	 justify-content: center;
	 align-items: center;
	}
	%section {
	  display:flex;
	  justify-content: space-around;
	  align-content: center;
	  background: #fff;
	  border-radius: 10upx;
	}

	.cover-container{
		background: $page-color-base;
		position:relative;
		background: #f5f5f5;
	}
	.history-section{
		margin-top: 24upx;
		background: #fff;
	}
	
</style>