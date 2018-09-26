<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
            <el-breadcrumb-item :to="{ path: '/' }">通用管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/system' }">系统管理</el-breadcrumb-item>
        </el-breadcrumb>

        <custom-page>

            <template slot="buttonArea">
                <li>
                    <el-button type="primary" @click="addEntity"><i class="el-icon-plus"></i> 新建系统</el-button>
                </li>
            </template>
            <template slot="tableArea">

                <el-table :data="tableData" border stripe highlight-current-row
                          row-key="id" ref="multipleTable"
                          :row-class-name="tableRowClassName" v-loading="loading">

                    <!-- 显示索引 -->
                    <el-table-column
                            prop="module"
                            :formatter="formatter"
                            label="序号"
                            width="60" header-align="center" align="center">
                    </el-table-column>

                    <el-table-column label="系统名称" header-align="center" align="left" fixed="right">
                        <template slot-scope="scope">
                            <el-button style="padding-left:0" type="text"
                                       @click='updateEntity(scope.row , "name" , "系统名称")'>
                                {{ scope.row.name }}
                            </el-button>
                        </template>
                    </el-table-column>

                    <el-table-column label="显示顺序" header-align="center" align="left" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" @click='updateEntity(scope.row , "sortNumber" , "显示顺序")'>
                                {{ scope.row.sortNumber}}
                            </el-button>
                        </template>
                    </el-table-column>

                    <el-table-column label="版本号" header-align="center" align="left" fixed="right">
                        <template slot-scope="scope">
                            <div class="click-text" @click='updateEntity(scope.row , "version" , "版本号")'>
                                {{ scope.row.version }}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column label="访问URL" header-align="center" align="left" fixed="right">
                        <template slot-scope="scope">
                            <div class="click-text" @click='updateEntity(scope.row , "url" , "访问URL")'>
                                {{ scope.row.url }}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column label="系统描述" header-align="center" align="left" fixed="right" prop="description"
                                     @click='updateEntity(scope.row , "description" , "系统描述")'>
                        <template slot-scope="scope">
                            <div class="click-text" @click='updateEntity(scope.row , "description" , "系统描述")'>
                                {{ scope.row.description }}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column label="系统状态" header-align="center" align="center" fixed="right" width="80px">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.isEnabled === '1' ? 'success' : 'danger'" disable-transitions>
                                {{ scope.row.isEnabled == '1' ? '运行中' : '停用'}}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" header-align="center" align="center" fixed="right" min-width="210px">
                        <template slot-scope="scope">

                            <el-button size="mini" @click="updateEntityEnabledStatus(scope.row)">
                                {{scope.row.isEnabled === '0' ? '启用' : '停用'}}
                            </el-button>

                            <el-button size="mini" type="danger" @click="deleteEntity(scope.row)">
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
        <!--<plat-update-dialog :dlgSettings1="dlgSettings" :dialogVisible="false"></plat-update-dialog>-->

    </div>
</template>

<script>
  // 导入校验规则
  import CustomPage from 'components/listCustomPage/Index'
  // import PlatUpdate from 'components/business/dialog/PlatUpdate'
  import {queryPlatPage, stopPlat, deletePlat, checkUpdateExistPlat, updatePlat} from 'apis/general/plat'

  export default {
    components: {
      'custom-page': CustomPage,
      // 'plat-update-dialog': PlatUpdate
    },
    data() {
      return {
        // 修改的内容
        editForm: {
          id: "",
          property: "",
          content: ""
        },
        loading: false,
        paginationShow: false,
        pageSizes: pageSizes,
        total: 0,
        param: {
          content: {},
          page: {
            pageNum: 1,
            pageSize: pageSizes[0]
          }
        },

        tableData: [],

        // 弹出框属性设置
        dlgSettings: {
          title: "", // 弹窗标题
          visible: false, // 弹窗可见
          inputType: "text", // 弹窗内文本框类型
          rowNum: 1 // 文本框行数
        },

        // 校验规则
        rules: {}
      };
    },
    created () {
      this.queryPage();
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

      /**
       * 分页查询
       * @param param
       */
      queryPage() {
        this.loading = true;
        queryPlatPage(this.param).then((data) => {
          this.loading = false;
          this.paginationShow = true;

          if (data.content && data.content.list) {
            this.tableData = data.content.list;
            this.total = data.content.total;
          }
        }).catch(error => {
          this.loading = false;
        });
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

      addEntity: function () {
        this.$router.push("/system/add");
      },

      /***************　打开修改系统对话框　*********************/
      updateEntity(row, rowName, dlgTitle) {

        // 判断弹出框展示样式
        switch (rowName) {
          case 'description': {
            this.dlgSettings = {title: dlgTitle, visible: true, inputType: "textarea", rowNum: 4};
            break;
          }
          default: {
            this.dlgSettings = {title: dlgTitle, visible: true, inputType: "text", rowNum: 1};
            break;
          }
        }
        // 根据列名添加校验规则
        switch (rowName) {
          case 'sortNumber': {
            // 手动添加的数字校验
            this.rules.content = [{validator: common.checkNumber, trigger: "blur"}];
            break;
          }
          case 'name': {
            this.rules.content = [
              {required: true, message: "请输入" + dlgTitle + "，长度在50个字符内", trigger: "blur", max: 50},
              {validator: this.checkExist, trigger: "blur"}
            ];
            break;
          }
          case 'description': {
            this.rules.content = [
              {required: true, message: "请输入" + dlgTitle + "，长度在500个字符内", trigger: "blur", max: 500},
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
          id: row.id,
          property: rowName,
          content: row[rowName]
        };
      },
      /*********************** 根据系统名 校验是否存在系统  ***************************/

      /**
       * 校验系统是否存在
       * @param rule
       * @param value 系统名
       * @param callback
       */
      checkExist(rule, value, callback) {
        let param = {
          content: {
            id: this.editForm.id,
            name: value
          }
        };
        checkUpdateExistPlat(param).then(data => {
          if (200 === data.code) {
            callback();
          } else if (4001 === data.code) {
            callback(new Error("系统已存在，请修改后在提交"));
          } else {
            this.$message.error(data.message);
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
                id: this.editForm.id, // 修改记录的ID
              }
            };
            // 修改记录的属性和属性值
            param.content[this.editForm.property] = this.editForm.content;

            updatePlat(param).then(data => {
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

      /**
       * 删除实体
       * @param id
       */
      deleteEntity(row) {
        common.confirm({
          message: `此操作将永久删除, 是否继续？`,
        }).then(() => {
          deletePlat({content: row.id}).then(data => {
            if (200 === data.code) {
              this.$message.success(`【${row.name}】删除成功`);
              this.queryPage();
            } else {
              this.$message.error(data.message);
            }
          });
        }).catch(() => {
        });
      },

      updateEntityEnabledStatus(row) {

        let text = row.isEnabled === '1' ? '停用' : '启用';
        let isEnabled = row.isEnabled === '1' ? '0' : '1';

        common.confirm({
          message: `此操作将【${text}】该系统, 是否继续？`,
        }).then(() => {
          let param = {
            content: {
              id: row.id,
              isEnabled: isEnabled
            }
          };
          stopPlat(param).then(data => {
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
    }
  };
</script>

<style lang="scss" scoped>
    .pagination {
        text-align: center;
        margin-top: 50px;
    }

    .sys-table {
        width: 100%;
        margin-top: 30px;
    }

    .role-input {
        width: 200px;
        margin-right: 15px;
    }

    .role-drop {
        margin-right: 15px;
    }

    .el-checkbox {
        display: block;
        margin-left: 50px;
    }

    .role-title {
        text-align: center;
        margin-bottom: 15px;
        font-size: 18px;
    }

    .click-text {
        color: #409eff;
        cursor: pointer;
    }
</style>
