/**
 *  预警相关api
 */
import http from '@/api/service.js'
import config from '@/config.js'
const VERSION = config.VERSION


/**
 * 获取预警阈值配置 当前选择设备绑定的用户
 * @param {Object} data - 获取预警阈值配置  
 */
export const getConfig = (data) => {
  return http.post(`${VERSION}/Alarm/getConfig`, data)
}

/**
 * 保存预警阈值
 * @param {Object} data - 保存预警阈值
 */
export const saveConfig = (data) => {
  return http.post(`${VERSION}/Alarm/saveConfig`, data)
}

/**
 * 处理预警消息
 * @param {Object} data - 处理预警消息
 */
export const alarmHandle = (data) => {
  return http.post(`${VERSION}/Alarm/handle`, data)
}

/**
 * 清除预警消息
 * @param {Object} data - 清除预警消息
 */
export const alarmClear = (data) => {
  return http.post(`${VERSION}/Alarm/clear`, data)
}

/**
 * 获取预警列表
 * @param {Object} data - 获取预警列表
 */
export const getAlarmList = (data) => {
  return http.post(`${VERSION}/Alarm/list`, data)
}

/**
 * 批量清除预警消息
 * @param {Object} data - 批量清除预警消息
 */
export const batchClear = (data) => {
  return http.post(`${VERSION}/Alarm/batchClear`, data)
}

/**
 * 批量处理预警消息
 * @param {Object} data - 批量处理预警消息
 */
export const batchHandle = (data) => {
  return http.post(`${VERSION}/Alarm/batchHandle`, data)
}
