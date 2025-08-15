/**
 * 企业微信机器人通知工具
 */

const WEBHOOK_URL = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=3dfe1462-813c-4c48-845d-8e5bf7cfd9e'

/**
 * 发送企业微信机器人通知
 * @param {string} content - 通知内容
 * @param {string} type - 消息类型 (text, markdown, news)
 * @param {object} options - 其他选项
 */
export const sendWechatNotification = async (content, type = 'text', options = {}) => {
  try {
    const message = {
      msgtype: type,
      [type]: type === 'text' ? { content } : content
    }

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    })

    const result = await response.json()
    
    if (result.errcode === 0) {
      console.log('企业微信通知发送成功')
      return true
    } else {
      console.error('企业微信通知发送失败:', result.errmsg)
      return false
    }
  } catch (error) {
    console.error('企业微信通知发送异常:', error)
    return false
  }
}

/**
 * 发送文本通知
 * @param {string} content - 通知内容
 */
export const sendTextNotification = (content) => {
  return sendWechatNotification(content, 'text')
}

/**
 * 发送Markdown通知
 * @param {string} content - Markdown格式内容
 */
export const sendMarkdownNotification = (content) => {
  return sendWechatNotification(content, 'markdown')
}

/**
 * 发送部署完成通知
 * @param {string} projectName - 项目名称
 * @param {string} environment - 环境
 * @param {string} status - 状态
 */
export const sendDeployNotification = (projectName, environment, status) => {
  const content = `**Deployment Notification**\n\n` +
    `**Project:** ${projectName}\n` +
    `**Environment:** ${environment}\n` +
    `**Status:** ${status}\n` +
    `**Time:** ${new Date().toISOString()}\n` +
    `**User:** System`
  
  return sendMarkdownNotification(content)
}

/**
 * 发送配置更新通知
 * @param {string} configType - 配置类型
 * @param {string} details - 更新详情
 */
export const sendConfigUpdateNotification = (configType, details) => {
  const content = `**Configuration Update**\n\n` +
    `**Type:** ${configType}\n` +
    `**Details:** ${details}\n` +
    `**Time:** ${new Date().toISOString()}\n` +
    `**User:** System`
  
  return sendMarkdownNotification(content)
}

export default {
  sendWechatNotification,
  sendTextNotification,
  sendMarkdownNotification,
  sendDeployNotification,
  sendConfigUpdateNotification
}
