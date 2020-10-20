/**
 * 定位相关api
 */
import http from '@/api/service.js'
import config from '@/config.js'
const VERSION = config.VERSION

/**
 * 获取定位
 * @param {Object} data - 获取定位  
 */
export const monitor = (data) => {
  return http.post(`${VERSION}/location/monitor`, data)
}