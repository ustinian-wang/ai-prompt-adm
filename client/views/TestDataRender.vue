<template>
  <div class="test-page">
    <h1>数据渲染测试</h1>
    
    <div class="test-section">
      <h2>原始API数据</h2>
      <pre>{{ JSON.stringify(apiData, null, 2) }}</pre>
    </div>
    
    <div class="test-section">
      <h2>映射后的works数据</h2>
      <pre>{{ JSON.stringify(works, null, 2) }}</pre>
    </div>
    
    <div class="test-section">
      <h2>渲染测试</h2>
      <div class="grid">
        <div 
          v-for="item in works" 
          :key="item.work_id" 
          class="work-card"
        >
          <div class="cover">
            <img :src="item.work_img_path || defaultCover" alt="preview" />
          </div>
          <div class="card-body">
            <div class="title">{{ item.work_name }}</div>
            <div class="meta">
              <span class="tags">#{{ item.categoryName }}</span>
              <span class="dot">·</span>
              <span class="time">{{ formatTime(item.work_created_at) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="test-section">
      <h2>空状态测试</h2>
      <div v-if="works.length === 0" class="empty-state">
        <h3>暂无作品</h3>
        <p>该分组还没有作品</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestDataRender',
  data() {
    return {
      apiData: null,
      works: [],
      defaultCover: 'https://via.placeholder.com/320x200?text=Preview'
    }
  },
  mounted() {
    this.testDataMapping()
  },
  methods: {
    testDataMapping() {
      // 模拟API返回的数据
      this.apiData = {
        "code": 200,
        "msg": "请求成功",
        "success": true,
        "works": [{
          "wg_id": 22,
          "wg_work_id": 1,
          "wg_mg_id": 1,
          "wg_mem_id": 1,
          "wg_collected_at": 1757833890962,
          "wg_created_at": "2025-09-14T15:11:30.000Z",
          "wg_updated_at": "2025-09-14T15:11:30.000Z",
          "wg_deleted_at": null,
          "wg_collected_at_str": "2025-09-14 15:11:30",
          "work": {
            "metadata": {},
            "work_id": 1,
            "work_name": "w1",
            "work_desc": null,
            "work_img_path": "http://localhost:4002/api/upload/image/1_unknown_5267309b2d5f4957916e37ce2108c8f1_1756041980577.jpg",
            "work_status": "draft",
            "work_created_at": 1755940597101,
            "work_updated_at": 1757608585795,
            "work_created_at_str": "2025-08-23 17:16:37",
            "work_updated_at_str": "2025-09-12 00:36:25"
          }
        }],
        "pagination": {
          "page": 1,
          "limit": 24,
          "total": 1,
          "pages": 1
        }
      }
      
      // 测试数据映射逻辑
      this.works = this.apiData.works.map(workGroup => {
        console.log('处理workGroup:', workGroup)
        const work = workGroup.work || workGroup
        console.log('提取的work:', work)
        
        return {
          work_id: work.work_id,
          work_name: work.work_name,
          work_desc: work.work_desc,
          work_img_path: work.work_img_path,
          work_created_at: work.work_created_at,
          work_updated_at: work.work_updated_at,
          categoryName: '分组作品',
          liked: false,
          likes: 0
        }
      })
      
      console.log('映射后的works:', this.works)
    },
    
    formatTime(time) {
      return new Date(time).toLocaleDateString()
    }
  }
}
</script>

<style lang="scss" scoped>
.test-page {
  padding: 24px;
  
  .test-section {
    margin-bottom: 32px;
    
    h2 {
      margin-bottom: 16px;
      color: #333;
    }
    
    pre {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 12px;
    }
  }
  
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  
  .work-card {
    border: 1px solid #d9d9d9;
    border-radius: 8px;
    overflow: hidden;
    
    .cover {
      height: 200px;
      background: #fafafa;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
    }
    
    .card-body {
      padding: 12px;
      
      .title {
        font-size: 14px;
        color: #333;
        margin-bottom: 8px;
      }
      
      .meta {
        color: #999;
        font-size: 12px;
        display: flex;
        align-items: center;
        
        .dot {
          margin: 0 6px;
        }
      }
    }
  }
  
  .empty-state {
    text-align: center;
    padding: 60px 24px;
    
    h3 {
      color: #666;
      margin-bottom: 8px;
    }
    
    p {
      color: #999;
      margin: 0;
    }
  }
}
</style>
