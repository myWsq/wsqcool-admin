<template>
    <v-app>
        <nuxt></nuxt>
        <v-snackbar :value="snackBar" @input="snackBarClose" top>
            {{snackBarText}}
            <v-btn flat color="primary" @click.native="snackBarClose">关闭</v-btn>
        </v-snackbar>
    </v-app>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
    computed: {
        ...mapState(['isMobile', 'snackBar', 'snackBarText'])
    },
    methods: {
        ...mapMutations(['setDevice', 'snackBarClose']),
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