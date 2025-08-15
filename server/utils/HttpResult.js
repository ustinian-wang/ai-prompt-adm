/**
 * @typedef {Object} HttpResult
 * @property {number} code? 状态码  
 * @property {string} msg? 消息
 * @property {boolean} success? 是否成功
 * @property {any} data? 数据
 */
/**
 * @description  成功返回
 * @param {HttpResult} result 数据
 * @returns {HttpResult}
 */
function success(result){
    return { 
        code: 200, 
        msg: "请求成功",
        success: true,
        ...result
     }
}

/**
 * @description 错误返回
 * @param {string} msg 
 * @param {any} data 
 * @returns {HttpResult}
 */
function error(result){
    return { 
        msg: "网络异常，请稍后再试",
        success: false,
        ...result
     }
}

export const HttpResult = {
    success,
    error
}