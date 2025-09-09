import express from 'express';
import { HttpResult, getReqParam } from '../utils/HttpResult.js';
import Member from '../models/Member.model.js';

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
    
    if (mem_username.length < 3 || mem_username.length > 20) {
      return res.json({ success: false, msg: '用户名长度必须在3-20个字符之间' });
    }
    
    if (mem_password.length < 6 || mem_password.length > 20) {
      return res.json({ success: false, msg: '密码长度必须在6-20个字符之间' });
    }
    
    // 用户名格式校验（只允许字母、数字、下划线）
    if (!/^[a-zA-Z0-9_]+$/.test(mem_username)) {
      return res.json({ success: false, msg: '用户名只能包含字母、数字和下划线' });
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
    
    res.json({ 
      success: true, 
      msg: '登录成功',
      data: user.getPublicInfo()
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

export default router;
