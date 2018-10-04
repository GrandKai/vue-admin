<template>
  <div>
    <el-breadcrumb class="crumb"
                   separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path : '/' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path : '/system' }">用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <custom-page>
      <template slot="buttonArea">
        <li>
          <el-button icon="el-icon-plus"
                     type="primary"
                     @click="addUser">添加用户
          </el-button>
          <el-button icon="el-icon-search"
                     type="primary"
                     @click="queryPage()">查 询
          </el-button>
          <el-button icon="el-icon-delete"
                     @click="clearQueryParam">清 空
          </el-button>
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
                    v-model="param.content.name"
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
                           prop="userName"
                           width="180">
          </el-table-column>

          <el-table-column align="left"
                           label="昵称"
                           prop="nickName"
                           width="180">
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

          <el-table-column align="center"
                           fixed="right"
                           header-align="center"
                           label="状态"
                           width="80px">
            <template slot-scope="scope">
              <el-tag disable-transitions
                      :type="scope.row.isEnabled === '1' ? 'success' : 'danger'">
                {{ scope.row.isEnabled == '1' ? '使用中' : '停用'}}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column align="center"
                           fixed="right"
                           header-align="center"
                           label="操作"
                           min-width="210px">
            <template slot-scope="scope">

              <!--<el-button type="text" @click='jump2Page("/product/update", scope.row.id)'-->
              <!--v-if="common.buttonAuth(constant.UPDATE)">编辑-->
              <!--</el-button>-->

              <!--<el-button type="text" @click="updateEntityStatus(scope.row)" v-if="common.buttonAuth(constant.STOP)">-->
              <!--<el-button type="text" @click="updateEntityStatus(scope.row)">
                  {{scope.row.isDeleted === 0 ? '删除' : '有效'}}
              </el-button>-->

              <!--<el-button type="text" @click="updateEntityIsShow(scope.row)" v-if="common.buttonAuth(constant.SET)">-->
              <el-button size="mini"
                         type="text"
                         @click="updateEntityEnabledStatus(scope.row)">
                {{scope.row.isEnabled === '0' ? '启用' : '停用'}}
              </el-button>
              <!--<el-button type="text" @click="deleteEntity(scope.row)" v-if="common.buttonAuth(constant.DELETE)">-->
              <el-button size="mini"
                         type="text"
                         @click="deleteEntity(scope.row)">
                删除
              </el-button>
              <el-button size="mini"
                         type="text"
                         @click="openDialog(scope.row.userId)">设置角色
              </el-button>
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
    <treeDialog
                :dialogVisible="dialogVisible"
                :rules="rules"
                :title="title"
                :treeData="treeData"
                :userId="userId"
                :checkData="checkData"
                @closeDialog="closeDialog"></treeDialog>
  </div>
</template>

<script>
  import CustomPage from 'components/listCustomPage/Index';
  import treeDialog from 'components/dialogCustomPage/Index';
  import {queryRoleList, queryRoleListUser} from 'apis/privilege/role';

  export default {
    data() {
      return {
        loading: true,
        paginationShow: false,
        pageSizes: pageSizes,
        total: 0,
        param: {
          content: {
            name: '',
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
        dialogVisible: false,//弹框是否显示
        title: '用户角色设置',
        userId: '',//用户编号
        treeData: [],//角色集合
        checkData: []//选中角色集合
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
          name: '',
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
        //   common.confirm({
        //     message: `确认删除“${row.name}”？`,
        //   }).then(() => {
        //     deleteProduct({content: row.id}).then(resp => {
        //       if (200 === resp.status) {
        //         common.message({
        //           message: `${row.name}删除成功`,
        //         });
        //
        //         this.queryPage();
        //       }
        //     });
        //   }).catch(() => {
        //     // 取消按钮的回调
        //     console.log('取消按钮的回调');
        //   });
        // });
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

      addUser() {//创建用户信息
        this.$router.push('/user/add');
      },

      openDialog(userId) {//打开创建角色的弹框
        let vm = this;
        vm.dialogVisible = true;
        vm.userId = userId;
        console.info(vm.checkData)
        queryRoleUserList({content: userId}).then(data => {//获取当前员工的角色信息
          vm.checkData = [];
          if (200 == data.code) {
            let checks = data.content;
            checks.forEach(item => {
              vm.checkData.push(item.roleId);
            });
          }
          console.info(vm.checkData)
        });

      },

      // 关闭设置添加日志的dialog页面
      closeDialog: function() {
        let vm = this;
        vm.dialogVisible = false;
        vm.checkData = []
      },

      selectRole() {//获取全部的用户角色
        let vm = this;
        queryRoleList({}).then(data => {
          if (200 === data.code) {
            vm.treeData = common.toTree(data.content);
          } else {
            this.$message.error(data.message);
          }
        });
      }
    },
    mounted() {
      this.queryPage();
      this.selectRole();
    },
    components: {
      'custom-page': CustomPage,
      'treeDialog': treeDialog
    }
  };
</script>

