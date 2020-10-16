/**
 * 健康和辐射图表历史数据相关api
 */
import http from '@/api/service.js'
import config from '@/config.js'
const VERSION = config.VERSION

/**
 * 用户注册
 * @param {Object} data - 注册参数  
 */
export const BloodHistory = (data) => {
  return http.post(`${VERSION}/History/BloodHistory`, data)
}

/**
 * 用户登录
 * @param {Object} data - 用户登录  
 */
export const StepHistory = (data) => {
  return http.post(`${VERSION}/History/StepHistory`, data)
}

/**
 * 发送验证码
 * @param {Object} data - 发送验证码  
 */
export const HeartHistory = (data) => {
  return http.post(`${VERSION}/History/HeartHistory`, data)
}

/**
 * 修改密码
 * @param {Object} data - 修改密码  
 */
export const RadioHistory = (data) => {
  return http.post(`${VERSION}/History/RadioHistory`, data)
}

/**
 * 修改密码
 * @param {Object} data - 修改密码  
 */
export const getHistoryData = (path, data) => {
  return http.post(`${VERSION}/History/${path}`, data)
}
