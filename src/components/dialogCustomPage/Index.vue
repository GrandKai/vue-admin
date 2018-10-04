<template>
  <div>
    <el-dialog v-dialogDrag
               width="500px"
               :before-close="closeDialog"
               :close-on-click-modal="false"
               :title="title"
               :visible.sync="dialogVisible">
      <div class="clearfix">
        <el-form label-width="120px"
                 ref="form"
                 :model="form"
                 :rules="rules">
          <el-input v-model="form.userId"
                    style="display: none"
                    type="text"></el-input>
          <el-input v-model="filterText"
                    placeholder="输入关键字进行过滤" clearable>
          </el-input>
          <el-tree show-checkbox
                   class="filter-tree"
                   node-key="id"
                   :data="treeData"
                   :filter-node-method="filterNode"
                   :default-expand-all="true"
                   ref="tree"
                   :default-checked-keys="checkData"
          >
          </el-tree>

        </el-form>
      </div>
      <span class="dialog-footer"
            slot="footer">
                <el-button type="primary"
                           :loading="isload"
                           :disabled="btnAbled"
                           @click="">保 存</el-button>
                <el-button @click="closeDialog">取 消</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // 修改的内容
        form: {
          userId: '',
          checkData: [],
        },
        isload: false,
        filterText: '',//关键字
        btnAbled: false,
      };
    },
    props: ['dialogVisible', 'title', 'rules', 'treeData', 'userId', 'checkData'],
    watch: {
      'dialogVisible': function(newVal, oldVal) {
        let vm = this;
        if (!newVal) { // 如果关闭当前页
          // 打开确定按钮
          vm.isload = false;
        }
      },
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    mounted() {
      let vm = this;
    },
    methods: {
      // 关闭之前, 调用父组件的方法, 重置dialogVisibleLog
      closeDialog: function() {
        let vm = this;
        vm.filterText = ''
        vm.$refs.form.resetFields();
        vm.$emit('closeDialog');
      },
      filterNode(value, data) {//根据关键字查询
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      }
    },
    computed: {
      // 保存按钮是否禁用
      btnAbled: function() {
        let vm = this;
        if (!common.isEmpty(vm.form.userId)) {
          return false;
        } else {
          return true;
        }
      }
    },
  };
</script>

<style scoped>

</style>

