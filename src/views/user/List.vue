<template>
    <div>
        <el-breadcrumb class="crumb"
                       separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path : '/' }">用户管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path : '/user' }">用户管理</el-breadcrumb-item>
        </el-breadcrumb>
        <custom-page>
            <template slot="buttonArea">
                <li>
                    <el-button icon="el-icon-plus" type="primary" @click="addUser">添加用户</el-button>
                    <el-button icon="el-icon-search" type="primary" @click="queryPage()">查 询</el-button>
                    <el-button icon="el-icon-delete" @click="clearQueryParam">清 空</el-button>
                </li>
            </template>
            <template slot="queryArea">
                <li>
            <span>
               <el-date-picker v-model="param.content.startTime"
                               placeholder="创建开始时间"
                               style="width: 195px"
                               type="datetime"
                               value-format="yyyy-MM-dd HH:mm:ss"
                               @change="queryPage">
                </el-date-picker>
                <el-date-picker v-model="param.content.endTime"
                                placeholder="创建结束时间"
                                style="width: 195px"
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                @change="queryPage">
                </el-date-picker>
            </span>
                </li>

                <li>
                    <el-input clearable
                              v-model="param.content.userName"
                              placeholder="用户名/昵称"
                              style="width: 220px"
                              @input="clearInput"
                              @keyup.native.enter="queryPage"></el-input>
                </li>
            </template>
            <template slot="tableArea">
                <el-table border highlight-current-row stripe
                          v-loading="loading"
                          ref="multipleTable"
                          row-key="id"
                          :data="tableData"
                          :row-class-name="tableRowClassName"
                          @selection-change="handleSelectionChange">
                    <!-- 多选框 -->
                    <!--<el-table-column align="center"-->
                    <!--header-align="center"-->
                    <!--type="selection"-->
                    <!--width="50"-->
                    <!--:reserve-selection="true">-->
                    <!--</el-table-column>-->

                    <!-- 显示索引 -->
                    <el-table-column align="center"
                                     header-align="center"
                                     label="序号"
                                     prop="module"
                                     width="60"
                                     :formatter="formatter">
                    </el-table-column>

                    <el-table-column align="left"
                                     label="姓名"
                                     prop="nickName"
                                     width="180">
                    </el-table-column>


                    <el-table-column label="账号" header-align="left" align="left">
                        <template slot-scope="scope">
                            <div class="click-text" @click='updateEntity(scope.row , "userName" , "账号")'>
                                {{ scope.row.userName }}
                            </div>
                        </template>
                    </el-table-column>


                    <el-table-column align="center"
                                     label="创建日期"
                                     prop="createTime"
                                     width="180">
                    </el-table-column>

                    <!--<el-table-column label="删除状态" header-align="center" align="center" fixed="right" width="80px">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.isDeleted === 1 ? 'danger' : 'success'" disable-transitions>
                                {{scope.row.isDeleted === 1 ? '已删除' : '有效'}}
                            </el-tag>
                        </template>
                    </el-table-column>-->

                    <el-table-column align="center" header-align="center" label="状态" width="80px">
                        <template slot-scope="scope">
                            <el-tag disable-transitions
                                    :type="scope.row.isEnabled === '1' ? 'success' : 'danger'">
                                {{ scope.row.isEnabled == '1' ? '使用中' : '停用'}}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" fixed="right" header-align="center" label="操作" min-width="120">
                        <template slot-scope="scope">
                            <el-button type="button" @click="openDialog(scope.row.userId)">设置角色</el-button>

                            <el-popover trigger="hover" placement="bottom">
                                <el-button type="text" @click="resetUser(scope.row)">恢复默认密码</el-button>
                                <el-button  type="text" @click="updateEntityEnabledStatus(scope.row)">
                                    {{scope.row.isEnabled === '0' ? '启用' : '停用'}}
                                </el-button>
                                <el-button type="text" @click="deleteEntity(scope.row)">删除</el-button>
                                <template slot="reference">
                                <!--<div slot="reference">-->
                                    <el-button type="info" icon="el-icon-tickets"></el-button>
                                <!--</div>-->
                                </template>
                            </el-popover>
                        </template>
                    </el-table-column>
                </el-table>
            </template>

            <template slot="paginationArea">
                <el-pagination background
                               v-show="paginationShow"
                               layout="total, sizes,prev, pager, next, jumper"
                               :current-page.sync="param.page.pageNum"
                               :page-size="param.page.pageSize"
                               :page-sizes="pageSizes"
                               :total="total"
                               @current-change="handleCurrentChange"
                               @size-change="handleSizeChange">
                </el-pagination>
            </template>
        </custom-page>

        <!-- 编辑权限系统信息对话框 -->
        <el-dialog :title="dlgSettings.title + '设置'" :visible.sync="dlgSettings.visible" width="30%"
                   :close-on-click-modal="false">
            <el-form :model="editForm" :rules="rules" ref="editForm" onsubmit="return false;">
                <div class="clearfix">
                    <el-form-item prop="content">
                        <el-input v-model.trim="editForm.content" placeholder="请输入内容" class="left role-input"
                                  :type="dlgSettings.inputType" :rows="dlgSettings.rowNum"
                                  @keyup.native.enter="onSubmit"></el-input>
                        <el-button @click="dlgSettings.visible = false" class="left">取 消</el-button>
                        <el-button type="primary" @click="onSubmit" class="left">保 存</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </el-dialog>

        <treeDialog
                :dialogVisible="dialogVisible"
                :rules="rules"
                :title="title"
                :treeData="treeData"
                :userId="userId"
                :checkData="checkData"
                @closeDialog="closeDialog"
                @addUserRoles="addUserRoles"
        ></treeDialog>
    </div>
</template>

<script>
  import CustomPage from 'components/listCustomPage/Index';
  import treeDialog from 'components/dialogCustomPage/Index';
  import {queryUserRoleList, addUserRoles, updateUser, deleteUser, resetUser, checkUpdateExist} from 'apis/user';
  import {queryAllPlatsAndRoles} from 'apis/general/plat';

  export default {
    components: {
      'custom-page': CustomPage,
      'treeDialog': treeDialog
    },
    data() {
      return {
        // 修改的内容
        editForm: {
          id: "",
          property: "",
          content: ""
        },

        loading: true,
        paginationShow: false,
        pageSizes: pageSizes,
        total: 0,
        param: {
          content: {
            userName: '',
            startTime: '',
            endTime: ''
          },
          page: {
            pageNum: 1,
            pageSize: pageSizes[0]
          }
        },
        rules: {},
        tableData: [],
        defaultPassword: 123456,

        // 弹出框属性设置
        dlgSettings: {
          title: "", //  弹窗标题
          visible: false, //  弹窗可见
          inputType: "text", //  弹窗内文本框类型
          rowNum: 1 //  文本框行数
        },

        dialogVisible: false,// 弹框是否显示
        title: '用户角色设置',
        userId: '',// 用户编号
        roleList: [],// 用户设置的角色信息
        treeData: [],// 角色集合
        checkData: []// 选中角色集合
      };
    },

    methods: {

      tableRowClassName({row, rowIndex}) {
        // 把每一行的索引放进row
        row.rowIndex = rowIndex;
      },

      formatter(row, column, cellValue, index) {
        //放回索引值
        return this.param.page.pageSize * (this.param.page.pageNum - 1) + 1 + row.rowIndex;
      },

      // 改变页码
      handleCurrentChange(val) {
        this.param.page.pageNum = val;
        this.queryPage();
      },
      // 改变每页显示多少条
      handleSizeChange(value) {
        this.param.page.pageSize = value;
        this.queryPage();
      },

      handleSelectionChange(val) {
        console.log('多选', val);
        // if (val) {
        //   this.multipleSelection = val;
        //   this.multipleSelectionLength = val.length;
        // }
      },

      /**
       * 分页查询
       * @param param
       */
      queryPage() {
        this.loading = true;
        this.$http.post('/user', this.param).then((resp) => {

          this.loading = false;
          this.paginationShow = true;

          if (resp.content && resp.content.list) {
            this.tableData = resp.content.list;
            this.total = resp.content.total;
          }
        }).catch(error => {
          this.loading = false;
        });
      },

      searchByCondition() {
        this.param.page.pageNum = 1;
        this.queryPage();
      },

      // 清空查询条件
      clearQueryParam() {
        this.param.content = {
          userName: '',
          startTime: '',
          endTime: ''
        };
        this.queryPage();
        this.$refs.multipleTable.clearSelection();
      },
      clearInput() {
      },

      /********************************* 业务逻辑处理 ************************************/

      /**
       * 删除实体
       * @param id
       */
      deleteEntity(row) {
        // this.statusCheck(row, () => {
        common.confirm({
          message: `确认删除【${row.nickName}】这个用户？`,
        }).then(() => {
          deleteUser({content: row.userId}).then(resp => {
            if (200 === resp.code) {
              common.message({
                message: resp.message,
              });
              this.queryPage();
            }
          });
        }).catch(() => {
          // 取消按钮的回调
          console.log('取消按钮的回调');
        });
        // });
      },
      resetUser(row) {
        common.confirm({
          message: `是否将【${row.userName}】的密码恢复为${this.defaultPassword}？`,
        }).then(() => {
          let param = {
            content: {
              userId: row.userId,
              password: this.defaultPassword
            }
          };

          resetUser(param).then(data => {
            if (200 === data.code) {
              this.$message.success(data.message);
              this.queryPage();
            } else {
              this.$message.error(data.message);
            }
          });
        }).catch(() => {
          // 取消按钮的回调
          console.log('取消按钮的回调');
        });
      },

      updateEntityEnabledStatus(row) {
        let text = row.isEnabled === '1' ? '停用' : '启用';
        let isEnabled = row.isEnabled === '1' ? '0' : '1';

        common.confirm({
          message: `是否${text}【${row.userName}】的账户？`
        }).then(() => {
          let param = {
            content: {
              userId: row.userId,
              isEnabled: isEnabled
            }
          };

          this.$http.post('/user/stop', param).then(data => {
            if (200 === data.code) {
              this.$message.success(data.message);
              this.queryPage();
            } else {
              this.$message.error(data.message);
            }

          });

        }).catch(_ => {
        });
      },

      // 创建用户信息
      addUser() {
        this.$router.push('/user/add');
      },

      /***************　打开修改系统对话框　*********************/
      updateEntity(row, rowName, dlgTitle) {
        console.log('修改的记录信息：', row);
        // 判断弹出框展示样式
        switch (rowName) {
          default: {
            this.dlgSettings = {title: dlgTitle, visible: true, inputType: "text", rowNum: 1};
            break;
          }
        }
        // 根据列名添加校验规则
        switch (rowName) {
          case 'userName': {
            this.rules.content = [
              {required: true, message: "请输入" + dlgTitle + "，长度在50个字符内", trigger: "blur", max: 50},
              {validator: this.checkUpdateExist, trigger: "blur"}
            ];
            break;
          }
          case 'url': {
            this.rules.content = [
              {required: true, message: "请输入" + dlgTitle + "，长度在500个字符内", trigger: "blur", max: 500},
            ];
            break;
          }
          default: {
            this.rules.content = [
              {required: true, message: "请输入" + dlgTitle + "，长度在50个字符内", trigger: "blur", max: 50},
            ];
            break;
          }
        }
        // 清空表单
        this.clearForm("editForm");
        this.editForm = {
          id: row.userId,
          property: rowName,
          content: row[rowName]
        };
      },

      /**
       * 校验用户名是否存在
       * @param rule
       * @param value 用户名
       * @param callback
       */
      checkUpdateExist(rule, value, callback) {
        let param = {
          content: {
            userId: this.editForm.id,
            userName: value
          }
        };
        checkUpdateExist(param).then(data => {
          if (200 === data.code) {
            callback();
          } else {
            callback(new Error(data.message));
          }
        });
      },

      /***************　提交修改信息　*********************/
      onSubmit() {
        this.$refs.editForm.validate(valid => {
          if (valid) {
            // 传入参数
            let param = {
              content: {
                userId: this.editForm.id, // 修改记录的ID
              }
            };
            // 修改记录的属性和属性值
            param.content[this.editForm.property] = this.editForm.content;

            updateUser(param).then(data => {
              this.dlgSettings.visible = false; // 对话框关闭
              if (200 === data.code) {
                this.$message.success(data.message);
                this.queryPage();
              } else {
                this.$message.error(data.message);
              }
            });
          }
        });
      },

      /***************  清空Form　*********************/
      clearForm(formName) {
        // 修改框未初始化时，不清空表单
        if (typeof this.$refs[formName] != "undefined") {
          this.$refs[formName].resetFields();
        }
      },

      // 打开创建角色的弹框
      openDialog(userId) {
        let vm = this;

        vm.userId = userId;
        // 获取当前员工的角色信息
        queryUserRoleList({content: userId}).then(data => {
          vm.checkData = [];
          if (200 === data.code) {
            let checks = data.content;
            checks.forEach(item => {
              vm.checkData.push(item.roleId);
            });
          }
          vm.dialogVisible = true;
        });

      },

      // 关闭设置添加日志的dialog页面
      closeDialog: function () {
        let vm = this;
        vm.dialogVisible = false;
        vm.checkData = []
      },

      // 获取全部的用户角色
      queryAllPlatsAndRoles: function () {
        let vm = this;
        queryAllPlatsAndRoles({}).then(data => {
          if (200 === data.code) {
            vm.treeData = common.toTree(data.content);
          } else {
            this.$message.error(data.message);
          }
        });
      },

      // 添加用户角色信息
      addUserRoles: function (param) {

        let vm = this;
        addUserRoles({content: param}).then(data => {
          if (200 === data.code) {
            vm.$message.success(data.message);
            vm.queryPage();
          } else {
            vm.$message.error(data.message);
          }
          vm.btnAbled = false;
          vm.loading = false;
          vm.dialogVisible = false;
        })

      }
    },
    mounted() {
      this.queryPage();
      this.queryAllPlatsAndRoles();
    }
  };
</script>


<style lang="scss" scoped>

    .click-text {
        color: #409eff;
        cursor: pointer;
    }
</style>


