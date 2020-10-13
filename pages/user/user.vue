<template>  
   <view class="container">  
		
		<view class="cover-container">
			<uni-list>
				<!-- <uni-list-item title="列表左侧带略缩图" note="列表描述信息" showArrow thumb="https://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png" thumb-size="lg" rightText="" /> -->
				<uni-list-item style="line-height: 1.8;" :title="userInfo.LoginName" :note="userInfo.UserName" showArrow thumb="../../static/missing-face.png" to="../userinfo/userinfo" thumb-size="lg" />
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
  import { mapState } from 'vuex';
	
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
			url: '/pages/set/set'
		},{
			icon: 'iconGroup',
			iconColor: '#9789f7',
			title: '我的数据',
			tips: '',
			url: '/pages/set/set'
		},{
			icon: 'iconyijian',
			iconColor: '#ee883b',
			title: '意见反馈',
			tips: '',
			url: '/pages/set/set'
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
			url: '/pages/set/set'
		},
	]
	
	let startY = 0, moveY = 0, pageAtTop = true;
    export default {
		components: {
			listCell
		},
		data(){
			return {
				cellList,
				coverTransform: 'translateY(0px)',
				coverTransition: '0s',
				moving: false,
			}
		},
		onLoad(){
		},
		// #ifndef MP
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if (index === 0) {
				this.navTo('/pages/set/set');
			}else if(index === 1){
				// #ifdef APP-PLUS
				const pages = getCurrentPages();
				const page = pages[pages.length - 1];
				const currentWebview = page.$getAppWebview();
				currentWebview.hideTitleNViewButtonRedDot({
					index
				});
				// #endif
				uni.navigateTo({
					url: '/pages/notice/notice'
				})
			}
		},
		// #endif
    computed: {
			...mapState(['hasLogin','userInfo'])
		},
    methods: {
			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			navTo(url){
				// if(!this.hasLogin){
				// 	url = '/pages/public/login';
				// }
				uni.navigateTo({ url })  
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
		/* margin-top: -150upx; */
		/* padding: 0 30upx; */
		position:relative;
		background: #f5f5f5;
		/* padding-bottom: 20upx; */
		.arc{
			position:absolute;
			left: 0;
			top: -34upx;
			width: 100%;
			height: 36upx;
		}
	}
	.history-section{
		/* padding: 30upx 0 0; */
		margin-top: 24upx;
		/* margin-top: 20upx; */
		background: #fff;
		/* border-radius:10upx; */
		.sec-header{
			display:flex;
			align-items: center;
			font-size: $font-base;
			color: $font-color-dark;
			line-height: 40upx;
			margin-left: 30upx;
			.yticon{
				font-size: 44upx;
				color: #5eba8f;
				margin-right: 16upx;
				line-height: 40upx;
			}
		}
		.h-list{
			white-space: nowrap;
			padding: 30upx 30upx 0;
			image{
				display:inline-block;
				width: 160upx;
				height: 160upx;
				margin-right: 20upx;
				border-radius: 10upx;
			}
		}
	}
	
</style>