<template>
    <div>
        <div class="header-class">
            <div>
                <img :src="expandSrc" alt="伸展" class="expand" @click="expandSideMenu">
            </div>
            <ul class="button-class">

                <li class="icon-class">
                    <el-button type="text" size="large"><i class="el-icon-user"></i> {{nickName}}</el-button>
                </li>

                <li class="icon-class" @click="modifyAvatar">
                    <el-button type="text" size="large"><i class="el-icon-setting"></i> 修改头像</el-button>
                </li>

                <li class="icon-class" @click="modifyPasswordVisible = true">
                    <el-button type="text" size="large"><i class="el-icon-lock"></i> 修改密码</el-button>
                </li>

                <li class="icon-class" @click="logout">
                    <el-button type="text" size="large"><i class="el-icon-switch-button"></i> 退出</el-button>
                </li>

                <li class="icon-class">
                    <el-dropdown @command="changePlat">
                        <span class="el-dropdown-link">{{platName}}<i class="el-icon-arrow-down el-icon--right"></i></span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="item in options" :key="item.id" :command="item">{{item.name}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </li>

            </ul>

        </div>

        <modify-password :modifyPasswordVisible="modifyPasswordVisible" @closePasswordDialog="closePasswordDialog"></modify-password>

        <el-dialog v-dialogDrag title="修改头像" :visible.sync="modifyAvatarVisible" :close-on-click-modal="false" :close-on-press-escape="false">
            <!--  左对齐失效，这是使用插槽进行控制  -->
            <div slot="title" style="text-align: left">
                <h2>修改头像</h2>
            </div>
            <cropper></cropper>

            <!--  加入footer，增加了距离底部的高度  -->
            <span slot="footer" class="dialog-footer"></span>
        </el-dialog>

        <web-socket></web-socket>
    </div>
</template>

<script>
    import Menu from '@/layout/Menu'
    import { queryGrantedPlats } from '@/apis/auth'
    import expandSrc from 'images/expan.jpg'

    import {mapGetters, mapActions} from 'vuex'
    import Cropper from '@/components/cropper/Cropper'
    import WebSocket from '@/components/socket/WebSocket'
    import ModifyPassword from '@/components/modifyPassword/Index'

    export default {
        components: {
            Menu,
            Cropper,
            WebSocket,
            ModifyPassword
        },
        computed: {
            ...mapGetters(['platId', 'accessToken'])
        },
        data() {
            return {
                expandSrc,
                modifyAvatarVisible: false,
                modifyPasswordVisible: false,

                options: [],
                minHeight: '',

                platName: '',
                userName: '',
                nickName: '',
                menuIsShow: false,
                treeData: []

            }
        },
        created() {
            this.queryGrantedPlats();
            this.userName = sessionStorage.getItem('userName');
            this.nickName = sessionStorage.getItem('nickName');
        },
        mounted() {
            window.onresize = () => {
                this.getMainHeight()
            }
        },
        methods: {
            ...mapActions([
                'expandMenu', 'logout'
            ]),

            closePasswordDialog() {
                this.modifyPasswordVisible = false
            },
            changePlat(item) {
                this.platName = item.name;
                this.$store.dispatch('changePlat', item.id)
            },

            queryGrantedPlats() {

                this.$nextTick(_ => {
                    let param = {
                        accessToken: this.accessToken
                    };
                    queryGrantedPlats(param).then(data => {
                        if (200 === data.code) {
                            let content = data.content;
                            this.options = content;

                            if (content && 0 < content.length) {
                                // 默认选中第一个系统
                                this.changePlat(content[0]);
                            }
                        } else {
                            this.$message.error(data.message);
                        }

                    });
                })
            },

            expandSideMenu() {
                this.expandMenu();
            },

            logout() {
                common.confirm({message: '此操作将退出系统，请确认操作！'}).then(() => {
                    this.$store.dispatch('changeMenusByPlatId', []);
                    this.$store.dispatch('changePlat', '');
                    // this.logout();
                    sessionStorage.clear();
                    this.$router.push('/login');
                }).catch(() => {
                    // 取消按钮的回调
                    console.log('取消按钮的回调');
                });
            },

            modifyAvatar() {
                this.modifyAvatarVisible = true

            },

        },
    }
</script>

<style lang="scss" scoped>
    .el-dropdown {
        line-height: 60px !important;
        padding-right: 20px;
        padding-left: 10px;
    }
    .el-button--text {
        color: #606266;
    }

    .header-class {
        height: 60px;
        display: flex;
        /*border: solid 1px red;*/
        justify-content: space-between;
        align-items: center
    }

    .icon-class {
        /*margin-right: 20px*/
        line-height: 60px;
        /*margin-right: -5px !important;*/
    }
    .icon-class:last-child {
        width: 120px;
    }

    .button-class {
        display: flex;
        justify-content: center;
        list-style-type: none;
    }


    .el-dropdown-link {
        cursor: pointer;
        font-size: 12px;
        /* FIXME 为什么 在 ul > li 设置中不生效*/
        /*color: #409EFF;*/
    }

    .expand {
        /*float: left;*/
        /*margin-top: 20px;*/
        margin-left: 20px;
        cursor: pointer;
    }

</style>
