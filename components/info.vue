<template>
    <v-card class="info-card">
        <div class="media">
            <div class="top" />
            <div class="avatar-container">
                <v-avatar :size="130" color="white lighten-4" class="avatar">
                    <img :src="avatarValid ? src.avatar:require('assets/avatar.svg') " alt="avatar">
                </v-avatar>
            </div>
        </div>
        <v-card-text>
            <h2 style="text-align:center" class="mb-3">{{src.name && src.name.length>0 ? src.name : '佚名' }}</h2>
            <div style="color:grey" v-if="src.description && src.description.length>0" v-html="$marked(src.description)"></div>
            <p style="color:grey" v-else>没有描述</p>
        </v-card-text>
        <v-divider style="margin-top:-1.5em"></v-divider>
        <v-layout justify-center>
            <v-btn icon :disabled="!githubValid">
                <v-icon>fab fa-github</v-icon>
            </v-btn>
            <v-btn flat icon color="primary" :href="`Mailto:${src.email}`" :disabled="!emailValid">
                <v-icon>far fa-envelope</v-icon>
            </v-btn>
        </v-layout>
    </v-card>
</template>

<script>
import v from 'validator'
export default {
    props: {
        src: {
            type: Object,
            default: {}
        },
    },
    computed: {
        emailValid() {
            return this.src.email ? v.isEmail(this.src.email) : false
        },
        githubValid() {
            return this.src.github ? v.isURL(this.src.github) : false
        },
        avatarValid() {
            return this.src.avatar ? v.isDataURI(this.src.avatar) || v.isURL(this.src.avatar) : false
        }
    },
}
</script>

<style scoped>
.info-card{
    max-width: 400px;
}
.top{
    position: absolute;
    top: 0;
    background-color: #448aff;
    width: 100%;
    height:100px;
}

.avatar-container{
    border-radius: 50%;
    border: 3px solid aliceblue;
    position: absolute;
    top: 50px;
    left: 50%;
    transform: translate(-50%,0);
    z-index: 1;
}
.media{
    position: relative;
    width: 100%;
    height: 180px;
}
</style>