import fs from 'node:fs';
import { getUid } from '../utils/uid.js';
import bcrypt from 'bcryptjs';

export async function svr_initDefaultUser(){
    let username = "admin";
    let password = "123456";
    let email = "admin@example.com";
    let avatar = "https://via.placeholder.com/32x32/1890ff/ffffff?text=A";

    let user = {
        username,
        password,
        email,
        avatar,
    }
    let old_user = svr_getUserByUsername(username);
    if(old_user){
        return;
    }
    let hash = await bcrypt.hash(password, 10);
    user.password = hash;
    svr_createUser(user);
}
/**
 * @description 获取mock用户数据
 * @returns 
 */
export function svr_getUserDetailMock(){
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

const USERS_FILE_PATH = 'data/__tmp__users.json';

/**
 * @description 根据用户ID获取用户详情
 * @param {number} userId 
 * @returns 
 */
export function svr_getUserById(userId){
    let user_list = read_file_as_array(USERS_FILE_PATH, [svr_getUserDetailMock()]);
    let user = user_list.find(user => user.id === userId);
    return user;
}

/**
 * @description 根据用户名获取用户详情
 * @param {string} username 
 * @returns 
 */
export function svr_getUserByUsername(username){
    let user_list = read_file_as_array(USERS_FILE_PATH, [svr_getUserDetailMock()]);
    let user = user_list.find(user => user.username === username);
    return user;
}

/**
 * @description 更新用户详情
 * @param {number} userId 
 * @param {object} user 
 * @returns 
 */
export function svr_updateUser(userId, user){
    let user_list = read_file_as_array(USERS_FILE_PATH, [svr_getUserDetailMock()]);
    let user_index = user_list.findIndex(user => user.id === userId);
    if(user_index !== -1){
        user_list[user_index] = { ...user_list[user_index], ...user, update_at: Date.now() };
    }
    write_file_as_array(USERS_FILE_PATH, user_list);
    return user_list;
}

/**
 * @description 创建用户详情
 * @param {object} user 
 * @returns 
 */
export function svr_createUser(user){
    let user_list = read_file_as_array(USERS_FILE_PATH, [svr_getUserDetailMock()]);
    const newUser = {
        ...user,
        id: getUid(),
        create_at: Date.now(),
        update_at: Date.now()
    };
    user_list.push(newUser);
    write_file_as_array(USERS_FILE_PATH, user_list);
    return newUser;
}

/**
 * @description 获取用户列表
 * @param {object} options 
 * @returns 
 */
export function svr_getUserList(options){
    let {
        username,
        email,
        role,
        status,
        page = 1,
        pageSize = 10
    } = options;
    
    let user_list = read_file_as_array(USERS_FILE_PATH, [svr_getUserDetailMock()]);
    
    // 过滤条件
    if(username){
        user_list = user_list.filter(user => user.username.includes(username));
    }
    if(email){
        user_list = user_list.filter(user => user.email.includes(email));
    }
    if(role){
        user_list = user_list.filter(user => user.role === role);
    }
    if(status){
        user_list = user_list.filter(user => user.status === status);
    }
    
    // 分页
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedList = user_list.slice(startIndex, endIndex);
    
    return {
        list: paginatedList,
        total: user_list.length,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
    };
}

/**
 * @description 删除用户
 * @param {number} userId 
 */
export function svr_deleteUser(userId){
    let user_list = read_file_as_array(USERS_FILE_PATH, [svr_getUserDetailMock()]);
    user_list = user_list.filter(user => user.id !== userId);
    write_file_as_array(USERS_FILE_PATH, user_list);
}

/**
 * @description 检查用户名是否已存在
 * @param {string} username 
 * @param {number} excludeId 排除的用户ID（用于更新时检查）
 * @returns 
 */
export function svr_isUsernameExists(username, excludeId = null){
    let user_list = read_file_as_array(USERS_FILE_PATH, [svr_getUserDetailMock()]);
    return user_list.some(user => user.username === username && user.id !== excludeId);
}

/**
 * @description 检查邮箱是否已存在
 * @param {string} email 
 * @param {number} excludeId 排除的用户ID（用于更新时检查）
 * @returns 
 */
export function svr_isEmailExists(email, excludeId = null){
    let user_list = read_file_as_array(USERS_FILE_PATH, [svr_getUserDetailMock()]);
    return user_list.some(user => user.email === email && user.id !== excludeId);
}

/**
 * @description 加密密码
 * @param {string} password 
 * @returns 
 */
export async function svr_hashPassword(password){
    return await bcrypt.hash(password, 10);
}

/**
 * @description 验证密码
 * @param {string} password 
 * @param {string} hash 
 * @returns 
 */
export async function svr_verifyPassword(password, hash){
    return await bcrypt.compare(password, hash);
}

function read_file_as_array(file_path, default_value = []){
    if(!fs.existsSync(file_path)){
        return default_value;
    }
    let file_content = fs.readFileSync(file_path, 'utf-8');
    let value = JSON.parse(file_content);
    if(value instanceof Array){
        return value;
    }else{
        return default_value
    }
}

function write_file_as_array(file_path, array, default_value = []){
    if(!fs.existsSync(file_path)){
        fs.writeFileSync(file_path, JSON.stringify(default_value, null, 2));
    }
    if(array instanceof Array){
        fs.writeFileSync(file_path, JSON.stringify(array, null, 2));
    }else{
        fs.writeFileSync(file_path, JSON.stringify(default_value, null, 2));
    }
}
