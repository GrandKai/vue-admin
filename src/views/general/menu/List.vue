<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
            <el-breadcrumb-item :to="{ path: '/' }">通用管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/menu' }">菜单管理</el-breadcrumb-item>
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

            <!-- 表单区域 -->
            <template slot="formArea">
                <el-form :model="form" :rules="rules" ref="form" label-width="100px" :disabled="formDisabled" status-icon>

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
  import {queryMenusByPlatId, addMenu, updateMenu, deleteMenu} from 'apis/general/menu';

  const sortNumber = 10;
  const isShow = '1';

  export default {
    components: {
      'tree-from': TreeForm
    },
    watch: {
      'form.platId': {
        handler(val, oldVal) {
          console.log('form.platId', val);
          if (!val) {
            this.formDisabled = true;
          }
        },
        deep: true
      },
    },

    data() {

      return {
        // 所有系统信息
        options: [],

        addDisabled: true,
        deleteDisabled: true,
        // formDisabled: true,
        formDisabled: true,

        defaultProps: {
          children: 'children',
          label: 'label'
        },
        treeData: [],
        treeIsShow: false,

        // 表单信息
        form: {
          // 所选系统id
          id: '',
          platId: '',
          parentId: '',
          name: '',
          router: '',
          image: '',
          sortNumber: sortNumber,
          isShow: isShow,
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
       */
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

        common.confirm({
          message: `是否确定添加默认菜单？`,
        }).then(() => {

          let platId = this.form.platId ? this.form.platId : '';

          let currentNodeKey = this.$refs.tree.getCurrentKey();
          let parentId = currentNodeKey ? currentNodeKey : '';

          let param = {
            content: {
              // 所选系统id
              id: '',
              platId: platId,
              parentId: parentId,
              name: '默认菜单',
              router: '/',
              image: '',
              sortNumber: sortNumber,
              isShow: isShow,
              isLeaf: '',
            }
          };

          addMenu(param).then(data => {
            if (200 === data.code) {
              let newMenu = data.content;
              newMenu.label = newMenu.name;

              this.$message.success(data.message);
              this.$refs.form.resetFields();

              let currentNodeData = this.$refs.tree.getCurrentNode();
              console.log('currentNodeData:', currentNodeData);

              // 向当前节点下添加子节点
              if (currentNodeData) {
                if (!currentNodeData.children) {
                  this.$set(currentNodeData, 'children', []);
                }
                currentNodeData.children.push(newMenu);
              }

              this.setNodeForm(newMenu.id, newMenu);

            } else {
              this.$message.error(data.message);
            }
          });
        }).catch(_ => {
        });
      },

      /**
       * 设置节点选中，并设置表单信息
       * @param currentNodeId
       * @param currentNode
       */
      setNodeForm(currentNodeId, currentNode) {
        // 设置选中树节点，并出发 node-click 设置对应的表单信息
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(currentNodeId);
          this.handleNodeClick(currentNode);
        });
      },

      updateParentChildren(callBack) {
        let currentNodeKey = this.$refs.tree.getCurrentKey();

        // 更新node-key的子节点
        let node = this.$refs.tree.getNode(currentNodeKey);

        let parent = node.parent;
        let parentNodeKey = parent.data.id;
        let children = parent.data.children;

        callBack(parentNodeKey, children, currentNodeKey);
      },

      /**
       * 获取当前节点的节点信息，父节点信息，当前节点id，父节点id，父节点所有children
       * @returns {{currentNode: D | *, parentNode: *, currentNodeKey: K | *, parentNodeKey: *, children: *}}
       */
      getParentChildren() {
        let currentNodeKey = this.$refs.tree.getCurrentKey();

        // 更新node-key的子节点
        let node = this.$refs.tree.getNode(currentNodeKey);
        let currentNodeData = this.$refs.tree.getCurrentNode();

        let parent = node.parent;
        let parentNodeKey = parent.data.id;
        let children = parent.data.children;

        return {
          currentNodeKey: currentNodeKey,
          currentNode: node,
          currentNodeData: currentNodeData,
          parentNodeKey: parentNodeKey,
          parentNode: parent,
          parentNodeData: parent.data,
          children: children
        };
      },

      updateEntity() {
        let param = {
          content: this.form
        };
        updateMenu(param).then(data => {
          if (200 === data.code) {
            this.$message.success(data.message);
            this.$refs.form.resetFields();

            let updatedMenu = data.content;
            updatedMenu.label = updatedMenu.name;

            this.updateParentChildren((parentNodeKey, children, currentNodeKey) => {

              let ary = [];
              for (let i = 0; children && i < children.length; i++) {
                let item = children[i];
                if (item.id === currentNodeKey) {
                  ary.push(updatedMenu)
                } else {
                  ary.push(item);
                }
              }
              this.$refs.tree.updateKeyChildren(parentNodeKey, ary);
              this.setNodeForm(currentNodeKey, updatedMenu);
            });

          } else {
            this.$message.error(data.message);
          }
        });
      },
      deleteEntity() {

        let currentNodeKey = this.$refs.tree.getCurrentKey();

        common.confirm({
          message: `请确认删除的是最底层子节点菜单信息！`
        }).then(() => {
          let param = {
            content: currentNodeKey
          };
          deleteMenu(param).then(data => {
            if (200 === data.code) {
              this.$message.success(data.message);

              this.updateParentChildren((parentNodeKey, children, currentNodeKey) => {

                let ary = [];
                for (let i = 0; children && i < children.length; i++) {
                  let item = children[i];
                  if (item.id !== currentNodeKey) {
                    ary.push(item);
                  }
                }
                this.$refs.tree.updateKeyChildren(parentNodeKey, ary);
                this.$refs.form.resetFields();
              });
              // 删除成功后，刷新树的信息
            } else {
              this.$message.error(data.message);
            }
          });
        }).catch(_ => {
        });

      },
      treeOpen() {

      },
      treeClose() {

      },

      handleNodeClick(item) {
        console.log('当前选中node节点:', item);
        this.addDisabled = false;
        this.deleteDisabled = false;

        if (item && item.id) {
          this.formDisabled = false;

          // 设置选中的表单信息
          this.form.id = item.id;
          this.form.parentId = item.parentId;
          this.form.name = item.name;
          this.form.router = item.router;
          this.form.image = item.image;
          this.form.sortNumber = item.sortNumber;
          this.form.isShow = item.isShow;
          this.form.isLeaf = item.isLeaf;
        }
      },

      onSubmit(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            common.confirm({
              message: `是否确定对该菜单执行此次操作？`,
            }).then(() => {
              this.updateEntity();
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
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }

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