/**
 * 商品相关api
 */
import http from '@/api/service.js'
const VERSION = '1.0'
/**
 * 用户注册
 * @param {Object} params - 注册参数  
 */
export const register = (data) => {
  return http.post(`${VERSION}/User/register`, data)
}
