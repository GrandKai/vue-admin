<template>
    <div class="ckeditor">
        <textarea
                :name="name"
                :id="id"
                v-model="instanceValue"
                :types="types"
                :config="config"
                :disabled="readOnlyMode">
        </textarea>
    </div>
</template>

<script>
    let inc = new Date().getTime();
    import {mapGetters} from 'vuex'

    export default {
        name: 'VueCkeditor',
        props: {
            name: {
                type: String,
                default: () => `editor-${++inc}`
            },
            value: {
                type: String
            },
            id: {
                type: String,
                default: () => `editor-${inc}`
            },
            types: {
                type: String,
                default: () => `classic`
            },
            config: {
                type: Object,
                default: () => {
                }
            },
            instanceReadyCallback: {
                type: Function
            },
            readOnlyMode: {
                type: Boolean,
                default: () => false
            }
        },
        data() {
            return {
                instanceValue: '',
                value1: '',
            };
        },
        computed: {
            instance() {
                return CKEDITOR.instances[this.id];
            },
            ...mapGetters(['accessToken'])
        },
        watch: {
            value(val) {
                try {
                    if (this.instance) {
                        this.update(val);
                        this.instanceValue = val;
                    } else {
                        console.error("富文本实例未初始化")
                    }
                } catch (e) {
                    console.error('修改文本值异常！');
                }
            },
            readOnlyMode(val) {
                this.instance.setReadOnly(val);
            }
        },
        mounted() {
            this.create();
        },
        beforeDestroy() {
            this.destroy();
        },
        methods: {
            create() {
                if (typeof CKEDITOR === 'undefined') {
                    console.error('CKEDITOR is missing (http://ckeditor.com/)');
                } else {
                    if (this.types === 'inline') {
                        CKEDITOR.inline(this.id, this.config);
                    } else {
                        CKEDITOR.replace(this.id, this.config);
                    }

                    this.instance.setData(this.value);

                    this.instance.on('instanceReady', () => {

                        if ('' === this.instance.getData()) {
                            setTimeout(_ => {
                                this.instance.setData(this.value);
                            },500);
                        }
                    });

                    // Ckeditor change event
                    this.instance.on('change', this.onChange);

                    // Ckeditor mode html or source
                    this.instance.on('mode', this.onMode);

                    // Ckeditor blur event
                    this.instance.on('blur', this.onBlurEvent);

                    // Ckeditor focus event
                    this.instance.on('focus', evt => {
                        this.$emit('focus', evt);
                    });

                    // Ckeditor contentDom event
                    this.instance.on('contentDom', evt => {
                        this.$emit('contentDom', evt);
                    });

                    // Ckeditor dialog definition event
                    CKEDITOR.on('dialogDefinition', evt => {
                        this.$emit('dialogDefinition', evt);
                    });

                    // Ckeditor file upload request event
                    this.instance.on('fileUploadRequest', evt => {
                        let xhr = evt.data.fileLoader.xhr;
                        console.log('文件上传请求：', evt);
                        xhr.setRequestHeader('Cache-Control', 'no-cache');
                        let accessToken = this.accessToken;
                        if (accessToken) {
                            xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
                        }
                        xhr.withCredentials = true;
                        // this.$emit('fileUploadRequest', evt);
                    });

                    // Ckditor file upload response event
                    this.instance.on('fileUploadResponse', evt => {
                        setTimeout(() => {
                            this.onChange();
                        }, 0);
                        this.$emit('fileUploadResponse', evt);
                    });

                    // Listen for instanceReady event
                    if (typeof this.instanceReadyCallback !== 'undefined') {
                        this.instance.on('instanceReady', this.instanceReadyCallback);
                    }
                }
            },
            update(val) {
                // console.log("update子组件值：", val);
                if (this.instanceValue !== val) {
                    this.instance.setData(val, {internal: false});
                }
            },
            destroy() {
                try {
                    let editor = window['CKEDITOR'];
                    if (editor.instances) {
                        for (let instance in editor.instances) {
                            instance.destroy();
                        }
                    }
                } catch (e) {
                }
            },
            onMode() {
                if (this.instance.mode === 'source') {
                    let editable = this.instance.editable();
                    editable.attachListener(editable, 'input', () => {
                        this.onChange();
                    });
                }
            },
            onChange() {
                let html = this.instance.getData();
                if (html !== this.value) {
                    this.$emit('input', html);
                    this.instanceValue = html;

                    // setTimeout(() => {
                    //     this.$emit('update:value', html + "测试");
                    // }, 2000);
                }
            },
            onBlurEvent(evt) {
                let html = this.instance.getData();
                this.$emit('blur', html);
                this.instanceValue = html;
            }
        }
    };
</script>
