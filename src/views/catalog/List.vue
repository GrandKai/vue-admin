<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
            <el-breadcrumb-item :to="{ path: '/' }">栏目管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/catalog' }">栏目管理</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 栏目区域 -->
        <tree-from>
            <template slot="queryArea">
            </template>
            <!-- 按钮区域 -->
            <template slot="buttonArea">
                <el-button type="primary" @click="addEntity" :disabled="addDisabled"><i class="el-icon-plus"></i> 新 建
                </el-button>
                <el-button @click="treeOpen"><i class="el-icon-arrow-down"></i> 展 开</el-button>
                <el-button @click="treeClose"><i class="el-icon-arrow-up"></i> 收 起</el-button>
                <el-button type="danger" @click="deleteEntity" :disabled="deleteDisabled"><i class="el-icon-delete"></i>
                    删 除
                </el-button>
            </template>

            <!-- 树区域 -->
            <template slot="treeArea">
                <el-tree :data="treeData"
                         :props="defaultProps"
                         @node-click="handleNodeClick"
                         default-expand-all
                         highlight-current
                         :show-checkbox="false"
                         :expand-on-click-node="false"
                         node-key="id"
                         ref="tree" v-show="treeIsShow">
                </el-tree>
            </template>

            <!-- 表单区域 -->
            <template slot="formArea">
                <el-form :model="form" :rules="rules" ref="form" label-width="100px" :disabled="formDisabled" enctype="multipart/form-data">

                    <el-form-item label="栏目名称" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>

                    <el-form-item label="显示顺序" prop="sortNumber">
                        <el-input v-model="form.sortNumber"></el-input>
                    </el-form-item>

                    <el-form-item label="栏目显示" prop="isShow" align="left">
                        <el-switch v-model="form.isShow"
                                   active-value="1"
                                   inactive-value="0"
                                   active-text="显示"
                                   inactive-text="隐藏"
                                   active-color="#13ce66"
                        ></el-switch>
                    </el-form-item>

                    <el-form-item label="栏目图标" prop="image">
<!--                        <el-input v-model="form.image"></el-input>-->

<!--                        :action="uploadImageUrl"-->
                        <el-upload
                                ref="upload"
                                class="avatar-uploader"
                                action=""
                                :show-file-list="false"
                                :http-request="uploadRequest"
                                :on-exceed="handleExceed"
                                :before-upload="beforeAvatarUpload">
                            <img v-if="form.image" :src="form.image" class="avatar">

                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
<!--                            <div slot="tip" class="el-upload__tip">请上传400宽400高的图片，仅限一张图片</div>-->
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB,仅限一张图片</div>
                        </el-upload>
                    </el-form-item>

                    <el-form-item label="栏目描述" prop="description">
                        <el-input type="textarea" :rows="10" v-model="form.description"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="onSubmit('form')">提交</el-button>
                    </el-form-item>
                </el-form>
            </template>
        </tree-from>
    </div>
</template>

<script>
    import TreeForm from 'components/business/treeForm/Index';
    import {queryCatalogList, addCatalog, updateCatalog, deleteCatalog, uploadCatalogImage} from 'apis/catalog';

    const sortNumber = 10;
    const isShow = '1';

    export default {
        components: {
            'tree-from': TreeForm
        },
        watch: {},

        data() {
            return {
                accessToken: sessionStorage.getItem('accessToken'),
                // 所有系统信息
                options: [],

                addDisabled: true,
                deleteDisabled: true,
                // formDisabled: true,
                formDisabled: true,

                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                treeData: [],
                treeIsShow: true,

                // 表单信息
                form: {
                    id: '',
                    name: '',
                    image: '',

                    sortNumber: sortNumber,
                    description: '默认栏目描述',
                    isShow: isShow,

                    parentId: '',
                },
                rules: {
                    name: [
                        {required: true, message: '请输入栏目名称', trigger: 'blur'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
                    ],
                    description: [
                        {required: true, message: '请输入栏目描述', trigger: 'blur'},
                        {min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur'}
                    ],
                    // image: [
                    //     {required: false, message: '', trigger: 'blur'}
                    // ],
                    sortNumber: [
                        {required: true, validator: common.checkNumber, trigger: "blur"}
                    ],
                    isShow: [
                        {required: true, message: "请选择栏目显示状态", trigger: "blur"}
                    ],
                }
            };
        },
        created() {
            this.init();
        },
        methods: {


            uploadRequest(param) {
                console.log("上传参数：", param);
                //创建临时的路径来展示图片
                let windowURL = window.URL || window.webkitURL;
                this.form.image = windowURL.createObjectURL(param.file);

                let file = param.file;
                let fileName = param.file.name;
                let fileType = fileName.split(".")[fileName.split('.').length - 1];

                console.log('.........................',file.row)
                let formData = new FormData();

                // 通过append向form对象添加数据
                formData.append('file', file);
                // 通过append向form对象添加数据
                formData.append('fileType', fileType);
                // 通过append向form对象添加数据
                // formData.append('fileId', fileId);
                // 添加form表单中其他数据
                formData.append('fileName', fileName);

                uploadCatalogImage(formData).then(data => {
                    if (200 === data.code) {
                        let content = data.content;
                        this.form.image = content.url;
                        console.log("catalog 上传图片结果：", content);
                    } else {
                        this.$message.error(data.message);
                    }

                    // 验证上传的图片
                    this.$refs["form"].validateField("image");
                })
            },

            // 上传文件个数超过定义的数量
            handleExceed (files, fileList) {
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

            /**
             * 根据所选系统查询树形数据
             */
            init() {
                this.addDisabled = true;
                this.deleteDisabled = true;

                queryCatalogList().then(data => {
                    if (200 === data.code) {
                        let content = data.content;
                        console.log('根据平台id查询所有栏目信息', content);
                        this.treeData = common.toTree(content);
                        console.log("树数据..............................：", this.treeData);
                    } else {
                        this.$message.error(data.message);
                    }
                });
            },

            addEntity() {

                common.confirm({
                    message: `是否确定添加默认栏目？`,
                }).then(() => {

                    let currentNodeKey = this.$refs.tree.getCurrentKey();
                    let parentId = currentNodeKey ? currentNodeKey : '';

                    let param = {
                        content: {
                            // 所选系统id
                            id: '',
                            parentId: parentId,
                            name: '默认栏目',
                            description: '默认栏目描述',
                            image: '',
                            sortNumber: sortNumber,
                            isShow: isShow,
                        }
                    };

                    addCatalog(param).then(data => {
                        if (200 === data.code) {
                            let newEntity = data.content;
                            newEntity.label = newEntity.name;

                            this.$message.success(data.message);
                            this.$refs.form.resetFields();

                            let currentNodeData = this.$refs.tree.getCurrentNode();
                            // console.log('currentNodeData:', currentNodeData);

                            // 向当前节点下添加子节点
                            if (currentNodeData) {
                                if (!currentNodeData.children) {
                                    this.$set(currentNodeData, 'children', []);
                                }
                                currentNodeData.children.push(newEntity);
                            }

                            common.sort(currentNodeData.children);
                            this.setNodeForm(newEntity.id, newEntity);

                        } else {
                            this.$message.error(data.message);
                        }
                    });
                }).catch(_ => {
                });
            },

            /**
             * 设置节点选中，并设置表单信息
             * @param currentNodeId
             * @param currentNode
             */
            setNodeForm(currentNodeId, currentNode) {
                // 设置选中树节点，并出发 node-click 设置对应的表单信息
                this.$nextTick(() => {
                    this.$refs.tree.setCurrentKey(currentNodeId);
                    this.handleNodeClick(currentNode);
                });
            },

            updateParentChildren(callBack) {
                let currentNodeKey = this.$refs.tree.getCurrentKey();

                // 更新node-key的子节点
                let node = this.$refs.tree.getNode(currentNodeKey);

                let parent = node.parent;
                let parentNodeKey = parent.data.id;
                let children = parent.data.children;

                callBack(parentNodeKey, children, currentNodeKey);
            },

            updateEntity() {
                let param = {
                    content: this.form
                };
                updateCatalog(param).then(data => {
                    if (200 === data.code) {
                        this.$message.success(data.message);
                        this.$refs.form.resetFields();

                        let updatedEntity = data.content;
                        updatedEntity.label = updatedEntity.name;

                        this.updateParentChildren((parentNodeKey, children, currentNodeKey) => {

                            let ary = [];
                            for (let i = 0; children && i < children.length; i++) {
                                let item = children[i];
                                if (item.id === currentNodeKey) {
                                    if (item.children) {
                                        updatedEntity.children = item.children;
                                    }
                                    ary.push(updatedEntity);
                                } else {
                                    ary.push(item);
                                }
                            }
                            common.sort(ary);
                            this.$refs.tree.updateKeyChildren(parentNodeKey, ary);
                            this.setNodeForm(currentNodeKey, updatedEntity);
                        });

                    } else {
                        this.$message.error(data.message);
                    }
                });
            },
            deleteEntity() {

                let currentNodeKey = this.$refs.tree.getCurrentKey();

                common.confirm({
                    message: `请确认删除的是最底层子节点栏目信息！`
                }).then(() => {
                    let param = {
                        content: currentNodeKey
                    };
                    deleteCatalog(param).then(data => {
                        if (200 === data.code) {
                            this.$message.success(data.message);

                            this.updateParentChildren((parentNodeKey, children, currentNodeKey) => {

                                let ary = [];
                                for (let i = 0; children && i < children.length; i++) {
                                    let item = children[i];
                                    if (item.id !== currentNodeKey) {
                                        ary.push(item);
                                    }
                                }
                                this.$refs.tree.updateKeyChildren(parentNodeKey, ary);
                                this.$refs.form.resetFields();
                            });
                            // 删除成功后，刷新树的信息
                        } else {
                            this.$message.error(data.message);
                        }
                    });
                }).catch(_ => {
                });

            },
            treeOpen() {

            },
            treeClose() {

            },

            // 【清除表单验证】
            clearFormValidate(formName) {
                if (typeof(this.$refs[formName]) != 'undefined') {
                    this.$refs[formName].clearValidate();
                }
            },

            handleNodeClick(item) {
                console.log('当前选中node节点:', item);

                this.clearFormValidate('form');
                this.addDisabled = false;
                // 根目录无法删除
                if ('2034515a43434d6f9a6dbd8970cf536a' === item.id) {
                    this.deleteDisabled = true;
                    this.formDisabled = true;
                } else {
                    this.formDisabled = false;

                    // 如果该条目下含有子条目则无法删除
                    if (item.children && item.children.length > 0) {
                        this.deleteDisabled = true;
                    } else {
                        this.deleteDisabled = false;
                    }
                }

                if (item && item.id) {

                    // 设置选中的表单信息
                    this.form.id = item.id;
                    this.form.name = item.name;
                    this.form.image = item.image;

                    this.form.sortNumber = item.sortNumber;
                    this.form.description = item.description;
                    this.form.isShow = item.isShow;
                    this.form.parentId = item.parentId;
                }
            },

            onSubmit(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        common.confirm({
                            message: `是否确定对该栏目执行此次操作？`,
                        }).then(() => {
                            this.updateEntity();
                        }).catch(() => {
                        });
                    } else {
                        console.error('error submit!!');
                        return false;
                    }
                });
            }


        }
    }
</script>


<style lang="scss" scoped>
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
        /*width: 178px;*/
        /*height: 178px;*/
        line-height: 300px;
        text-align: center;
    }
    .avatar {
        width: 100%;
        height: 300px;
        display: block;
    }
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }

    .sysSpan {
        font-size: 14px;
        font-weight: bold;
        margin-right: 10px;
    }

    .menu {
        margin-top: 20px;
        min-width: 1200px;
    }

    .menu-left, .menu-right {
        float: left;
        width: 450px;
    }

    .menu-left {
        margin-right: 150px;
        margin-left: 20px;
    }

    .submit {
        display: block;
        width: 60%;
        margin: 0 auto;
    }

    .menu-select {
        margin-bottom: 30px;
    }

    .el-tree {
        max-height: 700px;
        overflow: auto;
        margin-top: 20px;
    }
</style>