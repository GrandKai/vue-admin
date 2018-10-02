<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
            <el-breadcrumb-item :to="{ path: '/' }">权限管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/role' }">角色管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '' }">新建角色</el-breadcrumb-item>
        </el-breadcrumb>

    </div>
</template>

<script>
    export default {
        data() {
            return {

            }
        },
        created() {

        },


    }
</script>

<style scoped>

</style>