<template>
    <div>
        <el-row>
            <el-col :span="12">
                <!-- TODO: 指定高度 -->
                <div class="line" ></div>
                <div class="grid-content bg-purple menu-left">

                    <!-- 查询区域 -->
                    <div class="query-area">
                        <slot name="queryArea"></slot>
                    </div>

                    <!-- 按钮区域 -->
                    <div class="btn-groups tree-button menu-btn">
                        <slot name="buttonArea"></slot>
                    </div>

                    <!-- 树形区域 -->
                    <div class="tree-area clearfix">
                        <slot name="treeArea"></slot>
                    </div>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="menu-right">
                    <slot name="formArea"></slot>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>

  export default {
    data() {
      return {};
    },
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
                > .el-button,
                .el-select,
                .el-input {
                    margin-left: 10px;
                }
            }
        }
    }
    .menu-left, .menu-right {
        float: left;
        width: 450px;
    }

    .pagination {
        text-align: center;
        margin-top: 50px;
    }
    .line {
        width: 1px;
        min-height: 500px;
        float: right;
        background-color: #f0f0f0;
        /*background-color: red;*/
    }

    .menu-btn {
        margin-bottom: 30px;
        .el-button {
            margin-right: 10px;
            &:last-child {
                margin-right: 0;
            }
        }
    }
</style>