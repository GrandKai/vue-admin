<template>

    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
            <el-breadcrumb-item :to="{ path: '/' }">权限管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/authority' }">权限管理</el-breadcrumb-item>
        </el-breadcrumb>

    </div>
</template>

<script>

    import {queryAuthorityPage} from 'apis/privilege/authority'
    export default {
        data() {

            return {

                loading: false,
                paginationShow: false,
                pageSizes: pageSizes,
                total: 0,
                param: {
                    content: {},
                    page: {
                        pageNum: 1,
                        pageSize: pageSizes[0]
                    }
                },

                tableData: [],
                // 校验规则
                rules: {}
            }
        },
        created() {
            queryAuthorityPage(this.param).then(data => {
                console.log('请求权限数据', data)
            })
        }
    }
</script>

<style scoped>

</style>