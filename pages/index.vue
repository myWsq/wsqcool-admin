<template>
  <v-app>
    <v-content id="content">
      <v-layout justify-center>
        <v-card :style="cardStyle">
          <v-container>
            <v-layout align-center>
              <logo-svg id="logo" class="mr-2"></logo-svg>
              <h2>
                <a>wsq.cool</a> 管理员登录</h2>
            </v-layout>
            <v-form v-model="valid" ref="form" lazy-validation style="margin-top:2em">
              <v-text-field label="用户名" v-model="username" :rules="[v => !!v || '用户名不能为空']"></v-text-field>
              <v-text-field label="密码" type="password" v-model="password" :rules="[v => !!v ||'密码不能为空']"></v-text-field>
              <v-layout align-center>
                <v-checkbox :style="{flexGrow:0}" label="记住登录状态" v-model="remember"></v-checkbox>
                <v-layout :style="{flexGrow:1,marginBottom:'6px'}">
                  <v-tooltip right>
                    <v-icon color="accent" slot="activator" class="ml-1">help_outline</v-icon>
                    <span>如不勾选此项, 需要在1小时后重新登录</span>
                  </v-tooltip>
                </v-layout>
              </v-layout>
              <v-btn :loading="this.loading>0" @click.prevent="submit" type="submit" :disabled="!valid" color="primary" block large>
                提交
              </v-btn>
            </v-form>
          </v-container>
        </v-card>
      </v-layout>
    </v-content>
    <v-subheader id="footer">
      &copy; 2018 POWERD BY WSQ.COOL BACKEND
    </v-subheader>
  </v-app>
</template>

<script>
import LogoSvg from "../components/Logo/LogoSvg";
import { mapState, mapMutations } from 'vuex';
import gql from "graphql-tag";
export default {
  layout: 'empty',
  data() {
    return {
      username: "",
      password: "",
      remember: true,
      valid: true,
      loading: 0,
    }
  },
  computed: {
    ...mapState(['isMobile']),
    cardStyle() {
      return {
        width: '100%',
        maxWidth: '600px',
        height: this.isMobile ? '100vh' : 'auto',
        marginTop: !this.isMobile ? '2em' : `0`
      }
    }
  },
  methods: {
    ...mapMutations(['snackBarOpen']),
    async submit() {
      if (this.$refs.form.validate()) {
        this.loading++;
        // Native form submission is not yet supported
        const mutation = gql`         
            mutation{
              login(data:{
                password:"${this.password}"
                name:"${this.username}"
              }){
                token
              }
            }
        `
        console.log(mutation);
        
        try {
          await this.$apollo.mutate({ mutation })
        } catch (e) {
          this.snackBarOpen(e.toString());
        } finally {
          this.loading--;
        }
      }
    },
  },
  components: { LogoSvg }
}
</script>

<style scoped> 
#logo{
  height: 3em;
}
#content{
  min-height: 100vh;
  background: linear-gradient(bottom right,#0b4182 1%,#448aff 100% ) 
}
#footer{
  position: fixed;
  justify-content: center;
  bottom: 0;
  left: 50%;
  width: 100%;
  transform: translateX(-50%);
  color: #bcbcbc;
}
</style>