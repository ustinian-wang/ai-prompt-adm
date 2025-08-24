<template>
  <div class="work-list page-container fade-in">
    <!-- 页面标题 -->
    <PageHeader
      title="作品管理"
      description="管理您的AI作品，组织内容结构"
      :actions="[
        {
          key: 'add',
          type: 'primary',
          icon: 'plus',
          text: '新增作品',
          onClick: addWork,
          className: 'action-btn'
        },
        {
          key: 'batch',
          type: 'default',
          icon: 'tool',
          text: '批量操作',
          onClick: handleBatchOperation,
          className: 'action-btn'
        }
      ]"
    />

    <!-- 搜索筛选区域 -->
    <a-card :bordered="false" class="search-card">
      <a-form layout="inline" :form="searchForm" class="unified-form">
        <a-row :gutter="16" style="width: 100%">
          <a-form-item label="作品名称">
              <a-input
                v-model="searchForm.work_name"
                placeholder="作品名称"
                allow-clear
                
              >
                <a-icon slot="prefix" type="search" />
              </a-input>
            </a-form-item>
            <a-form-item label="作品类型">
              <a-select style="width: 200px"
                v-model="searchForm.work_type"
                placeholder="选择类型"
                allow-clear
                
              >
                <a-select-option 
                  v-for="category in workTypeCategories" 
                  :key="category.category_id" 
                  :value="category.category_id"
                >
                  {{ category.name }}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item>
              <a-button type="primary" @click="handleSearch"  class="search-btn">
                <a-icon type="search" />
                搜索
              </a-button>
              <a-button @click="handleReset"  class="reset-btn">
                <a-icon type="reload" />
                重置
              </a-button>
              <a-button 
                @click="handleExport" 
                
                :loading="exporting"
                :disabled="!worksList || worksList.length === 0"
                class="export-btn"
              >
                <a-icon type="download" />
                导出CSV
              </a-button>
            </a-form-item>
          <!-- <a-col :span="6">
            <a-form-item label="分类">
              <a-tree-select
                v-model="searchForm.category"
                :tree-data="categoryTree"
                placeholder="选择分类"
                allow-clear
                tree-default-expand-all
                
              />
            </a-col>
          <a-col :span="6">
            <a-form-item label="工作状态">
              <a-select
                v-model="searchForm.work_status"
                placeholder="选择状态"
                allow-clear
                
              >
                <a-select-option value="draft">草稿</a-select-option>
                <a-select-option value="published">已发布</a-select-option>
                <a-select-option value="archived">已归档</a-select-option>
              </a-select>
            </a-col> -->
        </a-row>
      </a-form>
    </a-card>

    <!-- 数据表格 -->
    <a-card :bordered="false" class="table-card">
      <a-table
        :columns="columns"
        :data-source="worksList"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        size="middle"
        :row-selection="rowSelection"
        class="data-table"
      >
        <!-- 图片列 -->
        <template slot="image" slot-scope="record">
          <div class="work-image">
            <img 
              v-if="getImageDisplayStatus(record) === 'valid'" 
              :src="record.work_img_path" 
              :alt="record.work_name"
              class="work-thumbnail"
              @error="handleImageError($event, record)"
            />
            <div v-else-if="getImageDisplayStatus(record) === 'failed'" class="image-placeholder">
              <a-icon type="picture" />
              <div class="placeholder-text">图片加载失败</div>
            </div>
            <div v-else class="image-placeholder">
              <a-icon type="picture" />
              <div class="placeholder-text">暂无图片</div>
            </div>
          </div>
        </template>

        <!-- 作品信息列 -->
        <template slot="workInfo" slot-scope="text, record">
          <div class="work-info">
            <div class="work-title">{{ record.work_name }}</div>
            <div class="work-meta">
              <span class="work-author">作者: {{ record.author }}</span>
              <span class="work-date">{{ formatDate(record.work_create_at) }}</span>
            </div>
          </div>
        </template>

        <!-- 分类列 -->
        <template slot="categories" slot-scope="record">
          <div class="work-categories">
            <template v-if="record.length">
              <a-tag 
                v-for="category in record" 
                :key="category.category_id" 
                :color="getCategoryColor(category)"
                class="category-tag"
              >
                <span v-if="category.icon" class="category-icon">{{ category.icon }}</span>
                {{ category.name }}
              </a-tag>
            </template>
            
            <span v-else class="no-categories">
              暂无分类
            </span>
          </div>
        </template>

        <!-- 标签列 -->
        <template slot="tags" slot-scope="tags">
          <div class="work-tags">
            <a-tag v-for="tag in tags" :key="tag" color="blue">
              {{ tag }}
            </a-tag>
          </div>
        </template>

        <!-- 状态列 -->
        <template slot="work_status" slot-scope="work_status">
          <a-tag :color="getwork_statusColor(work_status)" class="status-tag">
            <a-icon :type="getwork_statusIcon(work_status)" />
            {{ getwork_statusText(work_status) }}
          </a-tag>
        </template>

        <!-- 操作列 -->
        <template slot="action" slot-scope="text, record">
          <div class="action-buttons">
            <a-button type="link" @click="viewWork(record)" class="action-btn">
              <a-icon type="eye" />
              编辑
            </a-button>
            <a-popconfirm
              title="确定要删除这个作品吗？"
              @confirm="handleDeleteWork(record.work_id, record)"
              ok-text="确定"
              cancel-text="取消"
            >
              <a-button type="link" class="action-btn delete-btn">
                <a-icon type="delete" />
                删除
              </a-button>
            </a-popconfirm>
          </div>
        </template>
      </a-table>
    </a-card>

    <!-- 新增/编辑作品弹窗 -->
    <a-modal
      :title="isEdit ? '编辑作品' : '新增作品'"
      :visible="modalVisible"
      @ok="handleSubmit"
      @cancel="handleCancel"
      :confirm-loading="submitLoading"
      width="600px"
    >
      <a-form-model
        ref="workForm"
        :model="workForm"
        :rules="workRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-model-item label="作品名称" prop="work_name">
          <a-input v-model="workForm.work_name" placeholder="请输入作品名称" />
        </a-form-model-item>
        
        <a-form-model-item label="作品类型" prop="work_type">
          <a-select v-model="workForm.work_type" placeholder="请选择作品类型">
            <a-select-option value="UI设计">UI设计</a-select-option>
            <a-select-option value="3D设计">3D设计</a-select-option>
            <a-select-option value="图标设计">图标设计</a-select-option>
            <a-select-option value="插画设计">插画设计</a-select-option>
          </a-select>
        </a-form-model-item>
        
        <a-form-model-item label="作品描述" prop="work_desc">
          <a-textarea
            v-model="workForm.work_desc"
            :rows="4"
            placeholder="请输入作品描述"
          />
        </a-form-model-item>
        
        <a-form-model-item label="作品标签">
          <a-select
            v-model="workForm.tags"
            mode="tags"
            placeholder="请输入标签，按回车确认"
            style="width: 100%"
          />
        </a-form-model-item>
        
        <a-form-model-item label="作品图片">
          <a-upload
            name="file"
            list-type="picture-card"
            class="work-uploader"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            @change="handleImageChange"
          >
            <img v-if="workForm.work_img_path" :src="workForm.work_img_path" alt="作品图片" />
            <div v-else>
              <a-icon type="plus" />
              <div class="ant-upload-text">上传图片</div>
            </div>
          </a-upload>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import BackButton from '@/components/BackButton.vue'
import PageHeader from '@/components/PageHeader.vue'
import { sendTextNotification } from '@/utils/wechatBot.js'

export default {
  name: 'WorkList',
  data() {
    return {
      modalVisible: false,
      isEdit: false,
      submitLoading: false,
      exporting: false,
      routeWatcher: null,
      searchForm: {
        work_name: '',
        work_type: null, // Changed to null to match category ID
        category: null,
        work_status: null
      },
      workTypeCategories: [], // Categories for work type dropdown
      workForm: {
        work_name: '',
        work_type: '',
        work_desc: '',
        tags: [],
        image: ''
      },
      workRules: {
        work_name: [
          { required: true, message: '请输入作品名称', trigger: 'blur' }
        ],
        work_type: [
          { required: true, message: '请选择作品类型', trigger: 'change' }
        ],
        work_desc: [
          { required: true, message: '请输入作品描述', trigger: 'blur' }
        ]
      },
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedWorks = selectedRows;
        },
        getCheckboxProps: (record) => ({
          disabled: record.work_status === 'archived', // 禁用已归档的作品
          name: record.id,
        }),
      },
      selectedWorks: [],
      categoryTree: [
        {
          title: 'AI创作',
          value: 'ai_creation',
          key: 'ai_creation',
          children: [
            { title: 'AI绘画', value: 'ai_painting', key: 'ai_painting' },
            { title: 'AI写作', value: 'ai_writing', key: 'ai_writing' },
            { title: 'AI编程', value: 'ai_programming', key: 'ai_programming' },
          ],
        },
        {
          title: 'UI设计',
          value: 'ui_design',
          key: 'ui_design',
          children: [
            { title: '图标设计', value: 'icon_design', key: 'icon_design' },
            { title: '界面设计', value: 'interface_design', key: 'interface_design' },
          ],
        },
        {
          title: '3D设计',
          value: '3d_design',
          key: '3d_design',
          children: [
            { title: '3D模型', value: '3d_model', key: '3d_model' },
            { title: '3D动画', value: '3d_animation', key: '3d_animation' },
          ],
        },
        {
          title: '插画设计',
          value: 'illustration_design',
          key: 'illustration_design',
          children: [
            { title: '手绘插画', value: 'hand_illustration', key: 'hand_illustration' },
            { title: '数字插画', value: 'digital_illustration', key: 'digital_illustration' },
          ],
        },
      ],
    }
  },
  components: {
    BackButton,
    PageHeader
  },
  computed: {
    ...mapGetters('works', ['worksList', 'loading', 'pagination']),
    ...mapGetters('categories', ['categoriesList', 'loading']),

    columns() {
      return [
        {
          title: '图片',
          key: 'work_img_path',
          width: 80,
          scopedSlots: { customRender: 'image' }
        },
        {
          title: '作品名称',
          dataIndex: 'work_name',
          key: 'work_name',
        },
        {
          title: '作品信息',
          dataIndex: 'work_desc',
          key: 'work_desc',
          width: 250,
          scopedSlots: { customRender: 'workInfo' }
        },
        {
          title: '分类',
          dataIndex: 'work_categories',
          key: 'work_categories',
          width: 200,
          scopedSlots: { customRender: 'categories' }
        },
        {
          title: '标签',
          dataIndex: 'tags',
          key: 'tags',
          width: 200,
          scopedSlots: { customRender: 'tags' }
        },
        {
          title: '状态',
          dataIndex: 'work_status',
          key: 'work_status',
          width: 100,
          scopedSlots: { customRender: 'work_status' }
        },
        {
          title: '操作',
          key: 'action',
          width: 200,
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  mounted() {
    this.getWorksList()
    this.loadWorkTypeCategories()
    
    // 监听路由变化，当从其他页面返回时刷新数据
    this.routeWatcher = this.$watch(
      () => this.$route,
      (to, from) => {
        // 如果是从其他页面返回，刷新数据
        if (from.name && from.name !== 'WorkList' && to.name === 'WorkList') {
          this.getWorksList()
        }
      }
    )
  },
  
  // 当路由进入时刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 如果是从其他页面返回，刷新数据
      if (from.name && from.name !== 'WorkList') {
        vm.getWorksList()
      }
    })
  },
  
  // 当组件被激活时刷新数据（适用于keep-alive场景）
  activated() {
    this.getWorksList()
  },
  
  // 组件销毁前清理监听器
  beforeDestroy() {
    if (this.routeWatcher) {
      this.routeWatcher()
    }
  },
  methods: {
    ...mapActions('works', ['getWorksList', 'createWork', 'updateWork', 'deleteWork']),
    ...mapActions('categories', ['getCategoriesList']),
    
    // Load categories for work type dropdown
    async loadWorkTypeCategories() {
      try {
        await this.getCategoriesList()
        // Filter categories that are relevant for work types
        this.workTypeCategories = this.categoriesList.filter(cat => 
          cat.enabled && cat.show_in_nav
        )
      } catch (error) {
        console.warn('Failed to load work type categories:', error)
        this.workTypeCategories = []
      }
    },
    
    // 搜索
    handleSearch() {
      this.getCurrWorkList()
    },

    getCurrWorkList(){
      this.getWorksList(this.searchForm)
    },
    
    // 重置搜索
    handleReset() {
      this.searchForm = {
        work_name: '',
        work_type: null, // Reset to null for category ID
        category: null,
        work_status: null
      }
      this.getCurrWorkList()
    },

    // 导出CSV文件
    async handleExport() {
      if (this.exporting) return;
      
      try {
        this.exporting = true;
        
        // 显示加载状态
        this.$message.loading('正在准备导出数据...', 0);
        
        // 获取当前筛选条件下的数据
        let exportData = this.worksList || [];
        
        // 如果当前列表为空，重新获取数据
        if (exportData.length === 0) {
          this.$message.destroy();
          this.$message.loading('正在获取数据...', 0);
          await this.getCurrWorkList();
          exportData = this.worksList || [];
        }
        
        if (exportData.length === 0) {
          this.$message.destroy();
          this.$message.warning('没有数据可导出');
          return;
        }

        // 更新进度提示
        this.$message.destroy();
        this.$message.loading(`正在处理 ${exportData.length} 条数据...`, 0);

        // 生成文件名（包含筛选条件信息）
        const filename = this.generateExportFilename();
        
        // 定义CSV列头
        const headers = [
          '作品名称',
          '作品类型', 
          '作品描述',
          '标签',
          '状态',
          '创建时间',
          '作者'
        ];

        // 转换数据为CSV格式
        const csvContent = this.convertToCSV(exportData, headers);
        
        // 更新进度提示
        this.$message.destroy();
        this.$message.loading('正在生成文件...', 0);
        
        // 下载文件
        this.downloadCSV(csvContent, filename);
        
        this.$message.destroy();
        this.$message.success(`导出成功，共导出 ${exportData.length} 条记录`);
        
        // 发送企业微信通知
        try {
          await sendTextNotification(`作品列表导出完成\n导出数量: ${exportData.length}\n文件名: ${filename}\n时间: ${new Date().toLocaleString()}`);
        } catch (error) {
          console.warn('企业微信通知发送失败:', error);
        }
      } catch (error) {
        this.$message.destroy();
        console.error('导出失败:', error);
        this.$message.error('导出失败');
      } finally {
        this.exporting = false;
      }
    },

    // 批量操作
    handleBatchOperation() {
      console.log('批量操作功能待实现')
      // 实际批量操作逻辑需要调用后端API
    },

    // 获取分类标签颜色
    getCategoryColor(category) {
      // 根据分类名称或ID返回不同的颜色
      const colorMap = {
        'AI工具': 'purple',
        '设计工具': 'blue',
        '开发工具': 'green',
        '办公工具': 'orange',
        '创意工具': 'pink'
      };
      
      // 如果分类名称匹配，返回对应颜色
      if (colorMap[category.name]) {
        return colorMap[category.name];
      }
      
      // 否则根据分类ID生成固定颜色
      const colors = ['blue', 'green', 'orange', 'purple', 'cyan', 'magenta', 'red'];
      const colorIndex = category.category_id % colors.length;
      return colors[colorIndex];
    },

    // 查看作品详情
    viewWork(work) {
      console.log('查看作品详情:', work)
      // 跳转到作品详情页面
      this.$router.push({ 
        name: 'WorkDetail', 
        params: { id: work.work_id } 
      })
    },

    // 显示新增弹窗
    addWork() {
      // this.isEdit = false
      // this.workForm = {
      //   work_name: '',
      //   work_type: '',
      //   work_name: '',
      //   tags: [],
      //   image: ''
      // }
      // this.modalVisible = true
      this.$router.push({ name: 'WorkDetail' })
    },
    
    // 编辑作品
    editWork(work) {
      this.isEdit = true
      this.workForm = {
        work_id: work.work_id,
        work_name: work.work_name,
        work_type: work.work_type,
        work_desc: work.work_desc,
        work_category_list: [...work.work_category_list],
        work_img_path: work.work_img_path
      }
      this.modalVisible = true
    },
    
    // 复制作品
    async duplicateWork(id) {
      try {
        await this.createWork(this.worksList.find(work => work.id === id))
        this.$message.success('作品复制成功')
        this.getCurrWorkList()
      } catch (error) {
        this.$message.error('作品复制失败')
      }
    },

    // 分享作品
    async shareWork(id) {
      try {
        const work = this.worksList.find(work => work.id === id)
        // 模拟分享逻辑，实际需要调用分享API
        this.$message.success(`作品 "${work.work_name}" 已分享`)
      } catch (error) {
        this.$message.error('分享失败')
      }
    },

    // 归档作品
    async archiveWork(id) {
      try {
        const work = this.worksList.find(work => work.id === id)
        await this.updateWork({
          ...work,
          work_status: 'archived'
        })
        this.$message.success('作品已归档')
        this.getCurrWorkList()
      } catch (error) {
        this.$message.error('归档失败')
      }
    },
    
    // 切换状态
    async togglework_status(work) {
      try {
        const newwork_status = work.work_status === '展示' ? '隐藏' : '展示'
        await this.updateWork({
          ...work,
          work_status: newwork_status
        })
        this.$message.success(`状态已${newwork_status === '展示' ? '展示' : '隐藏'}`)
        this.getCurrWorkList()
      } catch (error) {
        this.$message.error('状态更新失败')
      }
    },
    
    // 删除作品
    async handleDeleteWork(id, record) {
      console.log('[handleDeleteWork] record', record)
      try {
        await this.deleteWork(id);
        this.$message.success('删除作品成功')
        this.getCurrWorkList();
      } catch (error) {
        console.warn(error)
        this.$message.error('删除失败')
      }
    },
    
    // 提交表单
    async handleSubmit() {
      try {
        await this.$refs.workForm.validate()
        this.submitLoading = true
        
        if (this.isEdit) {
          await this.updateWork(this.workForm)
          this.$message.success('更新作品成功')
        } else {
          await this.createWork(this.workForm)
          this.$message.success('创建作品成功')
        }
        
        this.modalVisible = false
        this.getCurrWorkList()
      } catch (error) {
        console.error('提交失败:', error)
      } finally {
        this.submitLoading = false
      }
    },
    
    // 取消操作
    handleCancel() {
      this.modalVisible = false
      this.$refs.workForm.resetFields()
    },
    
    // 图片上传前检查
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('只能上传 JPG/PNG 格式的图片!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB!')
      }
      return isJpgOrPng && isLt2M
    },
    
    // 图片上传变化处理
    handleImageChange(info) {
      if (info.file.work_status === 'done') {
        // 这里应该处理图片上传成功后的逻辑
        this.workForm.work_img_path = info.file.response.url || URL.createObjectURL(info.file.originFileObj)
      }
    },

    // 图片加载失败处理
    handleImageError(e, record) {
      // 将图片路径标记为无效，触发重新渲染
      record._imageLoadFailed = true;
      this.$forceUpdate();
    },

    // 判断图片是否有效
    hasValidImage(imagePath) {
      if (!imagePath || imagePath === 'null' || imagePath === 'undefined' || imagePath.trim() === '') {
        return false;
      }
      // 检查是否是有效的URL格式
      try {
        new URL(imagePath);
        return true;
      } catch {
        return false;
      }
    },

    // 获取图片显示状态
    getImageDisplayStatus(record) {
      if (record._imageLoadFailed) {
        return 'failed';
      }
      if (this.hasValidImage(record.work_img_path)) {
        return 'valid';
      }
      return 'none';
    },

    // 格式化日期
    formatDate(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },

    // 获取状态颜色
    getwork_statusColor(work_status) {
      switch (work_status) {
        case 'published':
          return 'green';
        case 'archived':
          return 'gray';
        default:
          return 'blue';
      }
    },

    // 获取状态图标
    getwork_statusIcon(work_status) {
      switch (work_status) {
        case 'published':
          return 'check-circle';
        case 'archived':
          return 'inbox';
        default:
          return 'clock-circle';
      }
    },

    // 获取状态文本
    getwork_statusText(work_status) {
      switch (work_status) {
        case 'published':
          return '已发布';
        case 'archived':
          return '已归档';
        default:
          return '草稿';
      }
    },

    // 转换数据为CSV格式
    convertToCSV(data, headers) {
      // 添加BOM以支持中文
      let csvContent = '\uFEFF';
      
      // 添加表头
      csvContent += headers.join(',') + '\n';
      
      // 添加数据行
      data.forEach(item => {
        const row = [
          this.escapeCSVField(item.work_name || ''),
          this.escapeCSVField(item.work_type || ''),
          this.escapeCSVField(item.work_desc || ''),
          this.escapeCSVField(this.formatTagsForCSV(item.work_category_list || [])),
          this.escapeCSVField(this.getwork_statusText(item.work_status || '')),
          this.escapeCSVField(this.formatDate(item.work_create_at || '')),
          this.escapeCSVField(item.author || '')
        ];
        csvContent += row.join(',') + '\n';
      });
      
      return csvContent;
    },

    // 转义CSV字段（处理逗号、引号等特殊字符）
    escapeCSVField(field) {
      if (field === null || field === undefined) {
        return '';
      }
      
      const stringField = String(field);
      
      // 如果字段包含逗号、引号或换行符，需要用引号包围
      if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
        // 将字段中的引号替换为两个引号
        const escapedField = stringField.replace(/"/g, '""');
        return `"${escapedField}"`;
      }
      
      return stringField;
    },

    // 格式化标签为CSV友好的格式
    formatTagsForCSV(tags) {
      if (!Array.isArray(tags)) {
        return '';
      }
      return tags.join('; ');
    },

    // 格式化日期为文件名友好的格式
    formatDateForFileName(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}${month}${day}_${hours}${minutes}`;
    },

    // 生成导出文件名
    generateExportFilename() {
      const timestamp = this.formatDateForFileName(new Date());
      let filename = `作品列表_${timestamp}`;
      
      // 添加筛选条件到文件名
      const filters = [];
      if (this.searchForm.work_name) {
        filters.push(`名称_${this.searchForm.work_name}`);
      }
      if (this.searchForm.work_type) {
        filters.push(`类型_${this.searchForm.work_type}`);
      }
      if (this.searchForm.category) {
        filters.push(`分类_${this.searchForm.category}`);
      }
      if (this.searchForm.work_status) {
        filters.push(`状态_${this.searchForm.work_status}`);
      }
      
      if (filters.length > 0) {
        filename += `_筛选_${filters.join('_')}`;
      }
      
      return `${filename}.csv`;
    },

    // 下载CSV文件
    downloadCSV(csvContent, filename) {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // 创建下载链接
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        // 兼容旧版浏览器
        window.open('data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
      }
    },

    // 获取默认图片URL
    getDefaultImage() {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNSAxNUgzNVYzNUgxNVYxNVoiIHN0cm9rZT0iI0Q5RDlEOSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtZGFzaGFycmF5PSI1LDUiLz4KPHBhdGggZD0iTTIwIDIwTDI1IDI1TDMwIDIwTDM1IDI1TDM1IDMwTDMwIDI1TDI1IDMwTDIwIDI1TDIwIDIwWiIgZmlsbD0iI0Q5RDlEOSIvPgo8L3N2Zz4K';
    }
  }
}
</script>

<style lang="scss" scoped>
.work-list {
  
  .search-card {
    .search-btn,
    .reset-btn,
    .export-btn {
      .anticon {
        margin-right: var(--spacing-sm);
      }
    }
    
    .export-btn {
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
  
  .table-card {
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-1);
    
    .ant-card-body {
      padding: var(--spacing-lg);
    }
    
    .work-image {
      position: relative;
      width: 50px;
      height: 50px;
      
      .work-thumbnail {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: var(--border-radius-sm);
        border: 1px solid var(--border-light);
      }
      
      .image-placeholder {
        width: 100%;
        height: 100%;
        background: var(--background-light);
        border: 1px dashed var(--border-color);
        border-radius: var(--border-radius-sm);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-tertiary);
        flex-direction: column;
        font-size: 12px;
      }

      .placeholder-text {
        font-size: 10px;
        color: var(--text-tertiary);
        margin-top: var(--spacing-xs);
        text-align: center;
        line-height: 1.2;
      }
    }
    
    .work-info {
      .work-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: var(--spacing-xs);
        line-height: 1.4;
      }
      .work-meta {
        font-size: 12px;
        color: var(--text-tertiary);
        line-height: 1.4;
        
        .work-author {
          margin-right: var(--spacing-sm);
        }
      }
    }

    .work-tags {
      .ant-tag {
        margin-bottom: var(--spacing-xs);
        border-radius: var(--border-radius-sm);
      }
    }

    .work-categories {
      .category-tag {
        margin-bottom: var(--spacing-xs);
        margin-right: var(--spacing-xs);
        display: inline-flex;
        align-items: center;
        border-radius: var(--border-radius-sm);
        
        .category-icon {
          margin-right: var(--spacing-xs);
          font-size: 12px;
        }
      }
      
      .no-categories {
        color: var(--text-tertiary);
        font-size: 12px;
        font-style: italic;
      }
    }

    .action-buttons {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      
      .action-btn {
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--border-radius-sm);
        transition: all 0.3s ease;
        
        &:hover {
          background: var(--primary-light);
          color: var(--primary-color);
        }
      }
      
      .delete-btn {
        color: var(--error-color);
        
        &:hover {
          background: var(--error-light);
          color: var(--error-color);
        }
      }
    }
  }
  
  .work-uploader {
    .ant-upload-select {
      width: 100px;
      height: 100px;
      border-radius: var(--border-radius-md);
      border: 1px dashed var(--border-color);
      
      &:hover {
        border-color: var(--primary-color);
      }
    }
    
    .ant-upload-text {
      margin-top: var(--spacing-sm);
      color: var(--text-secondary);
      font-size: 12px;
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .work-list {
    .search-card {
      .ant-form-item {
        margin-bottom: var(--spacing-sm);
      }
      
      .search-btn,
      .reset-btn,
      .export-btn {
        width: 100%;
        margin-right: 0;
        margin-bottom: var(--spacing-sm);
      }
    }
  }
}
</style>
