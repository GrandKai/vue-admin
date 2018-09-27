<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
            <el-breadcrumb-item :to="{ path: '/' }">通用管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/operation' }">操作管理</el-breadcrumb-item>
        </el-breadcrumb>


        <!-- 菜单区域 -->
        <tree-from>

            <template slot="queryArea">
                <div class="menu-select">
                    <span class="sysSpan">所属系统 </span>
                    <el-select v-model="form.platId" placeholder="请选择操作系统" clearable @change="selectChange" ref="select">
                        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                    <br/>
                    <!--platId: <input v-model="form.platId" width="500"/>-->
                    <!--parentId: <input v-model="form.parentId" width="500"/>-->
                </div>
            </template>


            <!-- 按钮区域 -->
            <template slot="buttonArea">
                <el-button type="primary" @click="addEntity" :disabled="addDisabled"><i class="el-icon-plus"></i> 新建</el-button>
                <el-button type="success" @click="treeOpen"><i class="el-icon-arrow-down"></i> 展开</el-button>
                <el-button type="success" @click="treeClose"><i class="el-icon-arrow-up"></i> 收起</el-button>
                <el-button type="danger" @click="deleteEntity" :disabled="deleteDisabled"><i class="el-icon-delete"></i> 删除</el-button>
            </template>

            <!-- 树区域 -->
            <template slot="treeArea">
                <el-tree :data="treeData"
                         :props="defaultProps"
                         @node-click="handleNodeClick"
                         default-expand-all
                         highlight-current
                         :show-checkbox="false"
                         :expand-on-click-node="false"
                         node-key="id"
                         ref="tree" v-show="treeIsShow">
                </el-tree>
            </template>
        </tree-from>
    </div>
</template>

<script>
  import TreeForm from 'components/business/treeForm/Index';

  export default {
    components: {
      'tree-from': TreeForm
    },
    data() {
      return {
        // 所有系统信息
        options: [],

        defaultProps: {
          children: 'children',
          label: 'label'
        },
        treeData: [],
        treeIsShow: false,

        // 表单信息
        form: {
          // 所选系统id
          platId: '',
        },
      }
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

      selectChange() {

        let platId = this.form.platId;

        this.treeIsShow = !!platId;
        this.addDisabled = true;
        this.deleteDisabled = true;

        if (platId) {
          let param = {
            content: {
              platId: platId
            }
          };

          queryMenusByPlatId(param).then(data => {
            if (200 === data.code) {
              let content = data.content;
              console.log('根据平台id查询所有菜单信息', content);

              let platName = this.$refs.select.selected.currentLabel;
              let platId = this.$refs.select.selected.currentValue;
              // 获取选中的平台名称
              console.log('获取选中的平台名称', platName, 'id:', platId);
              let root = {
                id: platId,
                label: platName,
                children: common.toTree(content)
              };
              let ary = [];
              ary.push(root);

              // this.treeData = ary);
              this.treeData = JSON.parse(JSON.stringify(ary));
            } else {
              this.$message.error(data.message);
            }
          });
        }
      },

      addEntity() {

      },
      deleteEntity() {

      },
      treeOpen() {

      },
      treeClose() {

      },
      handleNodeClick(nodeData) {

      },
    }
  }
</script>

<style scoped>

</style>