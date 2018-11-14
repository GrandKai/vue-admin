<template>

    <div>
        <ckeditor
                id="editor"
                name="editor"
                :config="config"
                value="<h1>dddddddddd</h1>"
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
          filebrowserImageUploadUrl: process.env.urlPrefix + '/article/upload'
        }
      }
    },
    methods: {
      onChange(value) {
        console.log("子组件值：", value)
      }
    },
    mounted() {
      console.log("mounted");
      /*
            editor = CKEDITOR.replace('editor1', {
              height: '300px',
              width: '100%',
              filebrowserImageUploadUrl: process.env.urlPrefix + '/article/upload'

            });
            // The "change" event is fired whenever a change is made in the editor.
            editor.on('change', function (evt) {
              // getData() returns CKEditor's HTML content.
              console.log('change event, Total bytes: ' + evt.editor.getData());
            });
            // The "blur" event is fired when a blur is made in the editor.
            editor.on('blur', function (evt) {
              console.log('blur event, Total bytes: ' + evt.editor.getData());
            });*/

      /*editor.on('fileUploadRequest', function (evt) {
        let xhr = evt.data.fileLoader.xhr;
        console.log('文件上传请求：', evt);
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        let accessToken = sessionStorage.getItem('accessToken');
        if (accessToken) {
          xhr.setRequestHeader('Authorization', `Bearer ${sessionStorage.getItem('accessToken')}`);
        }
        xhr.withCredentials = true;
      });*/

      // var data = editor.getData();
      //
      // console.log(data);
    },
    created() {
      console.log("created");
      // console.log("CKEDITORCKEDITORCKEDITORCKEDITOR:", CKEDITOR);
    }
  }
</script>

<style scoped>

</style>
