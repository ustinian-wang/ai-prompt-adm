import express from 'express';
import { HttpResult, getReqParam } from '../utils/HttpResult.js';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth.config.js';
import Member from '../models/Member.model.js';
import Work from '../models/Work.model.js';

const router = express.Router();

async function registerHandler(req, res) {
  try {
    let mem_username = getReqParam(req, 'mem_username');
    let mem_password = getReqParam(req, 'mem_password');
    
    // 字段校验
    if (!mem_username || mem_username.trim() === '') {
      return res.json({ success: false, msg: '用户名不能为空' });
    }
    
    if (!mem_password || mem_password.trim() === '') {
      return res.json({ success: false, msg: '密码不能为空' });
    }
    
      
    // 检查用户名是否已存在
    const existingUser = await Member.findByUsername(mem_username);
    
    if (existingUser) {
      return res.json({ success: false, msg: '用户名已存在' });
    }
    
    // 创建新用户
    const newMember = await Member.createUser({
      mem_username: mem_username.trim(),
      mem_password: mem_password.trim()
    });
    
    res.json({ 
      success: true, 
      msg: '注册成功',
      data: { mem_id: newMember.mem_id }
    });
  } catch (error) {
    console.error('注册失败:', error);
    res.json({ success: false, msg: '注册失败' });
  }
}
// 会员注册
router.post('/register', registerHandler);
router.get('/register', registerHandler);

// 会员登录
router.post('/login', loginHandler);
router.get('/login', loginHandler);

async function loginHandler(req, res) {
  try {
    let mem_username = getReqParam(req, 'mem_username');
    let mem_password = getReqParam(req, 'mem_password');
    
    // 字段校验
    if (!mem_username || mem_username.trim() === '') {
      return res.json({ success: false, msg: '用户名不能为空' });
    }
    
    if (!mem_password || mem_password.trim() === '') {
      return res.json({ success: false, msg: '密码不能为空' });
    }
    
    // 查询用户
    const user = await Member.findByUsername(mem_username.trim());
    
    if (!user) {
      return res.json({ success: false, msg: '用户不存在' });
    }
    
    // 验证密码
    if (!user.validatePassword(mem_password.trim())) {
      return res.json({ success: false, msg: '密码错误' });
    }
    
    // 更新最后登录时间
    await Member.updateLastLogin(user.mem_id);
    
    // 发放会员JWT
    const token = jwt.sign({ id: user.mem_id, type: 'member' }, authConfig.MEMBER_JWT_SECRET, { expiresIn: authConfig.MEMBER_JWT_EXPIRES_IN })
    
    res.json({ 
      success: true, 
      msg: '登录成功',
      data: user.getPublicInfo(),
      token
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.json({ success: false, msg: '登录失败' });
  }
}

// 获取会员信息
async function getMemberInfoHandler(req, res) {
  try {
    let mem_id = getReqParam(req, 'mem_id');
    
    // 字段校验
    if (!mem_id) {
      return res.json({ success: false, msg: '会员ID不能为空' });
    }
    
    // 验证ID格式（必须是数字）
    if (!/^\d+$/.test(mem_id)) {
      return res.json({ success: false, msg: '会员ID格式不正确' });
    }
    
    const user = await Member.findByPk(parseInt(mem_id));
    
    if (!user) {
      return res.json({ success: false, msg: '用户不存在' });
    }
    
    res.json({ 
      success: true, 
      msg: '获取成功',
      data: user.getPublicInfo()
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.json({ success: false, msg: '获取失败' });
  }
}

router.post('/info', getMemberInfoHandler);
router.get('/info', getMemberInfoHandler);

// 更新会员信息
async function updateMemberHandler(req, res) {
  try {
    let mem_id = getReqParam(req, 'mem_id');
    let mem_nickname = getReqParam(req, 'mem_nickname');
    let mem_avatar = getReqParam(req, 'mem_avatar');
    
    // 字段校验
    if (!mem_id) {
      return res.json({ success: false, msg: '会员ID不能为空' });
    }
    
    // 验证ID格式（必须是数字）
    if (!/^\d+$/.test(mem_id)) {
      return res.json({ success: false, msg: '会员ID格式不正确' });
    }
    
    // 昵称长度校验
    if (mem_nickname && mem_nickname.length > 20) {
      return res.json({ success: false, msg: '昵称长度不能超过20个字符' });
    }
    
    // 头像URL格式校验
    if (mem_avatar && mem_avatar.trim() !== '') {
      const urlPattern = /^https?:\/\/.+/;
      if (!urlPattern.test(mem_avatar)) {
        return res.json({ success: false, msg: '头像URL格式不正确' });
      }
    }
    
    const user = await Member.findByPk(parseInt(mem_id));
    
    if (!user) {
      return res.json({ success: false, msg: '用户不存在' });
    }
    
    // 更新用户信息
    await user.update({
      mem_nickname: mem_nickname ? mem_nickname.trim() : user.mem_nickname,
      mem_avatar: mem_avatar ? mem_avatar.trim() : user.mem_avatar
    });
    
    res.json({ 
      success: true, 
      msg: '更新成功',
      data: user.getPublicInfo()
    });
  } catch (error) {
    console.error('更新用户信息失败:', error);
    res.json({ success: false, msg: '更新失败' });
  }
}

router.post('/update', updateMemberHandler);
router.get('/update', updateMemberHandler);

// 获取公开作品列表（无需登录）
async function getWorksPublicListHandler(req, res) {
  try {
    const { page = 1, limit = 12, work_name, category_id, user_id } = req.query;
    const result = await Work.getList({
      page: parseInt(page),
      limit: parseInt(limit),
      work_name,
      // category_id,
      // user_id
    });
    return res.status(200).json(HttpResult.success(result));
  } catch (error) {
    console.error('获取公开作品列表失败:', error);
    return res.status(500).json(HttpResult.error({ msg: '获取公开作品列表失败' }));
  }
}

router.get('/works/getWorksPublicList', getWorksPublicListHandler);

export default router;
