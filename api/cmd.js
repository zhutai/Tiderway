/**
 *  指令相关api
 */
import http from '@/api/service.js'
import config from '@/config.js'
const VERSION = config.VERSION


/**
 * 获取指令列表
 * @param {Object} data - 获取指令列表  
 */
export const getCmdList = (data) => {
  return http.post(`${VERSION}/Cmd/list`, data)
}

/**
 * 下发指令
 * @param {Object} data - 下发指令  
 */
export const setCmdSend = (data) => {
  return http.post(`${VERSION}/Cmd/send`, data)
}

/**
 * 获取指令现有参数
 * @param {Object} data - 获取指令现有参数  
 */
export const getCmdCodeVlaue = (data) => {
  return http.post(`${VERSION}/Cmd/value`, data)
}
