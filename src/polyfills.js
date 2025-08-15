// 构建时 polyfill 入口文件
// 这个文件会在构建时被 Vite 处理，确保所有依赖都被正确打包

// 提供 Node.js 模块的浏览器兼容
if (typeof window !== 'undefined') {
  // 提供 global 对象
  if (typeof global === 'undefined') {
    window.global = window;
  }
  
  // 提供 process 对象
  if (typeof process === 'undefined') {
    window.process = {
      env: {},
      browser: true
    };
  }
  
  // 提供 Buffer 对象（如果需要）
  if (typeof Buffer === 'undefined') {
    window.Buffer = {
      isBuffer: () => false
    };
  }
}

// 导出所有 polyfills
export default {
  MutationObserver: window.MutationObserver,
  enquire: window.enquire,
  requestAnimationFrame: window.requestAnimationFrame,
  ResizeObserver: window.ResizeObserver
};
