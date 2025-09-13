// 使用内置的fetch (Node.js 18+)

const BASE_URL = 'http://localhost:4002';

async function testCollectAPI() {
  try {
    console.log('🧪 开始测试 collect-to-groups API...');
    
    // 1. 测试登录获取token
    console.log('1. 测试登录...');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('登录响应:', loginData);
    
    if (!loginData.success) {
      console.error('❌ 登录失败');
      return;
    }
    
    const token = loginData.data.token;
    console.log('✅ 登录成功，获得token');
    
    // 2. 测试 collect-to-groups API
    console.log('2. 测试 collect-to-groups API...');
    const collectResponse = await fetch(`${BASE_URL}/api/member/work_group/collect-to-groups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        workId: 1,
        groupIds: [1]
      })
    });
    
    const collectData = await collectResponse.json();
    console.log('采集响应:', collectData);
    
    if (collectData.success) {
      console.log('✅ collect-to-groups API 测试成功');
    } else {
      console.log('❌ collect-to-groups API 测试失败:', collectData.msg);
    }
    
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error.message);
  }
}

testCollectAPI();
