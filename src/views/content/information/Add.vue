<template>
    <div>
        <el-breadcrumb class="crumb"
                       separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path : '' }">内容管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path : '/information' }">资讯管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path : '/information/add' }">添加资讯</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row>
            <el-col :span="20">
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
                                        :before-upload="beforeAvatarUpload">
                                    <img v-if="form.coverImage" :src="form.coverImage" class="avatar">

                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
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
                                @blur="onBlur"
                        ></ckeditor>
                    </el-form-item>

                    <el-form-item>
                        <el-button class="submit" type="success" @click="onSubmit">提交</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>

</template>

<script>

    import CustomPage from 'components/formCustomPage/Index';
    import {addEntity, getEntity} from 'apis/content/information';
    import CKEditor from '@/components/ckeditor/CKEditor';

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
                console.log("父组件 form.content 值修改：", newVal, oldVal);
            },
        },
        data() {
            return {
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
        mounted() {
            this.queryCatalogList();
            let catalogId = this.$route.query.contCatalogId;
            this.form.catalogId = catalogId;

            let id = this.$route.query.id;
            // id 存在则说明是编辑页面
            if (id) {
                this.form.id = id;
                this.getEntity();
            }

            // console.log("初始化资讯添加页面数据", this.form)
        },
        methods: {

            uploadRequest(param) {
                console.log("上传参数：", param);
                //创建临时的路径来展示图片
                let windowURL = window.URL || window.webkitURL;
                this.form.coverImage = windowURL.createObjectURL(param.file);

                let file = param.file;
                let fileName = param.file.name;
                let fileType = fileName.split(".")[fileName.split('.').length - 1];

                console.log('.........................', file.row);
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

                        // this.$nextTick(() => {
                        this.$refs["form"].validate();
                        // });
                    } else {
                        this.$message.error(data.message);
                    }
                });

            },
            validateContent(rule, value, callback) {
                // console.log("内容验证:规则：", rule, "，值：", value ,"，回调：", callback);
                if (value == "" || value.length == 0) {
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

