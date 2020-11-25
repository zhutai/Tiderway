/**
 * 设备相关api
 */
import http from '@/api/service.js'
import config from '@/config.js'
const VERSION = config.VERSION


/**
 * 获取设备列表
 * @param {Object} data - 获取设备列表  
 */
export const getDeviceList = (data) => {
  return http.post(`${VERSION}/Device/deviceList`, data)
}

/**
 * 获取用户健康信息
 * @param {Object} data - 获取用户健康信息  
 */
export const getHealthInfo = (data) => {
  return http.post(`${VERSION}/Device/healthInfo`, data)
}

/**
 * 获取用户设备信息
 * @param {Object} data - 获取用户设备信息  
 */
export const getDeviceInfo = (data) => {
  return http.post(`${VERSION}/Device/deviceInfo`, data)
}

/**
 * 绑定设备
 * @param {Object} data - 绑定设备  
 */
export const bindDevice = (data) => {
  return http.post(`${VERSION}/Device/bind`, data)
}

/**
 * 解绑设备
 * @param {Object} data - 解绑设备  
 */
export const unBindDevice = (path, data) => {
	
  return http.post(`${VERSION}/Device/unBind`, data)
}

/**
 * 获取设备Token
 * @param {Object} data - 获取设备Token  
 */
export const getDeviceToken = (path, data) => {
  return http.post(`${VERSION}/Device/token`, data)
}

/**
 * 设备监控
 * @param {Object} data - 设备健康
 */
export const monitor = (path,data) => {
  return http.post(`${VERSION}/Device​/monitor`, data)
}
