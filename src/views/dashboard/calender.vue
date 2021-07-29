<template>
  <el-calendar v-model="currentDate" />
</template>

<script>
export default {
  data() {
    return {
      currentDate: new Date()
    }
  }
}
</script>
