/**
 * 用户相关api
 */
import http from '@/api/service.js'
import config from '@/config.js'
const VERSION = config.VERSION

/**
 * 用户注册
 * @param {Object} params - 注册参数  
 */
export const register = (data) => {
  return http.post(`${VERSION}/User/register`, data)
}

/**
 * 用户登录
 * @param {Object} params - 用户登录  
 */
export const login = (data) => {
  return http.post(`${VERSION}/User/login`, data)
}

/**
 * 发送验证码
 * @param {Object} params - 发送验证码  
 */
export const sendCode = (data) => {
  return http.post(`${VERSION}/User/sendCode`, data)
}

/**
 * 找回密码
 * @param {Object} params - 找回密码  
 */
export const findPwd = (data) => {
  return http.post(`${VERSION}/User/findPwd`, data)
}

/**
 * 修改密码
 * @param {Object} params - 修改密码  
 */
export const editPwd = (data) => {
  return http.post(`${VERSION}/User/editPwd`, data)
}

/**
 * 系统消息列表
 * @param {Object} params - 系统消息列表  
 */
export const getNoticeList = (data) => {
  return http.post(`${VERSION}/Notice/list`, data)
}
