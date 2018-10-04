<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
            <el-breadcrumb-item :to="{ path: '/' }">数据字典</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/dictionary/type' }">数据类型</el-breadcrumb-item>
        </el-breadcrumb>

        <custom-page>
            <template slot="queryArea">

                <li>
                    <el-input v-model="param.content.name" placeholder="数据类型名称/编码" @keyup.native.enter="queryPage"
                              style="width: 220px"
                              clearable @input="queryPage"></el-input>
                </li>

                <li>
                    <el-button type="primary" @click="queryPage()" icon="el-icon-search">查 询
                    </el-button>
                </li>
                <li>
                    <el-button @click="clearQueryParam" icon="el-icon-delete">清 空
                    </el-button>
                </li>
            </template>

            <template slot="buttonArea">
                <li>
                    <el-button type="primary" @click="addEntity"><i class="el-icon-plus"></i> 新建数据类型</el-button>
                </li>
            </template>

            <template slot="tableArea">
                <el-table :data="tableData" border stripe highlight-current-row
                          row-key="id" ref="multipleTable"
                          :row-class-name="tableRowClassName" v-loading="loading">

                    <!-- 显示索引 -->
                    <el-table-column
                            prop="module"
                            :formatter="formatter"
                            label="序号"
                            width="60" header-align="center" align="center">
                    </el-table-column>

                    <el-table-column label="数据类型名称" prop="name" header-align="left" align="left">
                        <template slot-scope="scope">
                            <div class="click-text" @click='updateEntity(scope.row , "name" , "数据类型名称")'>
                                {{ scope.row.name }}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column prop="code" label="数据类型编码" align="left">
                    </el-table-column>

                    <el-table-column label="显示顺序" header-align="left" align="left" fixed="right">
                        <template slot-scope="scope">
                            <div class="click-text" @click='updateEntity(scope.row , "sortNumber" , "显示顺序")'>
                                {{ scope.row.sortNumber}}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column label="是否显示" header-align="center" align="center" fixed="right">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.isShow === '1' ? 'success' : 'danger'" disable-transitions>
                                {{ scope.row.isShow === '1' ? '是' : '否'}}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" header-align="center" align="center" fixed="right">
                        <template slot-scope="scope">

                            <el-button type="text" @click="updateEntityStatus(scope.row)">
                                {{scope.row.isShow === '0' ? '显示' : '隐藏'}}
                            </el-button>

                            <el-button type="danger" @click="deleteEntity(scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>

            <template slot="paginationArea">
                <el-pagination v-show="paginationShow"
                               @current-change="handleCurrentChange"
                               @size-change="handleSizeChange"
                               background
                               :page-sizes="pageSizes"
                               :current-page.sync="param.page.pageNum" :page-size="param.page.pageSize"
                               layout="total, sizes,prev, pager, next, jumper" :total="total">
                </el-pagination>
            </template>
        </custom-page>


        <!-- 编辑【角色】信息对话框 -->
        <el-dialog :title="dlgSettings.title + '设置'"
                   :visible.sync="dlgSettings.visible"
                   width="30%"
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
    import CustomPage from 'components/listCustomPage/Index';
    import {queryDictionaryTypePage, updateDictionaryType, setDictionaryType} from 'apis/dictionary/type';

    export default {
        components: {
            'custom-page': CustomPage
        },
        data() {
            return {
                loading: true,
                paginationShow: false,
                pageSizes: pageSizes,
                total: 0,
                param: {
                    content: {
                        name: '',
                        startTime: '',
                        endTime: '',
                    },
                    page: {
                        pageNum: 1,
                        pageSize: pageSizes[0]
                    }
                },

                tableData: [],

                // 修改的内容
                editForm: {
                    id: "",
                    property: "",
                    content: ""
                },

                // 弹出框属性设置
                dlgSettings: {
                    title: "", // 弹窗标题
                    visible: false, // 弹窗可见
                    inputType: "text", // 弹窗内文本框类型
                    rowNum: 1 // 文本框行数
                },
                // 校验规则
                rules: {}
            }
        },

        created() {
            this.queryPage();
        },
        methods: {

            tableRowClassName({row, rowIndex}) {
                // 把每一行的索引放进row
                row.rowIndex = rowIndex
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

            /**
             * 分页查询
             * @param param
             */
            queryPage() {

                this.loading = true;
                queryDictionaryTypePage(this.param).then((data) => {

                    console.log('..............查询分页结果：', data);
                    this.loading = false;
                    this.paginationShow = true;

                    if (data.content && data.content.list) {
                        this.tableData = data.content.list;
                        this.total = data.content.total;
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
                this.param.content = {
                    name: '',
                    startTime: '',
                    endTime: '',
                };
                this.queryPage();
                this.$refs.multipleTable.clearSelection();
            },
            clearInput() {
                console.log("........................")
            },

            /********************************* 业务逻辑处理 ************************************/

            addEntity() {
                this.$router.push('/dictionary/type/add');
            },


            /***************　打开修改系统对话框　*********************/
            updateEntity(row, rowName, dlgTitle) {

                // 判断弹出框展示样式
                switch (rowName) {
                    case 'description': {
                        this.dlgSettings = {title: dlgTitle, visible: true, inputType: "textarea", rowNum: 4};
                        break;
                    }
                    default: {
                        this.dlgSettings = {title: dlgTitle, visible: true, inputType: "text", rowNum: 1};
                        break;
                    }
                }
                // 根据列名添加校验规则
                switch (rowName) {
                    case 'sortNumber': {
                        // 手动添加的数字校验
                        this.rules.content = [{validator: common.checkNumber, trigger: "blur"}];
                        break;
                    }
                    case 'name': {
                        this.rules.content = [
                            {required: true, message: "请输入" + dlgTitle + "，长度在50个字符内", trigger: "blur", max: 50},
                            // {validator: this.checkExist, trigger: "blur"}
                        ];
                        break;
                    }
                }
                // 清空表单
                this.clearForm("editForm");
                this.editForm = {
                    id: row.id,
                    property: rowName,
                    content: row[rowName]
                };
            },

            /***************  清空Form　*********************/
            clearForm(formName) {
                // 修改框未初始化时，不清空表单
                if (typeof this.$refs[formName] != "undefined") {
                    this.$refs[formName].resetFields();
                }
            },

            /**
             * 删除实体
             * @param id
             */
            deleteEntity(row) {
                // this.statusCheck(row, () => {
                //   common.confirm({
                //     message: `确认删除“${row.name}”？`,
                //   }).then(() => {
                //     deleteProduct({content: row.id}).then(resp => {
                //       if (200 === resp.status) {
                //         common.message({
                //           message: `${row.name}删除成功`,
                //         });
                //
                //         this.queryPage();
                //       }
                //     });
                //   }).catch(() => {
                //     // 取消按钮的回调
                //     console.log('取消按钮的回调');
                //   });
                // });
            },

            updateEntityStatus(row) {
                let text = row.isShow === '1' ? '隐藏' : '显示';
                let isShow = row.isShow === '1' ? '0' : '1';

                common.confirm({
                    message: `是否${text}【${row.name}】的数据类型？`,
                }).then(() => {
                    let param = {
                        content: {
                            id: row.id,
                            isShow: isShow
                        }
                    };
                    setDictionaryType(param).then(data => {
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

            /***************　提交修改信息　*********************/
            onSubmit() {
                this.$refs.editForm.validate(valid => {
                    if (valid) {
                        // 传入参数
                        let param = {
                            content: {
                                id: this.editForm.id, // 修改记录的ID
                            }
                        };
                        // 修改记录的属性和属性值
                        param.content[this.editForm.property] = this.editForm.content;

                        updateDictionaryType(param).then(data => {
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
        },
    }
</script>
<style scoped>

    .click-text {
        color: #409eff;
        cursor: pointer;
    }
</style>