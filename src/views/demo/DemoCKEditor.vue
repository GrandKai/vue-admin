<template>

    <div>
        <ckeditor
                id="editor"
                name="editor"
                :config="config"
                :value="value"
                @input="onChange"
        ></ckeditor>
    </div>

</template>

<script>

  import CKEditor from '@/components/ckeditor/CKEditor';

  let editor;
  export default {
    components: {
      'ckeditor': CKEditor
    },
    data() {
      return {
        config: {
          height: '300px',
          width: '100%',
          filebrowserImageUploadUrl:  `${process.env.urlPrefix}/article/upload`
        },
        value: "<h1>测试文本内容</h1>"
      }
    },
    methods: {
      onChange(value) {
        console.log("子组件值：", value)
      }
    },
    mounted() {

    },
    created() {

    }
  }
</script>

<style scoped>

</style>
