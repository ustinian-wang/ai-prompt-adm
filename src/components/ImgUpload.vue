<template>
    <a-upload
      name="file"
      list-type="picture-card"
      class="avatar-uploader"
      :accept="acceptTypes"
      :show-upload-list="false"
      @change="handleChange"
    >
      <img v-if="imageUrl" :src="imageUrl" alt="avatar" style="width: 120px;height: 120px;" />
      <div v-else>
        <a-icon :type="loading ? 'loading' : 'plus'" />
        <div class="ant-upload-text">
          上传
        </div>
      </div>
    </a-upload>
  </template>
  <script>
import { debounce } from '@ustinian-wang/kit';
import { uploadWorkCover } from '../utils/imageUpload';

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  export default {
    props: {
        value: {
            type: String,
            default: ''
        }
    },
    data() {
      return {
        loading: false,
        imageUrl: this.value,
        
        acceptTypes: 'image/jpeg,image/jpg,image/png,image/gif,image/webp',
      };
    },
    watch: {   
        value: {
            handler(newVal) {
                this.imageUrl = newVal;
            },
        }
    },
    methods: {
      handleChange: debounce(async function (info) {
        let file = info?.file?.originFileObj;
        if(file){
            // 传入作品ID（如果父级未提供则忽略）
            const workId = this.$route?.params?.id
            let res = await uploadWorkCover(file, { work_id: workId })
            console.log('res', res);
            this.imageUrl = res.url;
            this.$emit('input', res.url);
            // 同步将文件ID抛给父组件（用于保存作品时提交）
            this.$emit('change-file-id', res.file_id)
        }
      }, 300),
      beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          this.$message.error('You can only upload JPG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
      },
    },
  };
  </script>
  <style>
  .avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }
  
  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
  </style>
  