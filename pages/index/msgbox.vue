<template>
    <v-container :grid-list-xl="!isMobile" :class="{'pa-0':isMobile}">
        <v-layout justify-space-between>
            <v-subheader>全部留言</v-subheader>
            <div>
                <v-btn flat color="accent" :disabled="this.selected.size<=0" @click.stop="del" :loading="deleteLoading">删除</v-btn>
                <v-btn flat color="primary" :disabled="this.selected.size<=0">回复</v-btn>
                <v-btn icon :loading="loading>0" @click.stop="refresh" v-if="!isMobile">
                    <v-icon>refresh</v-icon>
                </v-btn>
            </div>
        </v-layout>

        <v-layout wrap v-if="this.messages.length>0">
            <v-flex xs12 lg6 xl4 v-for="item in messages" :key="item.id">
                <v-card :class="{'selected':selected.has(item.id)}" class="card">
                    <div @click.stop="toggle(item.id)" class="card-item">
                        <v-card-text>
                            <h3 class="primary--text mb-2">{{item.name}}
                                <span style="color:#bcbcbc;font-size:0.9rem">{{$moment(item.createdAt).fromNow()}}</span>
                            </h3>
                            <div v-html="$marked(item.content)" />
                        </v-card-text>
                        <v-card-actions style="color:#bcbcbc">
                            <v-spacer></v-spacer>
                            {{item.host}}&nbsp;{{item.email}}
                        </v-card-actions>
                    </div>
                </v-card>

            </v-flex>
        </v-layout>
        <v-layout v-else justify-center style="height:100%">
            <img :src="require('assets/empty.svg')" style="width:30%;">
        </v-layout>
    </v-container>
</template>

<script>
import gql from 'graphql-tag'
import { mapState, mapMutations } from "vuex";
export default {
    data() {
        return {
            messages: [],
            selected: new Set([]),
            loading: 0,
            deleteLoading: 0,
            replayLoading: 0,
        }
    },
    computed: {
        ...mapState(['isMobile'])
    },
    methods: {
        ...mapMutations(['snackBarOpen']),
        clear() {
            let tmp = this.selected;
            tmp.clear()
            this.selected = new Set(tmp)
        },
        toggle(id) {
            let tmp = this.selected;
            if (tmp.has(id)) tmp.delete(id)
            else tmp.add(id)
            this.selected = new Set(tmp)
        },
        async del() {
            if (confirm('确定删除吗?')) {
                this.deleteLoading++;
                try {
                    const { data: { deleteMessages } } = await this.$apollo.mutate({
                        mutation: gql`
                        mutation($input:[Int!]!){
                            deleteMessages(ids:$input)
                        }
                    `,
                        variables: {
                            input: this.selected
                        }
                    })
                    this.clear()
                    this.refresh()
                    this.snackBarOpen(`成功删除了${deleteMessages}条留言`)
                } catch (e) {
                    this.snackBarOpen(`删除失败, ${e.toString()}`)
                } finally {
                    this.deleteLoading--;
                }
            }
        },
        refresh() {
            this.$apollo.queries.messages.refetch()
        }
    },
    mounted() {
        window.addEventListener('click', this.clear)
    },
    apollo: {
        messages: {
            query: gql`{
                    messages{
                        id
                        name
                        host
                        email
                        ip
                        content
                        createdAt
                    }
                }
            `,
            loadingKey: 'loading',
        }
    }
}

</script>

<style scoped>
.card{
    transition: all;
    transition-duration: 0.1s;
}
.selected{
    background-color: rgba(0, 0, 0, 0.03);
}
.card-item{
    border-top: 1px #efefef solid;
    cursor: pointer;
}

</style>