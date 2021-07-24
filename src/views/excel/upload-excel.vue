<template>
  <div class="app-container">
    <upload-excel-component
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
    />
    <!-- 其他代码略 -->
  </div>
</template>

<script>
// 导入上传的组件
import UploadExcelComponent from '@/components/UploadExcel/index.vue'

export default {
  name: 'UploadExcel',
  // 绑定上传组件
  components: {
    UploadExcelComponent
  },
  data() {
    return {
      tableData: [],
      tableHeader: []
    }
  },
  methods: {
    // 上传之前的函数
    beforeUpload(file) {
      // 如判断文件的大小是否大于 1 兆
      const isLt1M = file.size / 1024 / 1024 < 1

      // 若大于 1 兆则停止解析并提示错误信息。
      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    // 成功调用之后的函数，它会返回表格的表头和内容。
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
    }
  }
}
</script>
