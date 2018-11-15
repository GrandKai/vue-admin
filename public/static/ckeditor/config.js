/**
 * CKEditor配置文件
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function (config) {
  // 去除图片预览
  config.image_previewText = ' ';
  // 添加行距
  // config.extraPlugins += (config.extraPlugins ? ',lineheight' : 'lineheight');

  // Define changes to default configuration here. For example:
  config.language = 'zh-cn';
  // config.uiColor = '#F1F1F1';
  config.toolbar = 'Customer';
  config.toolbarGroups = [
    // 1. 包括源码等
    {name: 'document', groups: ['mode', 'document', 'doctools']},
    // 2. 提供复制张贴等
    {name: 'clipboard', groups: ['clipboard', 'undo']},
    // 3. 拼写检查等
    {name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing']},
    // 4. 表单信息
    {name: 'forms', groups: ['forms']},
    // 5. 插入 包括图片，表格'Table'，水平线，特殊字符  表情'Smiley',分页符,'PageBreak
    {name: 'insert', groups: ['insert']},
    '/',
    // 6. 加粗 倾斜 删除线等
    {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
    // 7. 有序 无序 引用等
    {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph']},
    // 8. 链接
    {name: 'links', groups: ['links']},
    '/',
    // 9. 输入文字风格
    {name: 'styles', groups: ['styles']},
    // 10. 颜色
    {name: 'colors', groups: ['colors']},
    // 工具  用于编辑器全屏
    {name: 'tools', groups: ['tools']},
    {name: 'others', groups: ['others']},
    // 关于功能
    {name: 'about', groups: ['about']},
    {name: 'lineheight', groups: ['lineheight']}
  ];
  // Remove some buttons provided by the standard plugins, which are not needed in the Standard(s) toolbar.
  config.removeButtons = 'NewPage,Preview,Print,Save,Templates,Replace,Find,SelectAll,Scayt,Radio,Checkbox,TextField,Form,Textarea,Select,Button,ImageButton,HiddenField,Subscript,Superscript,NumberedList,BulletedList,Blockquote,CreateDiv,BidiLtr,BidiRtl,Language,Iframe,PageBreak,SpecialChar,Maximize,ShowBlocks,About,Smiley,Flash';

  // Set the most common block elements.
  config.format_tags = 'p;h1;h2;h3;pre';

  // Simplify the dialog windows.
  config.removeDialogTabs = 'image:advanced;link:advanced';
  // 工具栏的位置 设置编辑器功能位置 默认top  bottom
  config.toolbarLocation = 'top';
  // 当用户键入 TAB 时，编辑器走过的空格数，(&nbsp;) 当值为0时，焦点将移出编辑框  如果不设置则无任何效果
  config.tabSpaces = 4;
  // 工具栏默认是否展开
  config.toolbarStartupExpanded = true;
  // 工具栏是否可以被收缩
  config.toolbarCanCollapse = true;
  //中文字体
  config.font_names = '宋体/宋体;黑体/黑体;仿宋/仿宋_GB2312;楷体/楷体_GB2312;隶书/隶书;幼圆/幼圆;微软雅黑/微软雅黑;' + config.font_names;
  //忽略粘贴的样式
  config.forcePasteAsPlainText = false;
  config.pasteFromWordRemoveFontStyles = false;
  config.pasteFromWordRemoveStyles = false;

};

/*CKEDITOR.on('fileUploadRequest', function (evt) {
  let xhr = evt.data.fileLoader.xhr;
  console.log('文件上传请求：', evt);
  xhr.setRequestHeader('Cache-Control', 'no-cache');
  let accessToken = sessionStorage.getItem('accessToken');
  if (accessToken) {
    xhr.setRequestHeader('Authorization', `Bearer ${sessionStorage.getItem('accessToken')}`);
  }
  xhr.withCredentials = true;
});*/
