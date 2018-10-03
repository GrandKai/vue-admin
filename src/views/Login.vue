<template>
    <div class="home">
        <img alt="Vue logo" src="../assets/logo.png">
        <el-button @click="jump2MainPage">跳转到主页面</el-button>
    </div>
</template>

<script>

    import {queryGrantedOperationList} from 'apis/general/operation'
    import {login, queryGrantedMenus, queryGrantedPlats} from 'apis/auth'

    export default {
        created: function () {
            this.login();
            this.queryGrantedOperationList();

            this.queryGrantedMenus();
            this.queryGrantedPlats()
        },
        methods: {
            queryGrantedMenus() {
                let param = {
                    content: {
                        userId: '1',
                        platId: '5bcae4a6036f43709877191f3bcb4283'
                    }
                };
                queryGrantedMenus(param).then(data => {
                    if (200 === data.code) {
                        let content = data.content;
                        console.log(data.message, content);
                    } else {
                        this.$message.error(data.message);
                    }
                });

            },
            queryGrantedPlats() {
                let param = {
                    content: '1'
                };
                queryGrantedPlats(param).then(data => {
                    if (200 === data.code) {
                        let content = data.content;
                        console.log(data.message, content);
                    } else {
                        this.$message.error(data.message);
                    }

                });
            },
            queryGrantedOperationList() {
                let param = {
                    content: {
                        menuId: '18f5a38372d2418bab2aa2e14f126a17'
                    }
                };
                queryGrantedOperationList(param).then(data => {
                    console.log('根据菜单id查询操作权限', data);
                });
            },

            /**
             * 登录成功后跳转到登录页面
             */
            jump2MainPage() {
                this.$router.push("/");
            },

            login() {
                let param = {
                    content: {
                        username: 'GrandKai',
                        password: '123456'
                    }
                };

                login(param).then(data => {
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
