<template>
    <div>

        <el-col :span="4">
            <!-- 表格区域 -->
            <div class="tree-area">
                <span><slot name="treeArea"></slot></span>
            </div>
        </el-col>

        <el-col :span="20">
            <!-- 查询条件区域 -->
            <div class="query-area clearfix">
                <ul>
                    <slot name="queryArea"></slot>
                    <div class="button-area clearfix">
                        <slot name="buttonArea"></slot>
                    </div>
                </ul>
            </div>

            <!-- 表格区域 -->
            <div class="table-area">
                <slot name="tableArea"></slot>
            </div>

            <!-- 表格右下角显示 -->
            <div class="table-corner">
                <span><slot name="tableCornerArea"></slot></span>
            </div>

            <!-- 分页显示区域 -->
            <div class="pagination">
                <slot name="paginationArea"></slot>
            </div>
        </el-col>
    </div>
</template>

<script>
    import CustomPage from 'components/listPage/Index'

    export default {
        comments: {
            'custom-page': CustomPage,
        },
        data() {
            return {}
        },

        methods: {},
        mounted() {

        }
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

    .pagination {
        text-align: center;
        margin-top: 50px;
    }
</style>
