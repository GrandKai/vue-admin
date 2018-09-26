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
                <div class="menu-select">
                    <span class="sysSpan">所属系统 </span>
                    <el-select v-model="form.platId" placeholder="请选择操作系统" clearable @change="selectChange" ref="select">
                        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                    <br/>
                    platId: <input v-model="form.platId"/>
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
                         ref="tree"
                >

                </el-tree>
            </template>

            <!-- 表单区域 -->
            <template slot="formArea">
                <el-form :model="form" :rules="rules" ref="form" label-width="100px" :disabled="formDisabled">

                    <el-form-item label="菜单名称" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>

                    <el-form-item label="菜单URL" prop="router">
                        <el-input v-model="form.router"></el-input>
                    </el-form-item>

                    <el-form-item label="菜单图标" prop="image">
                        <el-input v-model="form.image"></el-input>
                    </el-form-item>

                    <el-form-item label="显示顺序" prop="sortNumber">
                        <el-input v-model="form.sortNumber"></el-input>
                    </el-form-item>

                    <el-form-item label="菜单显示" prop="isShow" align="left">
                        <el-switch v-model="form.isShow"
                                   active-value="1"
                                   inactive-value="0"
                                   active-text="显示"
                                   inactive-text="隐藏"
                                   active-color="#13ce66"
                        ></el-switch>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="onSubmit('form')">提交</el-button>
                    </el-form-item>
                </el-form>
            </template>
        </tree-from>
    </div>
</template>

<script>
  import TreeForm from 'components/business/treeForm/Index';
  import {queryPlatList} from 'apis/general/plat';
  import {queryMenusByPlatId, addMenu} from 'apis/general/menu';

  export default {
    components: {
      'tree-from': TreeForm
    },
    data() {
      return {
        // 所有系统信息
        options: [],

        addDisabled: true,
        deleteDisabled: true,
        // formDisabled: true,
        formDisabled: false,

        defaultProps: {
          children: 'children',
          label: 'label'
        },
        treeData: [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }],

        // 表单信息
        form: {
          // 所选系统id
          platId: '',
          name: '',
          router: '',
          sortNumber: '',
          isShow: '1',
          isLeaf: '',
        },
        rules: {
          name: [
            {required: true, message: '请输入菜单名称', trigger: 'blur'},
            {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
          ],
          router: [
            {required: true, message: '请输入菜单URL', trigger: 'blur'},
            {min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur'}
          ],
          image: [
            {max: 500, message: '长度小于 500 个字符', trigger: 'blur'}
          ],
          sortNumber: [
            {required: true, validator: common.checkNumber, trigger: "blur"}
          ],
          isShow: [
            {required: true, message: "请选择菜单显示状态", trigger: "blur"}
          ],
        }
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
      selectChange(value) {

        let param = {
          content: this.from.platId
        };

        queryMenusByPlatId(param).then(data => {
          console.log('根据平台id查询所有菜单信息', data);
        })
      },

      addEntity() {

      },
      deleteEntity() {

      },
      treeOpen() {

      },
      treeClose() {

      },

      handleNodeClick(data) {
        console.log(data);
      },

      onSubmit(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            common.confirm({
              message: `是否确定对该菜单执行此次操作？`,
            }).then(() => {

              let param = {
                content: this.form
              };
              addMenu(param).then(data => {
                if (200 === data.code) {
                  this.$message.success(data.message);
                  // this.queryPage();
                } else {
                  this.$message.error(data.message);
                }
              });
            }).catch(() => {
            });
          } else {
            console.error('error submit!!');
            return false;
          }
        });
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

    .el-tree {
        max-height: 700px;
        overflow: auto;
        margin-top: 20px;
    }
</style>