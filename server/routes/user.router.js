import express from 'express'
import { HttpResult } from '../utils/HttpResult.js'
import { 
    svr_getUserById, 
    svr_createUser, 
    svr_getUserList, 
    svr_updateUser, 
    svr_deleteUser,
    svr_isUsernameExists,
    svr_isEmailExists,
    svr_hashPassword
} from '../services/users.service.js'
import { authMiddleware, adminCheckMiddleware, userCheckMiddleware } from '../middleware/index.js'

const router = express.Router()

// ==================== 用户管理相关接口 ====================

/**
 * @description 获取用户详情
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
function getUserDetailHandler(req, res) {
    let { id } = req.query;
    id = parseInt(id) || 0;
    
    if (!id) {
        res.status(200).json(HttpResult.error({ msg: '用户ID不能为空' }))
        return
    }
    
    let user = svr_getUserById(id);
    if(user){
        // 不返回密码字段
        const { password, ...userInfo } = user;
        res.status(200).json(HttpResult.success({ data: userInfo }));
    }else{
        res.status(200).json(HttpResult.error({ msg: '用户不存在' }))
    }
}

router.get('/getUserDetail', authMiddleware(), getUserDetailHandler)
router.post('/getUserDetail', authMiddleware(), getUserDetailHandler)

/**
 * @description 创建用户
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function createUserHandler(req, res) {
    let user_info = req.body;
    
    if(!user_info.username){
        res.status(200).json(HttpResult.error({ msg: '用户名不能为空' }))
        return
    }
    
    if(!user_info.email){
        res.status(200).json(HttpResult.error({ msg: '邮箱不能为空' }))
        return
    }
    
    if(!user_info.password){
        res.status(200).json(HttpResult.error({ msg: '密码不能为空' }))
        return
    }
    
    // 检查用户名是否已存在
    if(svr_isUsernameExists(user_info.username)){
        res.status(200).json(HttpResult.error({ msg: '用户名已存在' }))
        return
    }
    
    // 检查邮箱是否已存在
    if(svr_isEmailExists(user_info.email)){
        res.status(200).json(HttpResult.error({ msg: '邮箱已存在' }))
        return
    }
    
    try {
        // 加密密码
        const hashedPassword = await svr_hashPassword(user_info.password);
        
        const newUser = svr_createUser({
            ...user_info,
            password: hashedPassword,
            status: user_info.status || 'active',
            role: user_info.role || 'user',
            avatar: user_info.avatar || 'https://via.placeholder.com/32x32/1890ff/ffffff?text=U'
        });
        
        // 不返回密码字段
        const { password, ...userInfo } = newUser;
        
        res.status(200).json(HttpResult.success({
            msg: '用户创建成功',
            data: userInfo
        }))
    } catch (error) {
        res.status(200).json(HttpResult.error({ 
            msg: '用户创建失败: ' + error.message 
        }))
    }
}

router.get('/createUser', authMiddleware(), adminCheckMiddleware(), createUserHandler)
router.post('/createUser', authMiddleware(), adminCheckMiddleware(), createUserHandler)

/**
 * @description 更新用户
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function updateUserHandler(req, res) {
    let user_info = req.body;
    
    if(!user_info.id){
        res.status(200).json(HttpResult.error({ msg: '用户ID不能为空' }))
        return
    }
    
    if(!user_info.username){
        res.status(200).json(HttpResult.error({ msg: '用户名不能为空' }))
        return
    }
    
    if(!user_info.email){
        res.status(200).json(HttpResult.error({ msg: '邮箱不能为空' }))
        return
    }
    
    // 检查用户是否存在
    const existingUser = svr_getUserById(user_info.id);
    if(!existingUser){
        res.status(200).json(HttpResult.error({ msg: '用户不存在' }))
        return
    }
    
    // 检查用户名是否已被其他用户使用
    if(svr_isUsernameExists(user_info.username, user_info.id)){
        res.status(200).json(HttpResult.error({ msg: '用户名已存在' }))
        return
    }
    
    // 检查邮箱是否已被其他用户使用
    if(svr_isEmailExists(user_info.email, user_info.id)){
        res.status(200).json(HttpResult.error({ msg: '邮箱已存在' }))
        return
    }
    
    try {
        let updateData = { ...user_info };
        
        // 如果提供了新密码，则加密
        if(user_info.password && user_info.password.trim() !== ''){
            updateData.password = await svr_hashPassword(user_info.password);
        } else {
            // 不更新密码
            delete updateData.password;
        }
        
        svr_updateUser(user_info.id, updateData);
        
        // 获取更新后的用户信息
        const updatedUser = svr_getUserById(user_info.id);
        const { password, ...userInfo } = updatedUser;
        
        res.status(200).json(HttpResult.success({
            msg: '用户更新成功',
            data: userInfo
        }))
    } catch (error) {
        res.status(200).json(HttpResult.error({ 
            msg: '用户更新失败: ' + error.message 
        }))
    }
}

router.get('/updateUser', authMiddleware(), userCheckMiddleware(), updateUserHandler)
router.post('/updateUser', authMiddleware(), userCheckMiddleware(), updateUserHandler)

/**
 * @description 获取用户列表
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
function getUserListHandler(req, res) {
    let { 
        username, 
        email, 
        role, 
        status, 
        page = 1, 
        pageSize = 10 
    } = req.query;
    
    let user_list = svr_getUserList({
        username: username || '',
        email: email || '',
        role: role || '',
        status: status || '',
        page: parseInt(page) || 1,
        pageSize: parseInt(pageSize) || 10
    });
    
    // 移除密码字段
    user_list.list = user_list.list.map(user => {
        const { password, ...userInfo } = user;
        return userInfo;
    });
    
    res.status(200).json(HttpResult.success({
        data: user_list
    }))
}

router.get('/getUserList', authMiddleware(), adminCheckMiddleware(), getUserListHandler)
router.post('/getUserList', authMiddleware(), adminCheckMiddleware(), getUserListHandler)

/**
 * @description 删除用户
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
function deleteUserHandler(req, res) {
    let { id } = req.query;
    id = parseInt(id) || 0;
    
    if(!id){
        res.status(200).json(HttpResult.error({ msg: '用户ID不能为空' }))
        return
    }
    
    let user = svr_getUserById(id);
    if(user){
        // 不允许删除admin用户
        if(user.username === 'admin'){
            res.status(200).json(HttpResult.error({ msg: '不能删除管理员用户' }))
            return
        }
        
        svr_deleteUser(id);
        res.status(200).json(HttpResult.success({
            msg: "用户删除成功"
        }))
    }else{
        res.status(200).json(HttpResult.error({ msg: '用户不存在' }))
    }
}

router.get('/deleteUser', authMiddleware(), adminCheckMiddleware(), deleteUserHandler)
router.post('/deleteUser', authMiddleware(), adminCheckMiddleware(), deleteUserHandler)

/**
 * @description 批量删除用户
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
function batchDeleteUsersHandler(req, res) {
    let { ids } = req.body;
    
    if(!ids || !Array.isArray(ids) || ids.length === 0){
        res.status(200).json(HttpResult.error({ msg: '请选择要删除的用户' }))
        return
    }
    
    let successCount = 0;
    let failCount = 0;
    
    ids.forEach(id => {
        const user = svr_getUserById(id);
        if(user && user.username !== 'admin'){
            svr_deleteUser(id);
            successCount++;
        } else {
            failCount++;
        }
    });
    
    res.status(200).json(HttpResult.success({
        msg: `批量删除完成，成功删除${successCount}个用户，失败${failCount}个用户`
    }))
}

router.post('/batchDeleteUsers', authMiddleware(), adminCheckMiddleware(), batchDeleteUsersHandler)

// ==================== 用户信息相关接口 ====================

/**
 * @description 获取当前用户信息
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
router.get('/info', authMiddleware(), (req, res) => {
    // 从中间件获取用户信息
    const user = svr_getUserById(req.user.id);
    if(!user){
        res.status(200).json(HttpResult.error({ msg: '用户不存在' }))
        return
    }
    res.status(200).json(HttpResult.success({
        data: {
            userInfo: {
                name: user.username,
                email: user.email,
                avatar: user.avatar
            },
            roles: [user.role]
        }
    }))
})

export default router
