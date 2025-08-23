import { hashPassword, verifyPassword } from '../utils/sha256.js';

console.log('🔐 测试 SHA256 密码加密功能...\n');

// 测试1: 基本SHA256加密
console.log('📋 测试1: 基本SHA256加密');
const password = 'admin123';
const hash1 = hashPassword(password);
const hash2 = hashPassword(password);

console.log(`密码: ${password}`);
console.log(`哈希1: ${hash1}`);
console.log(`哈希2: ${hash2}`);
console.log(`哈希值相同: ${hash1 === hash2}`);
console.log(`验证成功: ${verifyPassword(password, hash1)}\n`);

// 测试2: 不同密码的哈希值
console.log('📋 测试2: 不同密码的哈希值');
const password2 = 'admin456';
const hash3 = hashPassword(password2);

console.log(`密码1: ${password}`);
console.log(`密码2: ${password2}`);
console.log(`哈希1: ${hash1}`);
console.log(`哈希2: ${hash3}`);
console.log(`哈希值不同: ${hash1 !== hash3}\n`);

// 测试3: 密码验证
console.log('📋 测试3: 密码验证');
const testPasswords = ['admin123', 'wrong_password', 'admin456', ''];
const correctHash = hash1;

testPasswords.forEach(testPwd => {
  const isValid = verifyPassword(testPwd, correctHash);
  console.log(`密码 "${testPwd}" 验证结果: ${isValid ? '✅ 正确' : '❌ 错误'}`);
});
console.log();

// 测试4: 性能测试
console.log('📋 测试4: 性能测试');
const startTime = Date.now();
for (let i = 0; i < 10000; i++) {
  hashPassword(`password${i}`);
}
const endTime = Date.now();
console.log(`10000次SHA256加密耗时: ${endTime - startTime}ms`);
console.log(`平均每次加密耗时: ${(endTime - startTime) / 10000}ms\n`);

// 测试5: 边界情况
console.log('📋 测试5: 边界情况');
try {
  const emptyHash = hashPassword('');
  console.log('空密码哈希:', emptyHash);
} catch (error) {
  console.log('空密码处理:', error.message);
}

try {
  const nullHash = hashPassword(null);
  console.log('null密码哈希:', nullHash);
} catch (error) {
  console.log('null密码处理:', error.message);
}

console.log('\n✅ SHA256 加密测试完成！');
console.log('💡 注意：SHA256是确定性哈希，相同输入产生相同输出');
console.log('⚠️  警告：不使用盐值会增加彩虹表攻击的风险');
console.log('💡 建议：在生产环境中考虑使用更强的加密方式');
