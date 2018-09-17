<template>
    <div>
        <custom-page>
            <template slot="queryArea">
                <li>
            <span>
               创建时间： <el-date-picker style="width: 195px"
                                     v-model="param.content.startTime"
                                     type="datetime"
                                     placeholder="开始时间" value-format="yyyy-MM-dd HH:mm:ss" @change="queryPage">
          </el-date-picker>
            至
            <el-date-picker style="width: 195px"
                            v-model="param.content.endTime"
                            type="datetime"
                            placeholder="结束时间" value-format="yyyy-MM-dd HH:mm:ss" @change="queryPage">
            </el-date-picker>
            </span>
                </li>

                <li>
                    <el-input v-model="param.content.name" placeholder="用户名/昵称/手机号/QQ" @keyup.native.enter="queryPage"
                              style="width: 220px"
                              clearable @input="clearInput"></el-input>
                </li>

                <li>
                    <el-button type="primary" @click="queryPage()" icon="el-icon-search">查 询
                    </el-button>
                </li>
                <li>
                    <el-button @click="clearQueryParam" icon="el-icon-delete">清 空
                    </el-button>
                </li>
            </template>
            <template slot="tableArea">
                <el-table :data="tableData" border stripe highlight-current-row
                          row-key="id" ref="multipleTable"
                          :row-class-name="tableRowClassName"
                          @selection-change="handleSelectionChange" v-loading="loading">
                    <!-- 多选框 -->
                    <el-table-column type="selection" width="50" :reserve-selection="true" header-align="center"
                                     align="center">
                    </el-table-column>

                    <!-- 显示索引 -->
                    <el-table-column
                            prop="module"
                            :formatter="formatter"
                            label="序号"
                            width="60" header-align="center" align="center">
                    </el-table-column>

                    <el-table-column
                            prop="name"
                            label="姓名"
                            width="180" align="left">
                    </el-table-column>

                    <el-table-column
                            prop="createTime"
                            label="创建日期"
                            width="180" align="center">
                    </el-table-column>

                    <el-table-column label="删除状态" header-align="center" align="center" fixed="right" width="80px">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.isDeleted === 1 ? 'danger' : 'success'" disable-transitions>
                                {{scope.row.isDeleted === 1 ? '已删除' : '有效'}}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column label="禁用状态" header-align="center" align="center" fixed="right" width="80px">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.isEnabled === 1 ? 'success' : 'danger'" disable-transitions>
                                {{ scope.row.isEnabled === 1 ? '已启用' : '已禁用'}}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" header-align="center" align="center" fixed="right" min-width="210px">
                        <template slot-scope="scope">

                            <!--<el-button size="mini" type="text" @click='jump2Page("/product/update", scope.row.id)'-->
                                       <!--v-if="common.buttonAuth(constant.UPDATE)">编辑-->
                            <!--</el-button>-->

                            <!--<el-button size="mini" type="text" @click="updateEntityStatus(scope.row)" v-if="common.buttonAuth(constant.STOP)">-->
                            <el-button size="mini" type="text" @click="updateEntityStatus(scope.row)">
                                {{scope.row.isDeleted === 0 ? '删除' : '有效'}}
                            </el-button>

                            <!--<el-button size="mini" type="text" @click="updateEntityIsShow(scope.row)" v-if="common.buttonAuth(constant.SET)">-->
                            <el-button size="mini" type="text" @click="updateEntityIsShow(scope.row)">
                                {{scope.row.isEnabled === 0 ? '启用' : '禁用'}}
                            </el-button>
                            <!--<el-button size="mini" type="text" @click="deleteEntity(scope.row)" v-if="common.buttonAuth(constant.DELETE)">-->
                            <el-button size="mini" type="text" @click="deleteEntity(scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>

            <template slot="paginationArea">
                <el-pagination v-show="paginationShow"
                               @current-change="handleCurrentChange"
                               @size-change="handleSizeChange"
                               background
                               :page-sizes="pageSizes"
                               :current-page.sync="param.page.pageNum" :page-size="param.page.pageSize"
                               layout="total, sizes,prev, pager, next, jumper" :total="total">
                </el-pagination>
            </template>
        </custom-page>
    </div>
</template>

<script>
  import CustomPage from 'components/listCustomPage/Index'

  export default {
    data() {
      return {
        // paginationShow: false,
        loading: true,
        paginationShow: false,
        pageSizes: pageSizes,
        total: 0,
        param: {
          content: {
            name: '',
            startTime: '',
            endTime: '',
          },
          page: {
            pageNum: 1,
            pageSize: pageSizes[0]
          }
        },

        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      }
    },

    methods: {

      tableRowClassName({row, rowIndex}) {
        // 把每一行的索引放进row
        row.rowIndex = rowIndex
      },

      formatter(row, column, cellValue, index) {
        //放回索引值
        return this.param.page.pageSize * (this.param.page.pageNum - 1) + 1 + row.rowIndex;
      },

      // 改变页码
      handleCurrentChange(val) {
        this.param.page.pageNum = val;
        // this.queryPage();
      },
      // 改变每页显示多少条
      handleSizeChange(value) {
        this.param.page.pageSize = value;
        // this.queryPage();
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
        console.log('分页查询入参：', this.param)

        this.loading = true;
        this.$http.post('/user/page', this.param).then((resp) => {
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
          endTime: '',
        };
        this.queryPage();
        this.$refs.multipleTable.clearSelection();
      },
      clearInput() {
        console.log("........................")
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
    },
    mounted() {
      this.queryPage();
    },
    components: {
      'custom-page': CustomPage
    }
  }
</script>