<template>
  <v-app>
    <nuxt></nuxt>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  computed: {
    ...mapState(['isMobile'])
  },
  methods: {
    ...mapMutations(['setDevice']),
    onResize() {
      this.setDevice(window.innerWidth <= 600)
    }
  },
  mounted() {
    this.onResize()
    window.addEventListener('resize', this.onResize, { passive: true })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize, { passive: true })
  }
}
</script>

<style scoped>

</style>