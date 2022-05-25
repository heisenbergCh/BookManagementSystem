<template>
  <div class="test">
    <el-empty
      :image-size="100"
      image="https://img-blog.csdnimg.cn/fe365e3895c74c4284d1df5f53f2e41a.png#pic_center"
      description= " ">
      欢迎登录图书管理系统！
    </el-empty>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getMessageApi } from '@/api/message'

export default {
  name: 'test',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
    return {
    }
  },
  created() {
  },
  mounted() {
    // 初始化
    this.init()

  },
  methods: {

  },
  destroyed() {

  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
