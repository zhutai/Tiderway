import Vue from 'vue'
import Vuex from 'vuex'
import { getDeviceList } from "@/api/device.js"

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		deviceEmpey: false,
		deviceImei: '',
		hasLogin: false,
		userInfo: {},
	},
	getters: {
		hasLogin: state => {
			return state.hasLogin
		},
		deviceImei: state => {
			return state.deviceImei
		},
		userInfo: state => {
			return state.userInfo
		}
	},
	mutations: {
		login(state, provider) {
			state.hasLogin = true;
			state.userInfo = provider;
			uni.setStorage({ //缓存用户登陆状态
				key: 'userInfo',  
				data: provider  
			})
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = {};
			state.deviceImei = '';
			uni.removeStorage({  
				key: 'userInfo'  
			})
		},
		setDeviceImei(state, { deviceImei, imeiLength }) {
			state.deviceImei = deviceImei
			state.deviceEmpey = !imeiLength
			uni.setStorage({ //缓存用户登陆状态
				key: 'deviceImei',  
				data: deviceImei  
			})
		}
	},
	actions: {
		getDeviceList() {
			
		}
	}
})

export default store
