<template>
    <div>
        <el-breadcrumb class="crumb"
                       separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path : '' }">内容管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path : '/information' }">资讯管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path : '/information/add' }">{{ !this.$route.query.id ? '添加资讯' : '修改资讯'}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row>
            <el-col :span="14">
                <el-form label-width="130px" ref="form" :model="form" :rules="rules">

                    <el-row>
                        <el-form-item label="选择栏目" prop="catalogId">

                            <el-cascader
                                    :options="options"
                                    :props="{ expandTrigger: 'hover', value: 'id' }"
                                    v-model.trim="form.catalogId" filterable clearable style="width: 100%"
                                    @change="handleChange">
                                <template slot-scope="{ node, data }">
                                    <span>{{ data.label }}</span>
                                    <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                                </template>
                            </el-cascader>

                        </el-form-item>
                    </el-row>

                    <el-form-item label="标题" prop="title">
                        <el-input v-model.trim="form.title" placeholder="请输入标题"></el-input>
                    </el-form-item>

                    <el-form-item label="摘要">
                        <el-input type="textarea" :rows="4" v-model.trim="form.summary" placeholder="请输入摘要"></el-input>
                    </el-form-item>

                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="作者" prop="author">
                                <el-input v-model.trim="form.author" placeholder="请输入作者"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="来源">
                                <el-input v-model.trim="form.source" placeholder="请输入来源"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-form-item label="来源地址">
                        <el-input v-model.trim="form.sourceAddress" placeholder="请输入来源地址"></el-input>
                    </el-form-item>


                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="置顶级别" prop="topLevel">
                                <el-input v-model.trim="form.topLevel" placeholder="请输入置顶级别"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="置顶到期时间">
                                <el-date-picker type="datetime" v-model.trim="form.topEndTime"
                                                value-format="yyyy-MM-dd HH:mm:ss"
                                                placeholder="请选择置顶到期时间" style="width: 100%"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="发布时间">
                                <el-date-picker type="datetime" v-model.trim="form.releaseTime"
                                                value-format="yyyy-MM-dd HH:mm:ss"
                                                placeholder="请选择发布时间" style="width: 100%"></el-date-picker>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="封面图片" prop="coverImage">
                                <el-upload
                                        ref="upload"
                                        class="avatar-uploader"
                                        action=""
                                        :show-file-list="false"
                                        :http-request="uploadRequest"
                                        :on-exceed="handleExceed"
                                        :on-preview="handlePictureCardPreview"
                                        :before-upload="beforeAvatarUpload">

                                    <img v-if="form.coverImage" :src="form.coverImage" class="avatar">
                                    <i v-else class="el-icon-plus"></i>
<!--                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
                                    <!--                            <div slot="tip" class="el-upload__tip">请上传400宽400高的图片，仅限一张图片</div>-->
                                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB,仅限一张图片</div>
                                </el-upload>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-form-item label="内容" prop="content">
                        <ckeditor
                                id="editorContent"
                                name="editor"
                                :config="config"
                                :value.sync="form.content"
                                @input="onChange"
                        ></ckeditor>
                    </el-form-item>

                    <el-form-item label="关联标签">

                    </el-form-item>

                    <el-form-item label="关联资讯">
                        <div style="text-align: left">
                            <el-button type="primary" @click="setRelationEntities" icon="el-icon-edit">编辑关联资讯</el-button>

                            <p style="font-size: 13px; line-height: 18px; margin-top: 10px;margin-bottom: 10px">已关联资讯，使用鼠标拖拽调整顺序</p>

                            <div class="table">
                                <el-table :data="selectedTableData"
                                          :show-header="true"
                                          :highlight-current-row="true"
                                          :row-class-name="tableRowClassName"
                                          size="mini"
                                          row-key="id"
                                          border>

                                    <el-table-column property="title" min-width="160px" label="资讯名称" header-align="left" align="left"></el-table-column>
                                    <el-table-column align="center" fixed="right" header-align="center" label="操作" width="80">
                                        <template slot-scope="scope">
                                            <el-button type="text" @click="deleteItem(scope.row)">删除</el-button>
<!--                                            <el-button type="text" @click="moveUp(scope.row)">上移</el-button>-->
<!--                                            <el-button type="text" @click="moveDown(scope.row)">下移</el-button>-->
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </el-form-item>

                    <el-form-item>
                        <el-button class="submit" type="success" @click="onSubmit">提交</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

        <el-dialog title="编辑关联资讯" :visible.sync="dialogTableVisible" :close-on-click-modal="false" :close-on-press-escape="false" v-dialogDrag>
            <custom-page>
                <template slot="queryArea">
                    <li>
                        <el-input clearable
                                  v-model="param.content.name"
                                  placeholder="标题内容"
                                  style="width: 220px"
                                  @input="clearInput"
                                  @keyup.native.enter="queryPage"></el-input>
                    </li>
                </template>

                <template slot="buttonArea">
                    <li>
                        <el-button icon="el-icon-search" type="primary" @click="queryPage()">查 询</el-button>
                        <el-button icon="el-icon-delete" @click="clearQueryParam">清 空</el-button>
                    </li>
                </template>

                <template slot="tableArea">
                    <el-table :data="tableData" ref="multipleTable"
                              style="height: 440px;overflow-y: auto"
                              :show-header="true"
                              v-loading="loading"
                              :highlight-current-row="true"
                              size="mini"
                              border
                              align="left"
                              :row-class-name="tableRowClassName"
                              @selection-change="handleSelectionChange"
                              row-key="id">

                        <el-table-column :reserve-selection="true" type="selection" width="35" :selectable="checkSelectable"></el-table-column>

                        <el-table-column property="catalogName" min-width="50em" label="所属栏目" header-align="left" align="left"></el-table-column>
                        <el-table-column property="title" min-width="130em" label="资讯名称" header-align="left" align="left"></el-table-column>
                        <el-table-column property="createTime" min-width="50em" label="创建时间" header-align="center" align="center"></el-table-column>
                    </el-table>

                </template>

                <template slot="paginationArea">
                    <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                   ref="multipleTablePagination"
                                   v-show="paginationShow"
                                   :current-page="param.page.pageNum" :page-size="param.page.pageSize" background
                                   :page-sizes="pageSizes"
                                   layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>

                </template>

            </custom-page>

            <el-divider></el-divider>

            <div style="text-align: left">
                <el-alert  type="info" :closable="false">

                    <el-tag
                            :key="tag.id"
                            v-for="tag in selectedItems"
                            closable size="large"
                            :disable-transitions="false"
                            @close="handleClose(tag)">
                        {{tag.title}}
                    </el-tag>
                </el-alert>

            </div>

            <div slot="footer" class="dialog-footer">
<!--                <el-button @click="">取 消</el-button>-->
                <el-button type="primary" @click="saveAssociation">保 存</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>

    import CustomPage from 'components/listCustomPage/Index';
    import {addEntity, getEntity, queryEntityPageSimple, uploadImage} from 'apis/content/information';
    import {queryEntityList as queryAssociationList} from 'apis/content/association';
    import CKEditor from '@/components/ckeditor/CKEditor';
    import Sortable from 'sortablejs';

    export default {
        components: {
            'custom-page': CustomPage,
            'ckeditor': CKEditor
            // 'plat-update-dialog': PlatUpdate
        },
        watch: {
            'form.catalogId': function (newVal, oldVal) {
                if (newVal instanceof Array) {
                    // console.log("修改了栏目id", newVal);
                    this.form.catalogId = newVal[newVal.length - 1];
                }

            },
            'form.content': function (newVal, oldVal) {
                // console.log("父组件 form.content 值修改：", newVal, oldVal);
            },
        },
        data() {
            return {
                loading: true,
                paginationShow: false,
                tableData: [],
                total: 0,
                pageSizes: pageSizes,
                dialogTableVisible: false,

                // 选中的 tags
                selectedItems: [],

                param: {
                    content: {
                        category: '',
                        name: '',
                    },
                    page: {
                        pageNum: 1,
                        pageSize: pageSizes[0]
                    }
                },

                selectedTableData: [],
                config: {
                    height: '300px',
                    width: '100%',
                    filebrowserImageUploadUrl: `${process.env.urlPrefix}/article/upload`,
                    // filebrowserFlashUploadUrl: "/api/informationManager/uploadEditorVideo/" + this.username
                },

                form: {
                    id: '',
                    catalogId: '',
                    title: '',
                    coverImage: '',
                    summary: '',
                    author: '',
                    source: '',
                    sourceAddress: '',
                    topLevel: '1',
                    topEndTime: '',
                    releaseTime: '',
                    content: '',

                    information: [],
                    labels: []

                },

                options: [],
                // 校验规则
                rules: {
                    catalogId: [
                        {
                            required: true,
                            message: '请选择栏目',
                            trigger: 'change'
                        }
                    ],
                    title: [
                        {
                            required: true,
                            message: '请输入标题',
                            trigger: 'blur'
                        },
                    ],
                    author: [
                        {
                            required: true,
                            message: '请输入作者',
                            trigger: 'blur'
                        }
                    ],
                    topLevel: [
                        {
                            required: true,
                            message: '请输入置顶级别',
                            trigger: 'blur'
                        }
                    ],
                    content: [
                        {
                            validator: this.validateContent,
                            required: true,
                            trigger: ['blur', 'change']
                        }
                    ],
                }
            };
        },
        mounted: function () {
            this.queryCatalogList();
            this.form.catalogId = this.$route.query.contCatalogId;
            // 表格中需要实现行拖动，所以选中tr的父级元素
            this.rowDrop();

            this.form.id = this.$route.query.id;
            this.$nextTick(_ => {
                // id 存在则说明是编辑页面
                if (this.form.id) {
                    this.getEntity();
                    this.queryAssociationList();
                }
            });

        },
        methods: {
            // 检查该行是否可以被选中
            checkSelectable(row) {
                return row.id !== this.form.id;
            },

            // 表格行移动
            rowDrop() {
                const tbody = document.querySelector('.el-table__body-wrapper tbody');
                const _this = this;
                Sortable.create(tbody, {
                    onEnd({ newIndex, oldIndex }) {
                        const currRow = _this.selectedTableData.splice(oldIndex, 1)[0];
                        _this.selectedTableData.splice(newIndex, 0, currRow);
                    }
                })
            },
            tableRowClassName({row, rowIndex}) {
                // 把每一行的索引放进row
                row.rowIndex = rowIndex;
            },

            formatter(row, column, cellValue, index) {
                //放回索引值
                return this.param.page.pageSize * (this.param.page.pageNum - 1) + 1 + row.rowIndex;
            },
            queryAssociationList() {
                let param = {
                    content: {
                        sourceId: this.form.id
                    }
                };
                queryAssociationList(param).then(data => {
                    if (200 === data.code) {
                        this.selectedTableData = data.content;
                    } else {
                        this.$message.error(data.message);
                    }
                });
            },
            deleteItem(row) {
                // 1. 清除已选 tag，指向的相同的地址，可以直接清除
                this.selectedTableData.splice(this.selectedTableData.indexOf(row), 1);
            },
            moveUp(row) {

            },
            moveDown(row) {

            },
            // 保存关联关系
            saveAssociation() {
                // 将选中的值赋值给主页面
                this.selectedTableData = this.selectedItems;
                this.dialogTableVisible = false;
            },
            handleClose(tag) {
                let index = this.selectedItems.indexOf(tag);
                // 去除 tag 选中
                this.selectedItems.splice(index, 1);
                // 去除表格选中
                this.$refs.multipleTable.selection.splice(index, 1);
            },
            handleSelectionChange(rows) {
                // 新增/修改
                this.selectedItems = rows;
            },
            handleSizeChange(val) {
                this.param.page.pageSize = val;
                this.queryPage();
            },
            handleCurrentChange(val) {
                this.param.page.pageNum = val;
                this.queryPage();
            },

            // 清空查询条件
            clearQueryParam() {
                this.param.content.name = '';
                this.param.content.category = '';
                this.param.page.pageNum = 1;
                this.param.page.pageSize = pageSizes[0];

                this.queryPage();
            },

            clearInput() {
                this.queryPage();
            },
            queryPage() {

                this.loading = true;
                queryEntityPageSimple(this.param).then((resp) => {

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

            setRelationEntities() {
                // 打开对话框
                this.dialogTableVisible = true;

                // console.log("主页面选中的数组：", this.selectedTableData);

                this.$nextTick(_ => {
                    // 1. 清空子页面选中
                    this.$refs.multipleTable.clearSelection();

                    // 2. 从主页面复制选中的元素给子页面（勾选tag）
                    this.selectedItems = this.selectedTableData.concat();
                    // this.selectedItems = [...this.selectedTableData];

                    // 3. 勾选子 table
                    this.selectedItems.forEach(item => this.$refs.multipleTable.selection.push(item));

                    // 4. 重置分页为第一页
                    this.$refs.multipleTablePagination.lastEmittedPage = 1;
                    this.param.page.pageNum = 1;
                    this.queryPage();

                    // 编辑
                    if (!common.isEmpty(this.$route.query.id)) {

                    } else {
                        // 新增
                    }
                });
            },
            handlePictureCardPreview(file) {
                // console.log("preview image file..........", file);
                this.form.coverImage = file.url;
                this.dialogVisible = true;
            },
            uploadRequest(param) {
                // console.log("上传参数：", param);
                //创建临时的路径来展示图片
                let windowURL = window.URL || window.webkitURL;
                // this.form.coverImage = windowURL.createObjectURL(param.file);

                let file = param.file;
                let fileName = param.file.name;
                let fileType = fileName.split(".")[fileName.split('.').length - 1];

                // console.log('.........................', file.row);
                let formData = new FormData();

                // 通过append向form对象添加数据
                formData.append('file', file);
                // 通过append向form对象添加数据
                formData.append('fileType', fileType);
                // 通过append向form对象添加数据
                // formData.append('fileId', fileId);
                // 添加form表单中其他数据
                formData.append('fileName', fileName);

                uploadImage(formData).then(data => {
                    if (200 === data.code) {
                        let content = data.content;
                        this.form.coverImage = content.url;
                        console.log("资讯上传图片结果：", content);
                    } else {
                        this.$message.error(data.message);
                    }

                    // 验证上传的图片
                    this.$refs["form"].validateField("coverImage");
                })
            },

            // 上传文件个数超过定义的数量
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件，请删除后继续上传`)
            },

            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG && !isPNG) {
                    this.$message.error('上传的图片只能是 JPG/PNG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传的图片大小不能超过 2MB!');
                }
                return (isJPG || isPNG) && isLt2M;
            },

            queryCatalogList() {
                common.queryCatalogList(data => this.options = data);
            },

            getEntity() {
                let param = {
                    content: this.form.id
                };
                getEntity(param).then(data => {
                    if (200 === data.code) {
                        let content = data.content;

                        this.form.id = content.id;
                        this.form.catalogId = content.catalogId;
                        this.form.title = content.title;

                        this.form.coverImage = content.coverImage;
                        this.form.summary = content.summary;
                        this.form.author = content.author;

                        this.form.source = content.source;
                        this.form.sourceAddress = content.sourceAddress;
                        this.form.topLevel = content.topLevel;

                        this.form.topEndTime = content.topEndTime;
                        this.form.releaseTime = content.releaseTime;
                        this.form.content = content.content;

                        console.warn("初始化实体内容", this.form.content);
                        // this.$nextTick(_ => {
                        //     setTimeout(_ => {
                        //         this.$refs["form"].validate();
                        //     }, 300);
                        // });
                    } else {
                        this.$message.error(data.message);
                    }
                });

            },
            validateContent(rule, value, callback) {
                // console.log("内容验证:规则：", rule, "，值：", value ,"，回调：", callback);
                if (value === "" || value.length === 0) {
                    callback(new Error("请输入内容"));
                } else {
                    callback();
                }
            },
            onBlur(value) {
                // console.log("父组件富文本onBlur事件", value);
                this.form.content = value;
                this.$refs["form"].validateField("content");
            },
            onChange(value) {
                // console.log("父组件富文本onChange事件：", value);
                this.form.content = value;
                this.$refs["form"].validateField("content");
            },
            handleChange(value) {
                // console.log(value);
            },

            // 提交表单
            onSubmit() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        let information = [];
                        // 1. 设置关联资讯

                        // console.log("主页面缓存的数据", this.selectedTableData);
                        this.selectedTableData.forEach(item => information.push({"associationId": item.id, "sourceType": "INFORMATION", "sortNumber": item.sortNumber}));
                        this.form.information = information;

                        let param = {
                            content: this.form
                        };
                        addEntity(param).then(data => {
                            if (200 === data.code) {
                                this.$message.success(data.message);
                                this.$router.push("/information");
                            } else {
                                this.$message.error(data.message);
                            }
                        });
                    }
                });
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-tag {
        margin-right: 10px;
        margin-bottom: 10px;
    }

    .button-new-tag {
        margin-right: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }

    .input-new-tag {
        width: 90px;
        margin-right: 10px;
        vertical-align: bottom;
    }

    .click-text {
        color: #409eff;
        cursor: pointer;
    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 220px;
        height: 220px;
        line-height: 220px;
        text-align: center;
    }

    .avatar {
        width: 220px;
        height: 220px;
        display: block;
    }

    .submit {
        display: block;
        width: 60%;
    }
</style>

