<template>
    <div>
    </div>
</template>

<script>
    export default {
        name: "WebSocket",
        data() {
            return {
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
                // this.server.message = e.data
            },
            /**
             * 向服务器发送数据
             * @param data
             */
            sendData(data) {
                this.webSocket.send(data)
            }
        }
    }
</script>

<style scoped>

</style>
