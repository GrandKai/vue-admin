<template>
    <div>
        <div class="header_class">
            <img :src="expandSrc" alt="伸展" class="expand" @click="expandSideMenu">
            <ul>
                <li>
                    <i class="ele-icon-third-gerenzhongxin"></i>
                    <span>{{nickName}}</span>
                </li>

                <li @click="modifyAvatar">
                    修改头像
                </li>

                <li @click="dialogFormVisible = true">
                    <i class="ele-icon-third-password-modify"></i>
                    <span>修改密码</span>
                </li>
                <li @click="logout">
                    <i class="ele-icon-third-logout"></i>
                    <span>退出</span>
                </li>
                <li>
                    <span>
                        <el-dropdown @command="changePlat">
                            <span class="el-dropdown-link">{{platName}}<i class="el-icon-arrow-down el-icon--right"></i></span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="item in options" :key="item.id" :command="item">{{item.name}}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </span>
                </li>
            </ul>
        </div>

        <el-dialog v-dialogDrag title="修改密码" :visible.sync="dialogFormVisible" width="25%" :close-on-click-modal="false" :close-on-press-escape="false">

            <el-form ref="form" :model="form" label-width="110px" label-position="right" :rules="rules">
                <el-form-item label="原密码：" prop="oldPassword">
                    <el-input :type="type" v-model="form.oldPassword">
                        <i slot="suffix" class="el-input__icon el-icon-view" @click="changeType"></i>
                    </el-input>
                </el-form-item>
                <el-form-item label="新密码：" prop="newPassword">
                    <el-input :type="type" v-model="form.newPassword" placeholder="密码必须为6-12位数字、符号或字母">
                        <i slot="suffix" class="el-input__icon el-icon-view" @click="changeType"></i>
                    </el-input>
                </el-form-item>
                <el-form-item label="重复新密码：" prop="repeatPassword">
                    <el-input :type="type" v-model="form.repeatPassword" placeholder="密码必须为6-12位数字、符号或字母">
                        <i slot="suffix" class="el-input__icon el-icon-view" @click="changeType"></i>
                    </el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit">确 定</el-button>
            </div>
        </el-dialog>

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
    import {queryGrantedPlats, modifyPassword} from '@/apis/auth'
    import expandSrc from 'images/expan.jpg'

    import {mapGetters, mapActions} from 'vuex'
    import Cropper from '@/components/cropper/Cropper'
    import WebSocket from '@/components/socket/WebSocket'

    export default {
        components: {
            Menu,
            Cropper,
            WebSocket
        },
        computed: {
          ...mapGetters(['platId', 'accessToken'])
        },
        data() {
            return {
                type: 'password',
                expandSrc,
                modifyAvatarVisible: false,
                dialogFormVisible: false,
                form: {
                    oldPassword: '',
                    newPassword: '',
                    repeatPassword: ''
                },
                rules: {
                    oldPassword: [
                        {required: true, message: "原密码不能为空！", trigger: "blur"}
                    ],
                    newPassword: [
                        {required: true, message: "新密码不能为空！", trigger: "blur"},
                        {pattern: /^[0-9a-zA-Z!@#$%^&*-=_+]{6,12}$/, message: "密码必须为6-12位数字、符号或字母", trigger: "blur"},
                        {required: true, validator: this.checkSecretOldSame, message: "新密码不能与原密码相同！", trigger: "blur"},
                        // { required: true, validator:this.checkSecretSame, message: "两次输入密码不一致！",trigger: "blur" }
                    ],
                    repeatPassword: [
                        {required: true, message: "重复新密码不能为空！", trigger: "blur"},
                        {pattern: /^[0-9a-zA-Z!@#$%^&*-=_+]{6,12}$/, message: "密码必须为6-12位数字、符号或字母", trigger: "blur"},
                        {required: true, validator: this.checkSecretSame, message: "两次输入密码不一致！", trigger: "blur"}
                    ]
                },

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
                'expandMenu'
            ]),

            changePlat(item) {
                this.platName = item.name;
                this.$store.dispatch('changePlat', item.id)
            },

            queryGrantedPlats() {
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
            },

            expandSideMenu() {
                this.expandMenu();
            },

            logout() {
                common.confirm({message: '此操作将退出系统，请确认操作！'}).then(() => {
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

            onSubmit() {
                this.$refs["form"].validate(valid => {
                    console.log('修改密码验证结果', valid);
                    if (valid) {
                        let param = {
                            accessToken: this.accessToken,
                            content: this.form,
                        };
                        modifyPassword(param).then(data => {
                            if (200 === data.code) {
                                this.$message.success(data.message);
                                // 重置表单
                                this.$refs.form.resetFields();
                                // 隐藏对话框
                                this.dialogFormVisible = false;
                                // 清空 session
                                sessionStorage.clear();
                                // 跳转到登陆页
                                this.$router.push('/login');
                            } else {
                                this.$message.error(data.message);
                            }
                        });
                    }
                })
            },

            checkSecretSame(rule, value, callback) {
                if (this.form.repeatPassword !== this.form.newPassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            },
            checkSecretOldSame(rule, value, callback) {
                if (value === this.form.oldPassword) {
                    callback(new Error('新密码不能与原密码相同!'));
                } else {
                    callback();
                }
            },
            changeType() {
                if ('password' === this.type) {
                    this.type = 'input';
                } else {
                    this.type = 'password';
                }
            }
        },
    }
</script>

<style lang="scss" scoped>

    .header_class {
        height: 60px;

        > ul {
            float: right;

            > li {
                font-size: 12px;
                float: left;
                margin-right: 20px;
                line-height: 60px;
                cursor: pointer;

                i,
                span {
                    display: inline-block;
                    vertical-align: middle;
                }

                i {
                    margin-right: 6px;
                }
            }
        }
    }


    .el-header {
        text-align: center;
        background-color: #FFF;
        line-height: 60px;
    }

    .main-content {
        padding: 20px;
    }


    .el-dropdown-link {
        cursor: pointer;
        font-size: 12px;
        /* FIXME 为什么 在 ul > li 设置中不生效*/
        /*color: #409EFF;*/
    }

    .expand {
        float: left;
        margin-top: 20px;
        margin-left: 18px;
        cursor: pointer;
    }

</style>
