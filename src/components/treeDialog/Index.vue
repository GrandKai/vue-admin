<template>
    <div>
        <el-dialog v-dialogDrag width="500px" :title="title"
                   :before-close="closeDialog"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :visible.sync="dialogVisible">
            <div class="clearfix">
                <el-form label-width="120px" ref="form" :model="form" :rules="rules">
                    <el-input v-model="userId" style="display: none" type="text"></el-input>
                    <el-input v-model="filterText" placeholder="输入关键字进行过滤" clearable>
                    </el-input>
                    <el-tree show-checkbox ref="tree" node-key="id" v-model="form.roleIds" class="filter-tree"
                             :data="treeData" :filter-node-method="filterNode" :default-expand-all="true"
                             :default-checked-keys="checkDatas">
                    </el-tree>
                </el-form>
            </div>
            <span class="dialog-footer" slot="footer">
                <el-button type="primary" :loading="isload" :disabled="btnAbled" @click="add">保 存</el-button>
                <el-button @click="closeDialog">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                // 修改的内容
                form: {
                    userId: '',
                    roleIds: []
                },
                isload: false,
                filterText: '',//关键字
                btnAbled: false,
                checkDatas: [],//树形结构选中数据
            };
        },
        props: ['dialogVisible', 'title', 'rules', 'treeData', 'userId', 'checkData'],
        watch: {
            'dialogVisible': function (newVal, oldVal) {
                let vm = this;
                if (!newVal) { // 如果关闭当前页
                    // 打开确定按钮
                    vm.isload = false;
                }
            },
            filterText(val) {
                this.$refs.tree.filter(val);
            },
            checkData: function (newVal, oldVal) {
                let vm = this;
                vm.checkDatas = newVal;

                // console.log('设置平台角色关系绑定', newVal, vm.$refs.tree);
                /*vm.$nextTick(function() {
                  vm.$refs.tree.setCheckedNodes(vm.checkDatas);
                });*/

                if (vm.$refs.tree) {
                    vm.$refs.tree.setCheckedNodes(vm.checkDatas);
                }

            },
        },
        mounted() {
            let vm = this;
        },
        methods: {
            // 关闭之前, 调用父组件的方法, 重置dialogVisibleLog
            closeDialog: function () {
                this.filterText = '';
                this.$refs.form.resetFields();
                this.$emit('closeDialog');
            },
            filterNode(value, data) {//根据关键字查询
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },

            // 保存用户的角色信息
            add() {
                let vm = this;
                vm.$refs.form.validate(valid => {
                    let keys = vm.$refs.tree.getCheckedNodes();
                    let roleList = [];
                    keys.forEach(item => {
                        if (item.parentId) {
                            roleList.push(item.id);
                        }
                    });

                    if (valid) {
                        let param = {
                            userId: vm.userId,
                            roleIds: roleList
                        };
                        vm.$refs.form.resetFields();
                        vm.isload = true;
                        vm.$nextTick(function () {
                            vm.$emit('addUserRoles', param); // 回调参数
                        });
                    }
                });

            }
        },
        computed: {
            // 保存按钮是否禁用
            // btnAbled: function() {
            //   let vm = this;
            //   if (!common.isEmpty(vm.form.userId)) {
            //     return false;
            //   } else {
            //     return true;
            //   }
            // }
        }
    };
</script>

<style scoped>

</style>

