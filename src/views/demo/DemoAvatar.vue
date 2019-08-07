<template>
    <div>
        <div class="cropper-content">
            <div class="cropper">
                <vue-cropper
                        ref="cropper"
                        :img="option.img"
                        :outputSize="option.outputSize"
                        :outputType="option.outputType"
                        :info="true"
                        :full="option.full"
                        :canMove="option.canMove"
                        :canMoveBox="option.canMoveBox"
                        :original="option.original"
                        :autoCrop="option.autoCrop"
                        :autoCropWidth="option.autoCropWidth"
                        :autoCropHeight="option.autoCropHeight"
                        :fixedBox="option.fixedBox"
                        @realTime="realTime"
                        @imgLoad="imgLoad"
                ></vue-cropper>
            </div>
            <div class="show-preview" :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden', 'margin': '5px'}">
                <div :style="previews.div" class="preview">
                    <img :src="previews.url" :style="previews.img">
                </div>
            </div>
        </div>

        <div class="footer-btn">
            <div class="scope-btn">
                <el-upload
                        ref="upload"
                        class="avatar-uploader"
                        accept="image/png, image/jpeg, image/gif, image/jpg"
                        action=""
                        :show-file-list="false"
                        :http-request="uploadRequest"
                        :on-exceed="handleExceed"
                        :before-upload="beforeAvatarUpload">
                    <el-button size="small" type="success">点击上传</el-button>
                </el-upload>

                <el-button @click="changeScale(1)" icon="el-icon-plus" circle></el-button>
                <el-button @click="changeScale(-1)" icon="el-icon-minus" circle></el-button>
                <el-button @click="rotateLeft" circle>
                    <i-icon type="md-undo"/>
                </el-button>
                <el-button @click="rotateRight" circle>
                    <i-icon type="md-redo"/>
                </el-button>

            </div>

            <div class="upload-btn">
                <el-button type="primary" @click="down('base64')" icon="el-icon-download">下载</el-button>
                <el-button type="primary" @click="upload" icon="el-icon-upload">上传头像</el-button>
            </div>
        </div>
    </div>
</template>
<script>
    import {VueCropper} from 'vue-cropper'
    import {uploadEntityImage} from 'apis/catalog';

    export default {
        components: {
            'vue-cropper': VueCropper
        },
        data() {
            return {
                crap: false,
                previews: {},
                option: {
                    img: 'http:img1.vued.vanthink.cn/vued751d13a9cb5376b89cb6719e86f591f3.png',
                    outputSize: 1, //剪切后的图片质量（0.1-1）
                    full: false, // 输出原图比例截图 props名full
                    outputType: 'png',
                    canMove: true,
                    original: false,
                    canMoveBox: true,
                    autoCrop: true,
                    autoCropWidth: 200,
                    autoCropHeight: 200,
                    fixedBox: true
                },
                downImg: '#',
                file: null // 准备要上传的图片
            }
        },
        methods: {

            // 上传文件个数超过定义的数量
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件，请删除后继续上传`)
            },
            beforeAvatarUpload(file) {
                // console.log('校验图片格式：', file)
                if (!/\/(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(file.type)) {
                    this.$message.error('上传的图片格式只能是【JPG/JPEG/PNG/BMP/GIF】中的一种!');
                    return false
                }
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isLt2M) {
                    this.$message.error('上传的图片大小不能超过 2MB!');
                    return false;
                }
                return true
            },
            uploadRequest(param) {
                // console.log("上传参数：", param);
                // 创建临时的路径来展示图片
                let windowURL = window.URL || window.webkitURL;
                this.option.img = windowURL.createObjectURL(param.file);
                // 缓存文件对象已供上传按钮使用
                this.file = param.file
            },
            changeScale(num) {
                num = num || 1
                this.$refs.cropper.changeScale(num)
            },
            rotateLeft() {
                this.$refs.cropper.rotateLeft()
            },
            rotateRight() {
                this.$refs.cropper.rotateRight()
            },
            /**
             * 上传头像
             */
            upload() {
                let file = this.file;
                let fileName = file.name;
                let fileType = fileName.split(".")[fileName.split('.').length - 1];

                let formData = new FormData();

                // 通过 append 向 form 对象添加数据
                formData.append('file', file);
                formData.append('fileType', fileType);
                formData.append('fileName', fileName);

                uploadEntityImage(formData).then(data => {
                    console.log("上传头像结果：", data);
                    if (200 === data.code) {
                        this.$message.success('头像上传成功！')
                        // let content = data.content;
                        // this.option.img = content.url;
                    } else {
                        this.$message.error(data.message);
                    }
                })
                // this.$refs.cropper.getCropBlob(data => {
                //     console.log('this.$refs.cropper.getCropBlob:', data)
                //     var img = window.URL.createObjectURL(data)
                //     console.log('image:', img)
                // })
            },
            // 实时预览函数
            realTime(data) {
                this.previews = data
            },

            /**
             * 下载头像
             * @param type
             */
            down(type) {
                var aLink = document.createElement('a')
                aLink.download = 'avatar-img'
                // 输出
                if (type === 'blob') {
                    this.$refs.cropper.getCropBlob(data => {
                        this.downImg = window.URL.createObjectURL(data)
                        //            aLink.download = this.downImg;
                        aLink.href = window.URL.createObjectURL(data)
                        aLink.click()
                    })
                } else {
                    this.$refs.cropper.getCropData(data => {
                        this.downImg = data
                        aLink.href = data
                        aLink.click()
                        // 将头像图片数据发送给后台
                    })
                }
            },
            imgLoad(message) {
                console.log('加载成功回调', message)
            }
        }
    }
</script>
<style lang="scss" scoped>
    .cropper-content {
        display: flex;
        display: -webkit-flex;
        justify-content: flex-end;
        -webkit-justify-content: flex-end;

        .cropper {
            width: 350px;
            height: 300px;
        }

        .show-preview {
            flex: 1;
            -webkit-flex: 1;
            display: flex;
            display: -webkit-flex;
            justify-content: center;
            -webkit-justify-content: center;

            .preview {
                overflow: hidden;
                border-radius: 50%;
                border: 1px solid #cccccc;
                background: #cccccc;
                margin-left: 40px;
            }
        }
    }

    .footer-btn {
        margin-top: 30px;
        display: flex;
        display: -webkit-flex;
        justify-content: flex-end;
        -webkit-justify-content: flex-end;

        .scope-btn {
            width: 350px;
            display: flex;
            display: -webkit-flex;
            justify-content: space-between;
            -webkit-justify-content: space-between;
        }

        .upload-btn {
            flex: 1;
            -webkit-flex: 1;
            display: flex;
            display: -webkit-flex;
            justify-content: center;
            -webkit-justify-content: center;
        }

    }
</style>
