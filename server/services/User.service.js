import User from '../models/User.model.js';
import bcrypt from 'bcryptjs';

/**
 * @description 初始化默认管理员用户
 */
export async function svr_initDefaultUser() {
    try {
        const username = "admin";
        const password = "123456";
        const email = "admin@example.com";
        const avatar = "https://via.placeholder.com/32x32/1890ff/ffffff?text=A";

        // 检查用户是否已存在
        const existingUser = await svr_getUserByUsername(username);
        if (existingUser) {
            return;
        }

        // 创建新用户
        await svr_createUser({
            username,
            password,
            email,
            avatar,
            user_role: 'admin',
            user_status: 'active'
        });
    } catch (error) {
        console.error('初始化默认用户失败:', error);
        throw error;
    }
}

/**
 * @description 获取mock用户数据
 * @returns 
 */
export function svr_getUserDetailMock() {
    return {
        id: 0,
        username: 'admin',
        email: 'admin@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        avatar: 'https://via.placeholder.com/32x32/1890ff/ffffff?text=A',
        role: 'admin',
        status: 'active',
        create_at: Date.now(),
        update_at: Date.now()
    }
}

/**
 * @description 根据用户ID获取用户详情
 * @param {number} userId 
 * @returns 
 */
export async function svr_getUserById(userId) {
    const user = await User.findByUserId(userId, {
        attributes: { exclude: ['user_password'] }
    });
    return user?.dataValues;
}

/**
 * @description 根据用户名获取用户详情
 * @param {string} username 
 * @returns 
 */
export async function svr_getUserByUsername(username) {
    try {
        const user = await User.findByUsername(username);
        return user;
    } catch (error) {
        console.error('根据用户名获取用户失败:', error);
        throw error;
    }
}

/**
 * @description 更新用户详情
 * @param {number} userId 
 * @param {object} userData 
 * @returns 
 */
export async function svr_updateUser(userId, userData) {
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('用户不存在');
        }

        // 如果更新密码，需要重新加密
        if (userData.user_password) {
            userData.user_password = await bcrypt.hash(userData.user_password, 10);
        }

        await user.update(userData);
        return user;
    } catch (error) {
        console.error('更新用户失败:', error);
        throw error;
    }
}

/**
 * @description 创建用户详情
 * @param {object} userData 
 * @returns 
 */
export async function svr_createUser(userData) {
    try {
        const newUser = await User.create(userData);
        // 返回用户信息时不包含密码
        const userWithoutPassword = await User.findByPk(newUser.user_id, {
            attributes: { exclude: ['user_password'] }
        });
        return userWithoutPassword;
    } catch (error) {
        console.error('创建用户失败:', error);
        throw error;
    }
}

/**
 * @description 获取用户列表
 * @param {object} options 
 * @returns 
 */
export async function svr_getUserList(options) {
    const {
        username,
        user_email,
        user_role,
        user_status,
        page = 1,
        pageSize = 10
    } = options;

    // 构建查询条件
    const whereClause = {};
    if (username) {
        whereClause.username = { [User.sequelize.Op.like]: `%${username}%` };
    }
    if (user_email) {
        whereClause.user_email = { [User.sequelize.Op.like]: `%${user_email}%` };
    }
    if (user_role) {
        whereClause.user_role = user_role;
    }
    if (user_status) {
        whereClause.user_status = user_status;
    }

    // 执行分页查询
    const { count, rows } = await User.findAndCountAll({
        where: whereClause,
        attributes: { exclude: ['user_password'] },
        limit: parseInt(pageSize),
        offset: (parseInt(page) - 1) * parseInt(pageSize),
        order: [['user_created_at', 'ASC']]
    });
    return {
        list: rows.map(item=>item.dataValues),
        total: count,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
    };
}

/**
 * @description 删除用户
 * @param {number} userId 
 */
export async function svr_deleteUser(userId) {
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('用户不存在');
        }
        await user.destroy();
        return true;
    } catch (error) {
        console.error('删除用户失败:', error);
        throw error;
    }
}

/**
 * @description 检查用户名是否已存在
 * @param {string} username 
 * @param {number} excludeId 排除的用户ID（用于更新时检查）
 * @returns 
 */
export async function svr_isUsernameExists(username, excludeId = null) {
    try {
        const whereClause = { username };
        if (excludeId) {
            whereClause.user_id = { [User.sequelize.Op.ne]: excludeId };
        }
        
        const existingUser = await User.findOne({ where: whereClause });
        return !!existingUser;
    } catch (error) {
        console.error('检查用户名是否存在失败:', error);
        throw error;
    }
}

/**
 * @description 检查邮箱是否已存在
 * @param {string} email 
 * @param {number} excludeId 排除的用户ID（用于更新时检查）
 * @returns 
 */
export async function svr_isEmailExists(email, excludeId = null) {
    try {
        const whereClause = { user_email: email };
        if (excludeId) {
            whereClause.user_id = { [User.sequelize.Op.ne]: excludeId };
        }
        
        const existingUser = await User.findOne({ where: whereClause });
        return !!existingUser;
    } catch (error) {
        console.error('检查邮箱是否存在失败:', error);
        throw error;
    }
}

/**
 * @description 加密密码
 * @param {string} password 
 * @returns 
 */
export async function svr_hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

/**
 * @description 验证密码
 * @param {string} password 
 * @param {string} hash 
 * @returns 
 */
export async function svr_verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

/**
 * @description 用户认证
 * @param {string} username 
 * @param {string} password 
 * @returns 
 */
export async function svr_authenticateUser(username, password) {
    try {
        const user = await User.authenticate(username, password);
        if (user) {
            // 返回用户信息时不包含密码
            const userWithoutPassword = await User.findByPk(user.user_id, {
                attributes: { exclude: ['user_password'] }
            });
            return userWithoutPassword;
        }
        return null;
    } catch (error) {
        console.error('用户认证失败:', error);
        throw error;
    }
}
