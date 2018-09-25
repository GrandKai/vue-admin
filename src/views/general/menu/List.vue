<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
            <el-breadcrumb-item :to="{ path: '/' }">菜单管理</el-breadcrumb-item>
            <el-breadcrumb-item>菜单信息</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 菜单区域 -->
        <tree-from>
            <template slot="queryArea">
                查询区域

                <div class="menu-select">
                    <span class="sysSpan">所属系统 </span>
                    <el-select v-model="platId" placeholder="请选择操作系统" clearable @change="getTreeData(platId)" ref="select">
                        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </div>
            </template>
            <!-- 按钮区域 -->
            <template slot="buttonArea">
                按钮区域
            </template>

            <!-- 树区域 -->
            <template slot="treeArea">
                树区域
            </template>

            <!-- 表单区域 -->
            <template slot="formArea">
                表单区域
            </template>
        </tree-from>
    </div>
</template>

<script>
  import TreeForm from 'components/business/treeForm/Index';
  import {queryPlatList} from 'apis/general/plat'

  export default {
    components: {
      'tree-from': TreeForm
    },
    data() {
      return {
        // 所选系统id
        platId: '',
        // 所有系统信息
        options: [],
      };
    },
    created() {
      this.queryAllPlat();
    },
    methods: {

      queryAllPlat() {
        queryPlatList().then(data => {
          console.log('查询所有平台', data);
          if (200 === data.code) {
            this.options = data.content;
          }
        });
      },
      /**
       * 根据所选系统查询树形数据
       * @param value
       */
      getTreeData(value) {

      }
    }
  }
</script>


<style lang="scss" scoped>
    .sysSpan {
        font-size: 14px;
        font-weight: bold;
        margin-right: 10px;
    }

    .menu {
        margin-top: 20px;
        min-width: 1200px;
    }

    .menu-left, .menu-right {
        float: left;
        width: 450px;
    }

    .menu-left {
        margin-right: 150px;
        margin-left: 20px;
    }

    .submit {
        display: block;
        width: 60%;
        margin: 0 auto;
    }

    .menu-select {
        margin-bottom: 30px;
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

    .el-tree {
        max-height: 700px;
        overflow: auto;
        margin-top: 20px;
    }
</style>