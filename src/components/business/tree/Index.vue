<template>
    <div class="tree">
        <!-- 按钮区域 -->
        <div class="tree-button-area clearfix">
            <slot name="buttonArea"></slot>
        </div>
        <!-- 树区域 -->
        <div class="tree-area" style="padding-top:10px;height:650px;overflow-y:auto">
            <slot name="treeArea"></slot>
        </div>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        tableDataTemp: [],
      };
    },
    props: ['tableData'],
    created() {
    },
    methods: {}
  }
</script>


<style lang="scss" scoped>
    .search {
        margin-bottom: 30px;
        ul {
            li {
                float: left;
                margin-right: 10px;
                &.block {
                    max-width: 200px;
                }
                .block {
                    max-width: 200px;
                }
                >.el-button,
                .el-select,
                .el-input {
                    margin-left:10px;
                }
            }
        }
    }

</style>