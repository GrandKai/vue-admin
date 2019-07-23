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
                    <el-button icon="el-icon-delete" type="danger" @click="deleteEntity">删 除</el-button>

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
                    <el-table-column header-align="center" align="center" type="selection" width="50" :reserve-selection="true"></el-table-column>

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
                            <el-button type="text" @click="updateEntity(scope.row)">编辑</el-button>
                            <el-button type="text" @click="copyTextToClipboard(scope.row.id, '复制链接成功！')">复制链接</el-button>
                            <el-button type="text" @click="copyTextToClipboard(scope.row.id, '复制ID成功！')">复制ID</el-button>
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


    </div>
</template>

<script>
    import CustomPage from 'components/treeCustomPage/Index';
    import treeDialog from 'components/dialogCustomPage/Index';
    import {
        queryEntityPage,
        updateEntity,
        deleteEntity,
    } from 'apis/content/information';

    export default {
        components: {
            'custom-page': CustomPage,
            'treeDialog': treeDialog
        },
        data() {
            return {
                multipleSelection: [],

                treeData: [],
                treeIsShow: true,
                defaultChecked: [],
                // 默认展开
                isExpand: false,
                defaultExpandKeys: [],

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
                tableData: [],
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
            copyTextToClipboard(value, message) {
                let textArea = document.createElement("textarea");
                textArea.value = value;
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                try {
                    let successful = document.execCommand('copy');
                    if (successful == true) {
                        //console.log("复制输入框的值",textArea.value)
                        this.$message.success(message);
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
                common.queryCatalogList(data => {
                    this.treeData = data;
                    // 默认展开根节点
                    let root = data[0];
                    this.defaultExpandKeys = [root.id];

                    this.$nextTick(() => {
                        this.$refs.tree.setCurrentKey(root.id);
                        this.handleNodeClick(root);
                    });
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
                if (val) {
                    this.multipleSelection = val;
                }
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
             */
            deleteEntity() {
                // let selection = this.$refs.multipleTable.selection;
                let selection = this.multipleSelection;

                if (0 === selection.length) {
                    this.$message.warning("至少选择一条资讯进行删除！");
                    return false;
                }
                let ids = selection.map(item => item.id);
                console.log('选中的结点信息', ids);
                common.confirm({
                    message: `此操作将永久删除该资讯, 是否继续？`,
                }).then(() => {
                    deleteEntity({content: ids}).then(data => {
                        if (200 === data.code) {
                            common.message({
                                message: data.message,
                            });
                            this.queryPage();
                        }
                    });
                });
            },

            // 创建资讯信息
            addEntity() {
                this.$router.push({
                    path: '/information/add',
                    query: {
                        contCatalogId: this.param.content.contCatalogId
                    }
                });
            },

            // 修改资讯信息
            updateEntity(row) {
                this.$router.push({
                    path: "/information/add",
                    query: {
                        id: row.id,
                        contCatalogId: this.param.content.contCatalogId
                    }
                });
            },

        },
        created() {
            this.queryCatalogList();
        },
        mounted() {
            // this.queryPage();
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


