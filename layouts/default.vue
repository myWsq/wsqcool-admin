<template>
    <v-app>
        <v-fade-transition v-if="loading>0">
            <v-layout id="mask" column justify-center align-center>
                <logo-svg style="height:3em"></logo-svg>
                <v-progress-linear indeterminate color="primary" style="width:6em"></v-progress-linear>
            </v-layout>
        </v-fade-transition>
        <div v-else>
            <nuxt></nuxt>
            <v-snackbar :value="snackBar" @input="snackBarClose" top>
                {{snackBarText}}
                <v-btn flat color="primary" @click.native="snackBarClose">关闭</v-btn>
            </v-snackbar>
        </div>
    </v-app>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import LogoSvg from "../components/Logo/LogoSvg";
import gql from 'graphql-tag';
export default {
    components: { LogoSvg },
    computed: {
        ...mapState(['isMobile', 'snackBar', 'snackBarText', 'remember', 'loading'])
    },
    methods: {
        ...mapMutations(['setDevice', 'snackBarClose', 'snackBarOpen', 'setMe']),
        onResize() {
            this.setDevice(window.innerWidth <= 600)
        }
    },
    mounted() {
        this.onResize()
        window.addEventListener('resize', this.onResize, { passive: true })
        window.onbeforeunload = () => {
            window.removeEventListener('resize', this.onResize, { passive: true })
            if (!this.remember) {
                this.$apolloHelpers.onLogout()
            }
        }
    },
}
</script>

<style scoped>
#mask{
    position: fixed;
    height: 100vh;
    width: 100vw;
    background-color: #fff;
}
</style>