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
                // ws地址
                const wsUrl = process.env.WS_API + sessionStorage.getItem("userName")
                this.webSocket = new WebSocket(wsUrl)
                this.webSocket.onopen = this.onOpen;
                this.webSocket.onerror = this.onError;
                this.webSocket.onmessage = this.onMessage;
                this.webSocket.onclose = this.closeWebSocket;
            },
            /**
             * 关闭连接
             **/
            closeWebSocket() {
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
                console.log("WebSocket 接收到数据：", e)
            },
            /**
             * 向服务器发送数据
             * @param data
             */
            onSendData(data) {
                this.webSocket.send(data)
            }
        }
    }
</script>

<style scoped>

</style>
