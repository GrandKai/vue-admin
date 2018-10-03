<template>
    <div class="home">

        aaaaaaaaaaaaaaaaa
        <img alt="Vue logo" src="../assets/logo.png">
    </div>
</template>

<script>
    // @ is an alias to /src
    import HelloWorld from '@/components/HelloWorld.vue'

    import {queryGrantedOperationList} from 'apis/general/operation'

    export default {
        created: function () {
            this.login();
        },
        methods: {

            queryGrantedOperationList1() {

                let param = {
                    content: {
                        menuId: ''
                    }
                };

                queryGrantedOperationList(param).then(data => {
                    console.log('根据菜单id查询操作权限', data);
                });
            },

            login() {
                let param = {
                    content: {
                        username: 'GrandKai',
                        password: '123456'
                    }
                };

                this.$http.post("/auth/login", param).then(data => {
                    this.$message.success(data.message);

                    if (200 === data.code) {
                        let content = data.content;
                        let user = content.user;
                        let accessToken = content.accessToken;
                        let refreshToken = content.refreshToken;
                        sessionStorage.setItem('accessToken', accessToken);
                        sessionStorage.setItem('refreshToken', refreshToken);
                    }
                });
            }
        }
    }
</script>
