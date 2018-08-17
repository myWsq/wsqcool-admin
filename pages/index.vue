<template>
    <v-app v-if="me">
        <v-toolbar app fixed flat :style="{'border-bottom':`${toolbarFloat ? 1 : 0}px solid #dfdfdf`}" v-scroll="onScroll">
            <v-toolbar-side-icon @click="setSideBar(!sideBar)"></v-toolbar-side-icon>
            <v-toolbar-title>{{routeName[$route.name]}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu offset-y :nudge-top="-10" min-width="500px" :disabled="notifications.length===0" v-model="notificationVisible" max-width="500px" :position-y="160" max-height="400px">
                <v-btn slot="activator" flat icon :disabled="notifications.length===0" :class="{'mr-4':notifications.length>0}">
                    <v-badge color="primary" v-if="notifications.length>0">
                        <span slot="badge">{{notifications.length}}</span>
                        <v-icon>notifications_none</v-icon>
                    </v-badge>
                    <v-icon v-else>notifications_none</v-icon>
                </v-btn>
                <v-list two-line>
                    <template v-for="item in groupNotifications">
                        <v-subheader v-if="item.isCategory" :key="item.category">{{item.category}}</v-subheader>
                        <v-divider v-else-if="item.isDivider" :key="item.id + '_divider'"></v-divider>
                        <v-list-tile :key="item.id" v-else ripple>
                            <v-list-tile-content>
                                <v-list-tile-title>{{item.title}}</v-list-tile-title>
                                <v-list-tile-sub-title>{{item.content}}</v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <v-list-tile-action-text>{{fromNow(item.time) }}</v-list-tile-action-text>
                            </v-list-tile-action>
                        </v-list-tile>
                    </template>

                </v-list>
            </v-menu>
            <v-menu offset-y style="height:100%" :nudge-top="-5">
                <v-btn class="nav-btn" slot="activator" flat>
                    <v-icon>person_outline</v-icon>
                    {{me.name}}
                </v-btn>
                <v-card>
                    <v-list>
                        <v-list-tile>
                            <v-list-tile-content>
                                <v-list-tile-title>{{me.name}}</v-list-tile-title>
                                <v-list-tile-sub-title>创建于: {{userCreatedAt}}</v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <v-btn icon @click="logout">
                                    <v-icon color="accent">input</v-icon>
                                </v-btn>
                            </v-list-tile-action>
                        </v-list-tile>
                    </v-list>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-btn flat block @click="userPop = true" color="primary">修改用户名或密码</v-btn>
                    </v-card-actions>
                </v-card>
            </v-menu>
        </v-toolbar>
        <draw></draw>
        <v-content>
            <v-dialog v-model="userPop" persistent max-width="500px">
                <v-card>
                    <v-card-title>
                        <h3>修改用户名或密码</h3>
                    </v-card-title>
                    <v-card-text>
                        <v-form ref="form">
                            <v-text-field label="用户名" prepend-icon="person" v-model="userName"></v-text-field>
                            <v-text-field label="密码" prepend-icon="lock" type="password" v-model="password"></v-text-field>
                            <v-layout>
                                <v-spacer></v-spacer>
                                <v-btn flat @click="cancel" v-if="!this.userLoading>0">取消</v-btn>
                                <v-btn type="submit" @click="onUserSubmit" :loading="this.userLoading>0" flat color="primary">
                                    提交
                                </v-btn>
                            </v-layout>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-dialog>
            <nuxt-child></nuxt-child>
        </v-content>
        <v-footer app>
            <v-layout align-center justify-center id="footer">
                &copy; 2018 POWERD BY
                <a target="_blank" href="https://github.com/myWsq/wsqcool-backend">WSQ.COOL BACKEND</a>
            </v-layout>
        </v-footer>
    </v-app>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import gql from 'graphql-tag';
import moment from 'moment';
import Draw from "../components/draw";
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
export default {
    components: { Draw },
    data() {
        return {
            routeName: {
                index: '仪表盘',
                'index-profile': '个人信息管理',
            },
            toolbarFloat: false,
            notifications: [],
            userForm: null,
            userPop: false,
            userLoading: 0,
            userName: "",
            password: "",
            notificationVisible: false

        }
    },
    computed: {
        ...mapState(['me', 'sideBar', 'isMobile']),
        userCreatedAt() {
            return moment(this.me.createdAt).fromNow()
        },
        // 获取排序后插入标题的数组的数组
        groupNotifications() {
            let tmp = [...this.notifications];
            tmp.sort((obj1, obj2) => {
                if (obj1.category === obj2.category) {
                    return 1
                } else {
                    return obj1.category - obj2.category
                }
            })
            let newArr = []
            let flag;
            tmp.forEach((item, index) => {
                if (flag !== item.category) {
                    newArr.push({
                        isCategory: true,
                        category: item.category
                    })
                    flag = item.category
                }
                newArr.push(item)
                if (index < tmp.length - 1 && index > 0) newArr.push({ isDivider: true, id: item.id })
            })
            return newArr
        }
    },
    methods: {
        ...mapMutations(['setMe', 'snackBarOpen', 'setSideBar']),
        async onUserSubmit(e) {
            e.preventDefault()
            if ((this.userName && this.userName.length > 0) || (this.password && this.password.length > 0)) {
                this.userLoading++;
                const mutation = gql`
                    mutation{
                    userReset(data:{
                        name:"${this.userName}"
                        password:"${this.password}"
                    }){
                        user{
                        id
                        name
                        createdAt
                        }
                    }
                }`;
                try {
                    const { data: { userReset: { user } } } = await this.$apollo.mutate({ mutation })

                    this.setMe(user)
                    this.snackBarOpen(`用户[${user.name}]信息修改成功`)
                    this.cancel()
                } catch (e) {
                    this.snackBarOpen(`用户信息修改失败, ${e.toString()}`)
                } finally {
                    this.userLoading--;
                }
            }


        },
        onScroll(e) {
            const offsetTop = window.pageYOffset || document.documentElement.scrollTop
            this.toolbarFloat = offsetTop > 0
        },
        logout() {
            this.$apolloHelpers.onLogout();
            this.setMe(null);
            this.snackBarOpen('注销成功')
            this.$router.push('/login');

        },
        cancel() {
            this.userPop = false
            this.$refs.form.reset();
        },
        fromNow(str) {
            return moment(str).fromNow()
        },
        async onClearNotification() {
            const mutation = gql`
                mutation{
                    clearNotification
                }
            `
            await this.$apollo.mutate({ mutation })
            this.notifications = []
        }
    },
    watch: {
        notificationVisible(newValue, oldValue) {
            if (newValue === false) {
                this.onClearNotification()
            }
        }
    },
    apollo: {
        notifications: {
            query: gql`{
                notifications{
                    id
                    title
                    content
                    category
                    time
                }
            }`
        },
        $subscribe: {
            notification: {
                query: gql`
                subscription{
                        notification{
                            title
                        }
                    }
                `,
                result({ data }) {
                    this.snackBarOpen(data.notification.title)
                    this.$apollo.queries.notifications.refetch()
                }
            }
        }
    }

}
</script>

<style scoped>

.nav-btn{
    height: 100%;
    margin: 0;
}
.v-menu__content.menuable__content__active {
    position: fixed;
}

#footer{
    color:#bcbcbc
}
#footer> a{
    text-decoration: none;
    margin-left: 0.4em;
}
</style>