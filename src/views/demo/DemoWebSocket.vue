<template>
    <div>
        <el-form ref="form" :model="form" label-width="180px">
            <el-form-item label="发送消息">
                <el-input type="textarea" v-model="form.desc" autofocus ref="textarea"></el-input>
            </el-form-item>
            <el-form-item label="服务器接收到的消息">
                <el-input type="textarea" v-model="server.message" :autosize="{ minRows: 12, maxRows: 6 }"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "WebSocket",
        data() {
            return {
                form: {
                    desc: ''
                },
                server: {
                    message: ''
                },
                webSocket: null
            }
        },
        created() {
            // 页面刚进入时开启长连接
            this.initWebSocket()
        },
        destroyed() {
            // 页面销毁时关闭长连接
            this.closeWebSocket()
        },
        methods: {
            initWebSocket() {
                console.log('初始化 websocket：', process.env)
                // ws地址
                const wsUrl = process.env.wsUrl + sessionStorage.getItem("userName")
                this.webSocket = new WebSocket(wsUrl)
                this.webSocket.onopen = this.onOpen;
                this.webSocket.onerror = this.onError;
                this.webSocket.onmessage = this.onMessage;
                this.webSocket.onclose = this.closeWebSocket;
            },
            /**
             * 关闭连接
             **/
            closeWebSocket(e) {
                console.log("WebSocket 关闭：", e);
            },
            /**
             * 打开连接
             **/
            onOpen() {
                console.log("WebSocket 连接成功")
            },
            /**
             * 连接错误
             **/
            onError(e) {
                console.log("WebSocket 连接发生错误:", e)
            },
            /**
             * 接收数据
             **/
            onMessage(e) {
                let message = e.data
                // type: 'info',
                this.$notify({
                    title: '消息中心',
                    iconClass: 'el-icon-warning-outline',
                    message: message,
                    position: 'bottom-right',
                    onClick: function () {
                        console.log('点击 notification 回调函数')
                    }
                });
                console.log("WebSocket 接收到数据：", e)
                this.server.message = this.server.message + '\r' + e.data
                // this.server.message = e.data
            },
            /**
             * 向服务器发送数据
             * @param data
             */
            sendData(data) {
                this.webSocket.send(data)
            },
            onSubmit() {
                console.log('submit!');
                this.sendData(this.form.desc)
                this.form.desc = ''
                this.$refs.textarea.focus()
            }
        }
    }
</script>

<style scoped>

</style>
