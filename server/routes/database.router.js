import express from 'express';
import { HttpResult } from '../utils/HttpResult.js';
import { User, Work } from '../models/index.js';
import { authMiddleware, userCheckMiddleware } from '../middleware/index.js';

const router = express.Router();

/**
 * @description 获取数据库统计信息
 * @route GET /api/database/stats
 * @access Private (需要登录)
 */
async function getDatabaseStats(req, res) {
    try {
        const userCount = await User.count();
        const workCount = await Work.count();
        
        const stats = {
            tables: {
                user: {
                    name: '用户表',
                    count: userCount,
                    description: '存储用户信息，包括用户名、邮箱、密码等'
                },
                work: {
                    name: '作品表', 
                    count: workCount,
                    description: '存储用户创建的作品信息，包括作品名称、描述、状态等'
                }
            },
            total_records: userCount + workCount,
            last_updated: new Date().toISOString()
        };
        
        res.status(200).json(HttpResult.success({
            data: stats,
            msg: '数据库统计信息获取成功'
        }));
    } catch (error) {
        console.error('获取数据库统计失败:', error);
        res.status(500).json(HttpResult.error({ 
            msg: '获取数据库统计失败',
            error: error.message 
        }));
    }
}

/**
 * @description 获取用户表所有数据
 * @route GET /api/database/users
 * @access Private (需要登录，管理员权限)
 */
async function getAllUsers(req, res) {
    try {
        const { page = 1, pageSize = 50, status, role } = req.query;
        
        const whereClause = {};
        if (status) whereClause.user_status = status;
        if (role) whereClause.user_role = role;
        
        const { count, rows } = await User.findAndCountAll({
            where: whereClause,
            attributes: [
                'user_id', 'username', 'user_email', 'user_avatar', 
                'user_role', 'user_status', 'user_created_at', 'user_updated_at'
            ],
            limit: parseInt(pageSize),
            offset: (parseInt(page) - 1) * parseInt(pageSize),
            order: [['user_created_at', 'DESC']]
        });
        
        res.status(200).json(HttpResult.success({
            data: {
                list: rows,
                pagination: {
                    current: parseInt(page),
                    pageSize: parseInt(pageSize),
                    total: count,
                    totalPages: Math.ceil(count / parseInt(pageSize))
                }
            },
            msg: '用户数据获取成功'
        }));
    } catch (error) {
        console.error('获取用户数据失败:', error);
        res.status(500).json(HttpResult.error({ 
            msg: '获取用户数据失败',
            error: error.message 
        }));
    }
}

/**
 * @description 获取作品表所有数据
 * @route GET /api/database/works
 * @access Private (需要登录，管理员权限)
 */
async function getAllWorks(req, res) {
    try {
        const { page = 1, pageSize = 50, status, user_id } = req.query;
        
        const whereClause = {};
        if (status) whereClause.work_status = status;
        if (user_id) whereClause.user_id = user_id;
        
        const { count, rows } = await Work.findAndCountAll({
            where: whereClause,
            attributes: [
                'work_id', 'work_name', 'work_desc', 'work_prompt_cn', 'work_prompt_en', 'work_guide_desc',
                'user_id', 'work_status', 'work_category_list', 'work_outer_link_list', 'metadata',
                'work_created_at', 'work_updated_at'
            ],
            limit: parseInt(pageSize),
            offset: (parseInt(page) - 1) * parseInt(pageSize),
            order: [['work_created_at', 'DESC']]
        });
        
        res.status(200).json(HttpResult.success({
            data: {
                list: rows,
                pagination: {
                    current: parseInt(page),
                    pageSize: parseInt(pageSize),
                    total: count,
                    totalPages: Math.ceil(count / parseInt(pageSize))
                }
            },
            msg: '作品数据获取成功'
        }));
    } catch (error) {
        console.error('获取作品数据失败:', error);
        res.status(500).json(HttpResult.error({ 
            msg: '获取作品数据失败',
            error: error.message 
        }));
    }
}

/**
 * @description 获取指定表的数据
 * @route GET /api/database/table/:tableName
 * @access Private (需要登录，管理员权限)
 */
async function getTableData(req, res) {
    try {
        const { tableName } = req.params;
        const { page = 1, pageSize = 50 } = req.query;
        
        let model, attributes, include;
        
        switch (tableName.toLowerCase()) {
            case 'user':
            case 'users':
                model = User;
                attributes = [
                    'user_id', 'username', 'user_email', 'user_avatar', 
                    'user_role', 'user_status', 'user_created_at', 'user_updated_at'
                ];
                break;
            case 'work':
            case 'works':
                model = Work;
                attributes = [
                    'work_id', 'work_name', 'work_desc', 'work_prompt_cn', 'work_prompt_en', 'work_guide_desc',
                    'user_id', 'work_status', 'work_tag_list', 'work_outer_link_list', 'metadata',
                    'work_created_at', 'work_updated_at'
                ];
                include = [{
                    model: User,
                    as: 'user',
                    attributes: ['username', 'user_email']
                }];
                break;
            default:
                return res.status(400).json(HttpResult.error({ 
                    msg: '不支持的表名',
                    available_tables: ['user', 'work']
                }));
        }
        
        const { count, rows } = await model.findAndCountAll({
            attributes,
            include,
            limit: parseInt(pageSize),
            offset: (parseInt(page) - 1) * parseInt(pageSize),
            order: [[model.primaryKeyAttributes[0], 'DESC']]
        });
        
        res.status(200).json(HttpResult.success({
            data: {
                table_name: tableName,
                list: rows,
                pagination: {
                    current: parseInt(page),
                    pageSize: parseInt(pageSize),
                    total: count,
                    totalPages: Math.ceil(count / parseInt(pageSize))
                }
            },
            msg: `${tableName}表数据获取成功`
        }));
    } catch (error) {
        console.error('获取表数据失败:', error);
        res.status(500).json(HttpResult.error({ 
            msg: '获取表数据失败',
            error: error.message 
        }));
    }
}

/**
 * @description 导出表数据为JSON格式
 * @route GET /api/database/export/:tableName
 * @access Private (需要登录，管理员权限)
 */
async function exportTableData(req, res) {
    try {
        const { tableName } = req.params;
        const { format = 'json' } = req.query;
        
        let model, attributes;
        
        switch (tableName.toLowerCase()) {
            case 'user':
            case 'users':
                model = User;
                attributes = [
                    'user_id', 'username', 'user_email', 'user_avatar', 
                    'user_role', 'user_status', 'user_created_at', 'user_updated_at'
                ];
                break;
            case 'work':
            case 'works':
                model = Work;
                attributes = [
                    'work_id', 'work_name', 'work_desc', 'work_prompt_cn', 'work_prompt_en', 'work_guide_desc',
                    'user_id', 'work_status', 'work_category_list', 'work_outer_link_list', 'metadata',
                    'work_created_at', 'work_updated_at'
                ];
                break;
            default:
                return res.status(400).json(HttpResult.error({ 
                    msg: '不支持的表名',
                    available_tables: ['user', 'work']
                }));
        }
        
        const data = await model.findAll({
            attributes,
            order: [[model.primaryKeyAttributes[0], 'DESC']]
        });
        
        if (format === 'json') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename="${tableName}_${new Date().toISOString().split('T')[0]}.json"`);
            res.status(200).json(data);
        } else {
            res.status(400).json(HttpResult.error({ 
                msg: '不支持的导出格式',
                supported_formats: ['json']
            }));
        }
    } catch (error) {
        console.error('导出表数据失败:', error);
        res.status(500).json(HttpResult.error({ 
            msg: '导出表数据失败',
            error: error.message 
        }));
    }
}

// 路由定义
router.get('/stats', authMiddleware(), getDatabaseStats);
router.get('/users', authMiddleware(), userCheckMiddleware(), getAllUsers);
router.get('/works', getAllWorks);
router.get('/table/:tableName', authMiddleware(), userCheckMiddleware(), getTableData);
router.get('/export/:tableName', authMiddleware(), userCheckMiddleware(), exportTableData);

export default router;
