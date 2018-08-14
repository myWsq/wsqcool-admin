<template>
    <v-app v-if="me">
        <v-toolbar app :flat="!toolbarFloat">
            <v-layout align-center style="height:100%" v-scroll="onScroll">
                <router-link to="/"> <img src="@/assets/logo.svg" id="logo"></router-link>
                <a href="https://wsq.cool" target="_blank">
                    <h1>wsq.cool</h1>
                </a>
                <v-spacer></v-spacer>
                <v-btn flat icon>
                    <v-icon>notifications_none</v-icon>
                </v-btn>
                <v-menu offset-y style="height:100%" :nudge-top="-5" @keyup.enter="onUserSubmit">
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
            </v-layout>
        </v-toolbar>
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
        <v-footer></v-footer>
    </v-app>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import gql from 'graphql-tag';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
export default {
    data() {
        return {
            toolbarFloat: false,
            notifications: [],
            userForm: null,
            userPop: false,
            userLoading: 0,
            userName: "",
            password: "",

        }
    },
    computed: {
        ...mapState(['me']),
        userCreatedAt() {
            return moment(this.me.createdAt).fromNow()
        }
    },
    methods: {
        ...mapMutations(['setMe', 'snackBarOpen']),
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
                }
            }`
        }
    }

}
</script>

<style scoped>
a{
    text-decoration: none;
}
#logo{
    height: 3rem;
    margin-right: .5em;
    vertical-align: middle;
}
.nav-btn{
    height: 100%;
    margin: 0;
}
</style>