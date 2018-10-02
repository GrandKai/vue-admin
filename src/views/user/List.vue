<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/system' }">用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <custom-page>
      <template slot="buttonArea">
        <li>
          <el-button icon="el-icon-plus"
                     @click="addUser"
                     type="primary">添加用户
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
               创建时间： <el-date-picker v-model="param.content.startTime"
                                     placeholder="开始时间"
                                     style="width: 195px"
                                     type="datetime"
                                     value-format="yyyy-MM-dd HH:mm:ss"
                                     @change="queryPage">
          </el-date-picker>
            至
            <el-date-picker v-model="param.content.endTime"
                            placeholder="结束时间"
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
                    placeholder="用户名/昵称/手机号/QQ"
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
          <el-table-column align="center"
                           header-align="center"
                           type="selection"
                           width="50"
                           :reserve-selection="true">
          </el-table-column>

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

              <!--<el-button size="mini" type="text" @click='jump2Page("/product/update", scope.row.id)'-->
              <!--v-if="common.buttonAuth(constant.UPDATE)">编辑-->
              <!--</el-button>-->

              <!--<el-button size="mini" type="text" @click="updateEntityStatus(scope.row)" v-if="common.buttonAuth(constant.STOP)">-->
              <!--<el-button size="mini" type="text" @click="updateEntityStatus(scope.row)">
                  {{scope.row.isDeleted === 0 ? '删除' : '有效'}}
              </el-button>-->

              <!--<el-button size="mini" type="text" @click="updateEntityIsShow(scope.row)" v-if="common.buttonAuth(constant.SET)">-->
              <el-button size="mini"
                         type="text"
                         @click="updateEntityEnabledStatus(scope.row)">
                {{scope.row.isEnabled === '0' ? '启用' : '停用'}}
              </el-button>
              <!--<el-button size="mini" type="text" @click="deleteEntity(scope.row)" v-if="common.buttonAuth(constant.DELETE)">-->
              <el-button size="mini"
                         type="text"
                         @click="deleteEntity(scope.row)">
                删除
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
  </div>
</template>

<script>
  import CustomPage from 'components/listCustomPage/Index';

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

        tableData: []
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
        console.log('分页查询入参：', this.param);

        this.loading = true;
        this.$http.post('/user', this.param).then((resp) => {

          console.log('..............查询分页结果：', resp);
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
        console.log('........................');
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
          message: `是否${text}【${row.name}】的账户？`
        }).then(() => {
          let param = {
            content: {
              userId: row.id,
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

      addUser(){//创建用户信息
        this.$router.push("/user/add");
      }
    },
    mounted() {
      this.queryPage();
    },
    components: {
      'custom-page': CustomPage
    }
  };
</script>

