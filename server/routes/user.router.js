import express from 'express';
import * as UserService from '../services/User.service.js';
import { getReqParam, HttpResult } from '../utils/HttpResult.js';

const router = express.Router();

/**
 * @description 获取用户列表
 */
router.get('/list', async (req, res) => {
    const {
        username,
        user_email,
        user_role,
        user_status,
        user_real_name,
        user_phone,
        page = 1,
        pageSize = 10
    } = req.query;

    const result = await UserService.svr_getUserList({
        username,
        user_email,
        user_role,
        user_status,
        user_real_name,
        user_phone,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
    });


    res.json(HttpResult.success(result));
});

/**
 * @description 根据ID获取用户详情
 */
router.get('/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const user = await UserService.svr_getUserById(userId);
        
        res.json(HttpResult.success({
            data: user
        }));
    } catch (error) {
        console.error('获取用户详情失败:', error);
        res.json(HttpResult.error('获取用户详情失败: ' + error.message));
    }
});

/**
 * @description 创建或更新用户
 */
async function upsertUserHandler(req, res){
    let user_id = getReqParam(req, 'id');

    let old_user = await UserService.svr_getUserById(user_id);
    if(old_user){
        await UserService.svr_updateUser(user_id, req.body);
        res.json(HttpResult.success({
            message: '用户创建成功',
        }));
    }else{
        await UserService.svr_createUser(req.body);
        res.json(HttpResult.success({
            message: '用户更新成功',
        }));
    }

}

router.get('/upsertUser', upsertUserHandler);
router.post('/upsertUser', upsertUserHandler);
/**
 * @description 创建用户
 */
router.post('/', async (req, res) => {
    try {
        const {
            username,
            password,
            email,
            realName,
            phone,
            role,
            status
        } = req.body;

        // 验证必填字段
        if (!username || !password || !email) {
            return res.json(HttpResult.error('用户名、密码和邮箱为必填项'));
        }

        // 检查用户名是否已存在
        const isUsernameExists = await UserService.svr_isUsernameExists(username);
        if (isUsernameExists) {
            return res.json(HttpResult.error('用户名已存在'));
        }

        // 检查邮箱是否已存在
        const isEmailExists = await UserService.svr_isEmailExists(email);
        if (isEmailExists) {
            return res.json(HttpResult.error('邮箱已存在'));
        }

        // 创建用户
        const userData = {
            username,
            password,
            user_email: email,
            user_real_name: realName,
            user_phone: phone,
            user_role: role || 'sales',
            user_status: status || 'active'
        };

        const newUser = await UserService.svr_createUser(userData);
        
        res.json(HttpResult.success({
            message: '用户创建成功',
            user: {
                id: newUser.user_id,
                account: newUser.username,
                role: newUser.user_role,
                realName: newUser.user_real_name,
                phone: newUser.user_phone,
                email: newUser.user_email,
                status: newUser.user_status
            }
        }));
    } catch (error) {
        console.error('创建用户失败:', error);
        res.json(HttpResult.error('创建用户失败: ' + error.message));
    }
});

/**
 * @description 更新用户
 */
router.put('/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const {
            username,
            email,
            realName,
            phone,
            role,
            status
        } = req.body;

        // 检查用户是否存在
        const existingUser = await UserService.svr_getUserById(userId);
        if (!existingUser) {
            return res.json(HttpResult.error('用户不存在'));
        }

        // 检查用户名是否已被其他用户使用
        if (username && username !== existingUser.username) {
            const isUsernameExists = await UserService.svr_isUsernameExists(username, userId);
            if (isUsernameExists) {
                return res.json(HttpResult.error('用户名已存在'));
            }
        }

        // 检查邮箱是否已被其他用户使用
        if (email && email !== existingUser.user_email) {
            const isEmailExists = await UserService.svr_isEmailExists(email, userId);
            if (isEmailExists) {
                return res.json(HttpResult.error('邮箱已存在'));
            }
        }

        // 更新用户数据
        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.user_email = email;
        if (realName !== undefined) updateData.user_real_name = realName;
        if (phone !== undefined) updateData.user_phone = phone;
        if (role) updateData.user_role = role;
        if (status) updateData.user_status = status;

        const updatedUser = await UserService.svr_updateUser(userId, updateData);
        
        res.json(HttpResult.success({
            message: '用户更新成功',
            user: {
                id: updatedUser.user_id,
                account: updatedUser.username,
                role: updatedUser.user_role,
                realName: updatedUser.user_real_name,
                phone: updatedUser.user_phone,
                email: updatedUser.user_email,
                status: updatedUser.user_status
            }
        }));
    } catch (error) {
        console.error('更新用户失败:', error);
        res.json(HttpResult.error('更新用户失败: ' + error.message));
    }
});

/**
 * @description 删除用户
 */
router.delete('/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        
        // 检查用户是否存在
        const existingUser = await UserService.svr_getUserById(userId);
        if (!existingUser) {
            return res.json(HttpResult.error('用户不存在'));
        }

        // 不允许删除管理员用户
        if (existingUser.user_role === 'admin') {
            return res.json(HttpResult.error('不能删除管理员用户'));
        }

        await UserService.svr_deleteUser(userId);
        
        res.json(HttpResult.success({
            message: '用户删除成功'
        }));
    } catch (error) {
        console.error('删除用户失败:', error);
        res.json(HttpResult.error('删除用户失败: ' + error.message));
    }
});

/**
 * @description 切换用户状态（冻结/解冻）
 */
router.patch('/:id/status', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const { status } = req.body;

        if (!status) {
            return res.json(HttpResult.error('状态参数不能为空'));
        }

        // 检查用户是否存在
        const existingUser = await UserService.svr_getUserById(userId);
        if (!existingUser) {
            return res.json(HttpResult.error('用户不存在'));
        }

        const updatedUser = await UserService.svr_toggleUserStatus(userId, status);
        
        res.json(HttpResult.success({
            message: `用户${status === 'active' ? '解冻' : '冻结'}成功`,
            user: {
                id: updatedUser.user_id,
                account: updatedUser.username,
                status: updatedUser.user_status
            }
        }));
    } catch (error) {
        console.error('切换用户状态失败:', error);
        res.json(HttpResult.error('切换用户状态失败: ' + error.message));
    }
});

/**
 * @description 批量删除用户
 */
router.delete('/batch', async (req, res) => {
    try {
        const { userIds } = req.body;

        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return res.json(HttpResult.error('用户ID列表不能为空'));
        }

        // 检查是否包含管理员用户
        const adminUsers = await UserService.svr_getUserList({
            user_role: 'admin',
            page: 1,
            pageSize: 1000
        });

        const adminIds = adminUsers.list.map(user => user.user_id);
        const hasAdmin = userIds.some(id => adminIds.includes(id));
        
        if (hasAdmin) {
            return res.json(HttpResult.error('不能删除管理员用户'));
        }

        const result = await UserService.svr_batchDeleteUsers(userIds);
        
        res.json(HttpResult.success({
            message: `成功删除${result}个用户`
        }));
    } catch (error) {
        console.error('批量删除用户失败:', error);
        res.json(HttpResult.error('批量删除用户失败: ' + error.message));
    }
});

/**
 * @description 导出用户数据
 */
router.get('/export', async (req, res) => {
    try {
        const {
            username,
            user_email,
            user_role,
            user_status,
            user_real_name,
            user_phone
        } = req.query;

        // 构建查询条件
        const whereClause = {};
        if (username) {
            whereClause.username = { [UserService.sequelize.Op.like]: `%${username}%` };
        }
        if (user_email) {
            whereClause.user_email = { [UserService.sequelize.Op.like]: `%${user_email}%` };
        }
        if (user_role && user_role !== 'all') {
            whereClause.user_role = user_role;
        }
        if (user_status && user_status !== 'all') {
            whereClause.user_status = user_status;
        }
        if (user_real_name) {
            whereClause.user_real_name = { [UserService.sequelize.Op.like]: `%${user_real_name}%` };
        }
        if (user_phone) {
            whereClause.user_phone = { [UserService.sequelize.Op.like]: `%${user_phone}%` };
        }

        const exportData = await UserService.svr_exportUsers({ where: whereClause });
        
        res.json(HttpResult.success({
            data: exportData,
            message: '导出成功'
        }));
    } catch (error) {
        console.error('导出用户数据失败:', error);
        res.json(HttpResult.error('导出用户数据失败: ' + error.message));
    }
});

export default router;
