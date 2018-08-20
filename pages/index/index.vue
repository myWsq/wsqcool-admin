<template>
    <v-container grid-list-xl style="height:100%">
        <v-layout wrap>
            <v-flex xs12 sm6 md4>
                <v-card>
                    <v-card-text>
                        <v-layout justify-space-between>
                            <v-icon>done</v-icon>
                            <v-layout></v-layout>
                        </v-layout>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs12 sm6 md4>
                <v-card>
                    1
                </v-card>
            </v-flex>
            <v-flex xs12 sm6 md4>
                <v-card>
                    1
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
export default {
    data() {
        return {
            cardMock: [{
                title: '浏览量(PV)',
                data: 20,
            }]
        }
    },
}
</script>

<style scoped>

</style>