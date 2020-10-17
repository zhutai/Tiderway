/**
 * @version 3.0.4
 * @Author lu-ch
 * @Email webwork.s@qq.com
 * 文档: https://www.quanzhan.co/luch-request/
 * github: https://github.com/lei-mu/luch-request
 * DCloud: http://ext.dcloud.net.cn/plugin?id=392
 * HBuilderX: beat-2.7.14 alpha-2.8.0
 */
import store from '@/store'
import Request from '@/utils/luch-request/index.js'

const getTokenStorage = () => {
  let token = ''
  try {
		if (store.state.hasLogin) {
			token = "Bearer " + store.state.userInfo.Token
		} else {
			let userInfo = uni.getStorageSync('userInfo') || {}
			token = userInfo.Token ? ("Bearer " + userInfo.Token) : ''
		}
  } catch (e) {
		console.log(e)
  }
  return token
}

const getImeiStorage = () => {
  let deviceImei = ''
  try {
		if (store.state.deviceImei) {
			deviceImei = store.state.deviceImei
		} else {
			deviceImei = uni.getStorageSync('deviceImei') || ''
		}
  } catch (e) {
		console.log(e)
  }
  return deviceImei
}

const http = new Request()
http.setConfig((config) => { /* 设置全局配置 */
  config.baseURL = 'http://appapi.tiderway.com/' /* 根域名不同 */
  config.header = {
    ...config.header,
		'Content-Type': 'application/x-www-form-urlencoded'
  }
  return config
})

http.interceptors.request.use((config) => { /* 请求之前拦截器。可以使用async await 做异步操作 */
  config.header = {
    ...config.header,
		imei: getImeiStorage() || '',
    Authorization: getTokenStorage()
  }
  /*
	  if (!token) { // 如果token不存在，return Promise.reject(config) 会取消本次请求
		  return Promise.reject(config)
	  }
	*/
  return config
}, (config) => {
  return Promise.reject(config)
})

http.interceptors.response.use(async (response) => { /* 请求之后拦截器。可以使用async await 做异步操作  */
	if (response.statusCode === 200) { // 接口请求成功
		let codes = [0, 100, 200]
		if (codes.includes(response.data.Code)) { // 接口内部状态无异常
			return response.data
		} else {
			console.log(response)
			uni.showToast({
			  icon: 'none',
				position: 'bottom',
			  title: response.data.Message
			});
			return Promise.reject(response)
		}
	} else { // 接口请求异常
		uni.showToast({
		  icon: 'none',
			position: 'bottom',
		  title: '接口请求失败，请刷新重试'
		});
	}
	console.log(response)
}, (response) => { // 请求错误做点什么。可以使用async await 做异步操作
  // console.log(response)
  return Promise.reject(response)
})

export default http
