<template>
    <v-container grid-list-xl>
        <v-layout align-center justify-center class="mark" v-if="loading>0">
            <logo style="height:3em;"></logo>
        </v-layout>
        <v-layout else wrap style="min-height:100%">
            <v-flex xs12 md8>
                <v-subheader>编辑个人信息:</v-subheader>
                <v-card style="min-height:calc(100% - 2em);display:flex">
                    <v-card-text style="display:flex;flex-direction:column;">
                        <v-layout row wrap>
                            <v-flex xs12 sm6>
                                <v-text-field clearable label="昵称" v-model="info.name" hide-details></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6>
                                <v-text-field clearable label="邮箱" v-model="info.email" hide-details></v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-text-field clearable label="Github URL" v-model="info.github"></v-text-field>
                        <v-text-field clearable label="头像 URL ( 或Base 64 DATA_URI )" v-model="info.avatar"></v-text-field>
                        <v-textarea outline label="描述 ( 支持markdown )" auto-grow v-model="info.description" hide-details style="flex-grow:2"></v-textarea>
                        <v-layout justify-end>
                            <v-btn @click="submit" :disabled="!valid" flat color="primary" :loading="submitLoading>0">
                                提交
                            </v-btn>
                            <v-btn @click="reset" flat color="accent">还原</v-btn>
                        </v-layout>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs12 md4>
                <v-subheader>预览:</v-subheader>
                <info :src="info"></info>
            </v-flex>
        </v-layout>

    </v-container>
</template>

<script>
import gql from 'graphql-tag';
import { mapMutations, mapState } from 'vuex';
import Logo from "../../components/Logo/LogoSvg";
import Info from "../../components/info";
export default {
    components: { Logo, Info },
    data() {
        return {
            info: {
                name: '',
                description: '',
                avatar: '',
                github: '',
                email: '',
            },
            loading: 0,
            submitLoading: 0,
            valid: true,

        }
    },
    computed: {
        ...mapState(['isMobile'])
    },
    methods: {
        ...mapMutations(['load', 'dump', 'snackBarOpen']),
        async submit() {

            const mutation = gql`
                mutation($input:UpdateInfoInput!){
                    updateInfo(data:$input){
                        name
                        description
                        avatar
                        github
                        email
                    }
                }
            `;
            const variables = { input: this.info };
            this.submitLoading++;
            try {
                await this.$apollo.mutate({ mutation, variables })
                this.snackBarOpen(`信息修改成功`)
            } catch (e) {
                this.snackBarOpen(`信息修改失败, ${e.toString()}`)
            } finally {
                this.submitLoading--
            }
        },
        reset() {
            this.$apollo.queries.info.refetch()
        }
    },
    apollo: {
        info: {
            query: gql`{
                    info{
                        name
                        description
                        avatar
                        github
                        email
                    }
                }
            `,
            manual: true,
            loadingKey: 'loading',
            result({ data: { info } }) {
                if (info) {
                    let tmp = {}
                    for (let k of Object.keys(this.info)) {
                        tmp[k] = info[k]
                    }
                    this.info = tmp
                }
            }
        }
    }
}
</script>

<style scoped>
.mark{
    position: absolute;
    background-color: #fff;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
}
</style>