<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link key="collapse" class="sidebar-logo-link" to="/">
        <img src="@/assets/common/logo.png" class="sidebar-logo">
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: 'Vue Admin Template',
      logo: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png'
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 70px;
  line-height: 50px;
  // background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo {
     width: 140px;
     // height: 32px;
     vertical-align: middle;
     margin-right: 12px;
     margin-top: 12px;
   }

    & .sidebar-logo {
     width: 140px;
     // height: 32px;
     vertical-align: middle;
     margin-right: 12px;
     margin-top: 12px;
     margin-bottom: 20px;
   }

    // 小图样式
   &.collapse {
     .sidebar-logo {
       margin-right: 0px;
       width: 32px;
       height: 32px;
     }
   }
  }

  // &.collapse {
  //   .sidebar-logo {
  //     margin-right: 0px;
  //   }
  // }

</style>
