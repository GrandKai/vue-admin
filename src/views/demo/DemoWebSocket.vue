<template>
    <div>
        <el-form ref="form" :model="form" label-width="180px">
            <el-form-item label="发送给">
                <el-input v-model="form.toUser"></el-input>
            </el-form-item>

            <el-form-item label="发送消息">
                <el-input type="textarea" v-model="form.message" autofocus ref="textarea"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {sendMessage} from '@/apis/websocket'
    export default {
        name: "WebSocket",
        data() {
            return {
                form: {
                    toUser: 'test',
                    message: ''
                }
            }
        },
        created() {
        },
        methods: {
            onSubmit() {
                console.log('submit!');
                // 1. 使用 websocket 发布消息
                // this.sendData

                // 2. 使用 restful 发布消息

                let param = {
                    content: this.form
                }
                sendMessage(param).then(data => {
                    console.log('发送消息结果：', data)
                    if (200 === data.code) {
                    }
                });

                // this.form.message = ''
                this.$refs.textarea.focus()
            }
        }
    }
</script>

<style scoped>

</style>
