<template>
    <v-navigation-drawer :mobile-break-point="1000" app :width="260" v-model="sideBarStatus">
        <v-toolbar flat style="background-color:transparent">
            <v-layout align-center style="height:100%">
                <router-link to="/"> <img src="../assets/logo.svg" id="logo"></router-link>
                <a href="https://wsq.cool" target="_blank" id="toolbar-title">
                    wsq.cool
                </a>
            </v-layout>
        </v-toolbar>
        <v-divider></v-divider>
        <v-list>
            <v-list-tile v-for="item in navList" :key="item.key" :to="item.to" ripple active-class="primary--text my-active" class="mx-3 my-1">
                <v-list-tile-content>
                    <v-list-tile-title>
                        <h3>{{ item.text }}</h3>
                    </v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
        <v-spacer></v-spacer>
        <div id="footer">
            &copy; 2018 POWERD BY <a target="_blank" href="https://github.com/myWsq/wsqcool-backend">WSQ.COOL BACKEND</a>
        </div>
    </v-navigation-drawer>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
    data() {
        return {
            navList: [{
                text: '仪表盘',
                to: '/'
            }, {
                text: '个人信息',
                to: '/profile'
            }, {
                text: '留言板',
                to: '/msgbox'
            }, {
                text: '文章 & 评论',
                to: '/article'
            }, {
                text: '项目展示',
                to: '/project'
            }],
        }
    },
    computed: {
        ...mapState(['sideBar', 'isMobile']),
        sideBarStatus: {
            get() {
                return this.sideBar
            },
            set(value) {
                this.setSideBar(value)
            }
        },
    },
    methods: {
        ...mapMutations(['setSideBar'])
    },
}
</script>

<style>
.my-active{
    background-color: aliceblue;
}
</style>
<style scoped>

#logo{
    height: 3rem;
    margin-right: .5em;
    vertical-align: middle;
}

#toolbar-title{
    text-decoration: none;
    font-size:1.8rem;
    font-weight:50;
}

#footer{
    position: absolute;
    bottom:1em;
    left:1em;
    color:#bcbcbc
}
</style>
