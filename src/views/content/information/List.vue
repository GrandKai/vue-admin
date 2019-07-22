<template>
    <div>
        <el-breadcrumb class="crumb"
                       separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path : '' }">内容管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path : '/information' }">资讯管理</el-breadcrumb-item>
        </el-breadcrumb>
        <custom-page>

            <template slot="treeArea">
                <div>
                    <div class="btn-groups">
                        <el-button @click="treeOpen"><i class="el-icon-arrow-down"></i> 展 开</el-button>
                        <el-button @click="treeClose"><i class="el-icon-arrow-up"></i> 收 起</el-button>
                    </div>

                    <div class="tree">
                        <el-tree
                                v-if="treeIsShow"
                                class="filter-tree"
                                :data="treeData"
                                node-key="id"
                                :default-expand-all="isExpand"
                                :default-expanded-keys="defaultExpandKeys"
                                :expand-on-click-node="false"
                                highlight-current
                                @node-click="handleNodeClick"
                                style="max-height: 700px;overflow-y: auto" ref="tree">
                        </el-tree>
                    </div>

                </div>
            </template>
            <template slot="buttonArea">
                <li>
                    <el-button icon="el-icon-plus" type="primary" @click="addEntity">添加资讯</el-button>
                    <el-button icon="el-icon-search" type="primary" @click="queryPage()">查 询</el-button>
                    <el-button icon="el-icon-delete" @click="clearQueryParam">清 空</el-button>
                </li>
            </template>
            <template slot="queryArea">

                <li>
                    <el-input clearable
                              v-model="param.content.name"
                              placeholder="标题内容"
                              style="width: 220px"
                              @input="clearInput"
                              @keyup.native.enter="queryPage"></el-input>
                </li>
                <li>
                    <span>
                       <el-date-picker v-model="param.content.startTime"
                                       placeholder="发布开始时间"
                                       style="width: 195px"
                                       type="datetime"
                                       value-format="yyyy-MM-dd HH:mm:ss"
                                       @change="queryPage">
                        </el-date-picker> ~
                        <el-date-picker v-model="param.content.endTime"
                                        placeholder="发布结束时间"
                                        style="width: 195px"
                                        type="datetime"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        @change="queryPage">
                        </el-date-picker>
                    </span>
                </li>
            </template>
            <template slot="tableArea">
                <el-table border highlight-current-row stripe
                          v-loading="loading"
                          ref="multipleTable"
                          row-key="id"
                          :data="tableData"
                          :row-class-name="tableRowClassName"
                          @node-click="handleNodeClick"
                          @selection-change="handleSelectionChange">
                    <!-- 多选框 -->
                    <el-table-column  header-align="center" align="center" type="selection" width="50" :reserve-selection="true"></el-table-column>

                    <!-- 显示索引 -->
                    <el-table-column label="序号" header-align="center" align="center" width="50" :formatter="formatter"></el-table-column>
                    <el-table-column label="标题" prop="title" header-align="left" align="left" :formatter="common.emptyFormat"></el-table-column>
                    <el-table-column label="所属栏目" prop="catalogName" header-align="left" align="left" :formatter="common.emptyFormat"></el-table-column>
                    <el-table-column label="置顶级别" prop="topLevel" header-align="right" align="right" :formatter="common.emptyFormat" width="80"></el-table-column>

                    <el-table-column label="发布者" prop="publisher" header-align="right" align="right" :formatter="common.emptyFormat" width="120"></el-table-column>
                    <el-table-column label="点击量" prop="clickAmount" header-align="right" align="right" :formatter="common.emptyFormat" width="80"></el-table-column>
                    <el-table-column label="发布时间" prop="releaseTime" header-align="center" align="center" :formatter="common.emptyFormat" width="180"></el-table-column>

                    <el-table-column align="center" fixed="right" header-align="center" label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button type="text" @click="resetEntity(scope.row.id)">编辑</el-button>
                            <el-button type="text" @click="copyTextToClipboard(scope.row.id)">复制链接</el-button>
                            <el-button type="text" @click="copyTextToClipboard(scope.row.id)">复制ID</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>

            <template slot="paginationArea">
                <el-pagination background
                               v-show="paginationShow"
                               layout="total, sizes,prev, pager, next, jumper"
                               :current-page.sync="param.page.pageNum"
                               :page-size="param.page.pageSize"
                               :page-sizes="pageSizes"
                               :total="total"
                               @current-change="handleCurrentChange"
                               @size-change="handleSizeChange">
                </el-pagination>
            </template>
        </custom-page>

        <!-- 编辑权限系统信息对话框 -->
        <el-dialog :title="dlgSettings.title + '设置'" :visible.sync="dlgSettings.visible" width="30%"
                   :close-on-click-modal="false">
            <el-form :model="editForm" :rules="rules" ref="editForm" onsubmit="return false;">
                <div class="clearfix">
                    <el-form-item prop="content">
                        <el-input v-model.trim="editForm.content" placeholder="请输入内容" class="left role-input"
                                  :type="dlgSettings.inputType" :rows="dlgSettings.rowNum"
                                  @keyup.native.enter="onSubmit"></el-input>
                        <el-button @click="dlgSettings.visible = false" class="left">取 消</el-button>
                        <el-button type="primary" @click="onSubmit" class="left">保 存</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </el-dialog>

    </div>
</template>

<script>
    import CustomPage from 'components/treeCustomPage/Index';
    import treeDialog from 'components/dialogCustomPage/Index';
    import {
        queryEntityPage,
        updateEntityStopStatus,
        queryEntityRoleList,
        addEntityRoles,
        updateEntity,
        deleteEntity,
        resetEntity,
        checkUpdateExist
    } from 'apis/content/information';

    import {queryCatalogList} from 'apis/catalog';

    export default {
        components: {
            'custom-page': CustomPage,
            'treeDialog': treeDialog
        },
        data() {
            return {
                treeData: [],
                treeIsShow: true,
                defaultChecked: [],
                // 默认展开
                isExpand: false,
                // 树的选中节点
                currentTreeKey: "",
                defaultExpandKeys: [],

                // 修改的内容
                editForm: {
                    id: "",
                    property: "",
                    content: ""
                },

                loading: true,
                paginationShow: false,
                pageSizes: pageSizes,
                total: 0,
                param: {
                    content: {
                        name: '',
                        startTime: '',
                        endTime: '',
                        contCatalogId: '',
                        isLeaf: '',
                        level: ''
                    },
                    page: {
                        pageNum: 1,
                        pageSize: pageSizes[0]
                    }
                },
                rules: {},
                tableData: [],
                defaultPassword: 123456,

                // 弹出框属性设置
                dlgSettings: {
                    title: "", //  弹窗标题
                    visible: false, //  弹窗可见
                    inputType: "text", //  弹窗内文本框类型
                    rowNum: 1 //  文本框行数
                },

                dialogVisible: false,// 弹框是否显示
                title: '资讯角色设置',
                userId: '',// 资讯编号
            };
        },

        filters: {
            filterRoleNames(val) {
                if (val && 0 < val.length) {
                    return val.toString();
                } else {
                    return "--";
                }
            }
        },

        methods: {

            /**
             *  复制到剪贴板
             **/
            copyTextToClipboard(value) {
                let textArea = document.createElement("textarea");
                textArea.value = value;
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                try {
                    let successful = document.execCommand('copy');
                    if (successful == true) {
                        //console.log("复制输入框的值",textArea.value)
                        this.$message.success("复制成功！");
                    } else {
                        this.$message.error("该浏览器不支持点击复制到剪贴板");
                    }
                } catch (err) {
                    alert('该浏览器不支持点击复制到剪贴板');
                }
                document.body.removeChild(textArea);
            },

            /**
             * 根据所选系统查询树形数据
             */
            queryCatalogList() {
                queryCatalogList().then(data => {
                    // console.log('根据平台id查询所有栏目信息', data);
                    if (200 === data.code) {
                        let content = data.content;
                        this.treeData = common.toTree(content);
                        // 默认展开根节点
                        this.defaultExpandKeys = [this.treeData[0].id];
                    } else {
                        this.$message.error(data.message);
                    }
                });
            },

            /****************** 展开树 **********************/
            treeOpen() {
                common.treeOpen(this, 'tree');
            },
            /****************** 合并树 **********************/
            treeClose() {
                common.treeClose(this, 'tree');
            },

            handleNodeClick(item) {
                console.log('当前选中node节点:', item);

                //  点击的结点不是已经选择过的结点
                if (this.param.content.contCatalogId !== item.id) {

                    this.param.content.contCatalogId = item.id;
                    this.param.content.isLeaf = item.isLeaf;
                    this.param.content.level = item.level;

                    this.param.page.pageNum = 1;
                    this.searchByCondition();
                }

            },

            tableRowClassName({row, rowIndex}) {
                // 把每一行的索引放进row
                row.rowIndex = rowIndex;
            },

            formatter(row, column, cellValue, index) {
                //放回索引值
                return this.param.page.pageSize * (this.param.page.pageNum - 1) + 1 + row.rowIndex;
            },

            // 改变页码
            handleCurrentChange(val) {
                this.param.page.pageNum = val;
                this.queryPage();
            },
            // 改变每页显示多少条
            handleSizeChange(value) {
                this.param.page.pageSize = value;
                this.queryPage();
            },

            handleSelectionChange(val) {
                console.log('多选', val);
                // if (val) {
                //   this.multipleSelection = val;
                //   this.multipleSelectionLength = val.length;
                // }
            },

            /**
             * 分页查询
             * @param param
             */
            queryPage() {
                this.loading = true;
                queryEntityPage(this.param).then((resp) => {

                    this.loading = false;
                    this.paginationShow = true;

                    if (resp.content && resp.content.list) {
                        this.tableData = resp.content.list;
                        this.total = resp.content.total;
                    }
                }).catch(error => {
                    this.loading = false;
                });
            },

            searchByCondition() {
                this.param.page.pageNum = 1;
                this.queryPage();
            },

            // 清空查询条件
            clearQueryParam() {
                let contCatalogId = this.param.content.contCatalogId;
                this.param.content = {
                    name: '',
                    startTime: '',
                    endTime: '',
                    contCatalogId: contCatalogId,
                    isLeaf: '',
                    level: ''
                };
                this.$refs.tree.setCurrentKey(contCatalogId);
                this.queryPage();
                this.$refs.multipleTable.clearSelection();
            },
            clearInput() {
            },

            /********************************* 业务逻辑处理 ************************************/

            /**
             * 删除实体
             * @param id
             */
            deleteEntity(row) {
                // this.statusCheck(row, () => {
                common.confirm({
                    message: `确认删除【${row.nickName}】这个资讯？`,
                }).then(() => {
                    deleteEntity({content: row.userId}).then(resp => {
                        if (200 === resp.code) {
                            common.message({
                                message: resp.message,
                            });
                            this.queryPage();
                        }
                    });
                }).catch(() => {
                    // 取消按钮的回调
                    console.log('取消按钮的回调');
                });
                // });
            },
            resetEntity(row) {
                common.confirm({
                    message: `是否将【${row.name}】的密码恢复为${this.defaultPassword}？`,
                }).then(() => {
                    let param = {
                        content: {
                            userId: row.userId,
                            password: this.defaultPassword
                        }
                    };

                    resetEntity(param).then(data => {
                        if (200 === data.code) {
                            this.$message.success(data.message);
                            this.queryPage();
                        } else {
                            this.$message.error(data.message);
                        }
                    });
                }).catch(() => {
                    // 取消按钮的回调
                    console.log('取消按钮的回调');
                });
            },

            updateEntityEnabledStatus(row) {
                let text = row.isEnabled === '1' ? '停用' : '启用';
                let isEnabled = row.isEnabled === '1' ? '0' : '1';

                common.confirm({
                    message: `是否${text}【${row.name}】的账户？`
                }).then(() => {
                    let param = {
                        content: {
                            userId: row.userId,
                            isEnabled: isEnabled
                        }
                    };

                    updateEntityStopStatus(param).then(data => {
                        if (200 === data.code) {
                            this.$message.success(data.message);
                            this.queryPage();
                        } else {
                            this.$message.error(data.message);
                        }

                    });

                }).catch(_ => {
                });
            },

            // 创建资讯信息
            addEntity() {
                this.$router.push('/information/add');
            },

            /***************　打开修改系统对话框　*********************/
            updateEntity(row, rowName, dlgTitle) {
                console.log('修改的记录信息：', row);
                // 判断弹出框展示样式
                switch (rowName) {
                    default: {
                        this.dlgSettings = {title: dlgTitle, visible: true, inputType: "text", rowNum: 1};
                        break;
                    }
                }
                // 根据列名添加校验规则
                switch (rowName) {
                    case 'name': {
                        this.rules.content = [
                            {required: true, message: "请输入" + dlgTitle + "，长度在50个字符内", trigger: "blur", max: 50},
                            {validator: this.checkUpdateExist, trigger: "blur"}
                        ];
                        break;
                    }
                    case 'url': {
                        this.rules.content = [
                            {required: true, message: "请输入" + dlgTitle + "，长度在500个字符内", trigger: "blur", max: 500},
                        ];
                        break;
                    }
                    default: {
                        this.rules.content = [
                            {required: true, message: "请输入" + dlgTitle + "，长度在50个字符内", trigger: "blur", max: 50},
                        ];
                        break;
                    }
                }
                // 清空表单
                common.clearForm(this, "editForm");
                this.editForm = {
                    id: row.userId,
                    property: rowName,
                    content: row[rowName]
                };
            },

            /**
             * 校验资讯名是否存在
             * @param rule
             * @param value 资讯名
             * @param callback
             */
            checkUpdateExist(rule, value, callback) {
                let param = {
                    content: {
                        userId: this.editForm.id,
                        name: value
                    }
                };
                checkUpdateExist(param).then(data => {
                    if (200 === data.code) {
                        callback();
                    } else {
                        callback(new Error(data.message));
                    }
                });
            },

            /***************　提交修改信息　*********************/
            onSubmit() {
                this.$refs.editForm.validate(valid => {
                    if (valid) {
                        // 传入参数
                        let param = {
                            content: {
                                userId: this.editForm.id, // 修改记录的ID
                            }
                        };
                        // 修改记录的属性和属性值
                        param.content[this.editForm.property] = this.editForm.content;

                        updateEntity(param).then(data => {
                            this.dlgSettings.visible = false; // 对话框关闭
                            if (200 === data.code) {
                                this.$message.success(data.message);
                                this.queryPage();
                            } else {
                                this.$message.error(data.message);
                            }
                        });
                    }
                });
            },


            // 添加资讯角色信息
            addEntityRoles: function (param) {

                let vm = this;
                addEntityRoles({content: param}).then(data => {
                    if (200 === data.code) {
                        vm.$message.success(data.message);
                        vm.queryPage();
                    } else {
                        vm.$message.error(data.message);
                    }
                    vm.btnAbled = false;
                    vm.loading = false;
                    vm.dialogVisible = false;
                })

            }
        },
        created() {
            this.queryCatalogList();
        },
        mounted() {
            this.queryPage();
        }
    };
</script>


<style lang="scss" scoped>

    .click-text {
        color: #409eff;
        cursor: pointer;
    }

    .line {
        float: right;
    }
</style>


