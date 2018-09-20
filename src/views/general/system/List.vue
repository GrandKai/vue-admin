<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
			<el-breadcrumb-item :to="{ path: '/' }">通用管理</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/system/list' }">系统管理</el-breadcrumb-item>
		</el-breadcrumb>

		<div>
			<el-button type="primary" @click="createSystem()" ><i class="el-icon-plus"></i> 新建系统</el-button>
		</div>

		<el-table :data="systemList" class="sys-table" stripe border  highlight-current-row>

			<el-table-column label="序号">
				<template slot-scope="scope">
					{{(scope.$index+1)+(currentPage-1)*pageSize}}
				</template>
			</el-table-column>

			<el-table-column label="系统名称">
				<template slot-scope="scope">
					<el-button style="padding-left:0" type="text" @click='editSystem(scope.row , "name" , "系统名称")'>
						{{ scope.row.name }}
					</el-button>
				</template>
			</el-table-column>

			<el-table-column label="显示顺序">
				<template slot-scope="scope">
					<el-button type="text" @click='editSystem(scope.row , "sortNumber" , "显示顺序")'>
						{{ scope.row.sortNumber}}
					</el-button>
				</template>
			</el-table-column>

			<el-table-column label="版本号">
				<template slot-scope="scope">
					<div class="click-text" @click='editSystem(scope.row , "version" , "版本号")'>
						{{ scope.row.version }}
					</div>
				</template>
			</el-table-column>

			<el-table-column label="访问URL">
				<template slot-scope="scope">
					<div class="click-text" @click='editSystem(scope.row , "url" , "访问URL")'>
						{{ scope.row.url }}
					</div>
				</template>
			</el-table-column>

			<el-table-column label="系统描述">
				<template slot-scope="scope">
					<div class="click-text" @click='editSystem(scope.row , "info" , "系统描述")'>
						{{ scope.row.info }}
					</div>
				</template>
			</el-table-column>

			<el-table-column label="系统状态">
				<template slot-scope="scope">
					{{ scope.row.isEnableName }}
				</template>
			</el-table-column>

			<el-table-column label="操作" min-width="80">
				<template slot-scope="scope">
					<el-button size="mini" @click="stopSystem(scope.row.id ,scope.row.isEnable)">
						{{ scope.row.operateName }}
					</el-button>
					<el-button size="mini" type="danger" @click="delSystem(scope.row.id)" >
						删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>


		<div class="pagination">
			<el-pagination
				@current-change="handleCurrentChange" @size-change="handleSizeChange"
				:current-page="currentPage" :page-size="pageSize"
				:page-sizes="pageSizeArr"
				background layout="total, sizes , prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>


		<!-- 编辑权限系统信息对话框 -->
		<el-dialog :title="dlgSettings.title + '设置'" :visible.sync="dlgSettings.visible" width="30%" :close-on-click-modal="false">
			<el-form :model="editInfo"  :rules="rules" ref="editForm" onsubmit="return false;">
			<div class="clearfix">
				<el-form-item prop="content">
					<el-input v-model.trim="editInfo.content" placeholder="请输入内容" class="left role-input" :type="dlgSettings.inputType" :rows="dlgSettings.rowNum"  @keyup.native.enter="onSubmit"></el-input>
					<el-button @click="dlgSettings.visible = false" class="left">取 消</el-button>
					<el-button type="primary" @click="onSubmit()" class="left">保 存</el-button>
				</el-form-item>
			</div>
			</el-form>
		</el-dialog>

	</div>
</template>

<script>
// 导入校验规则
import { v_checkNumber } from "@/utils/function/validate";

export default {
  data() {
    return {
      // 权限验证列表
      btnRightList: [],
      // 当前页码
      currentPage: 1,
      // 每页多少条
      pageSize: 10,
      // 页码总数
      total: 1,
      // 系统列表
      systemList: [],
      // 系统信息
      systemInfo: {
        id: "",
        name: "",
        info: "",
        sortNumber: "",
        url: "",
        version: ""
      },
      // 弹出框属性设置
      dlgSettings: {
        title: "", // 弹窗标题
        visible: false, // 弹窗可见
        inputType: "text", // 弹窗内文本框类型
        rowNum: 1 // 文本框行数
      },
      // 修改的内容
      editInfo: {
        id: "",
        property: "",
        content: ""
      },
      // 修改前内容(用于校验重名系统)
      beforeEdit: "",
      // 每页展示条数 （若更改，需同步更改 pageSize的初始属性）
      pageSizeArr: [10, 20, 50, 100, 200, 400],
      // 校验规则
      rules: {}
    };
  },
  created: function() {
    // 权限校验
    // this.btnRight();
    // 获取系统列表
    this.getSystemList();
  },
  methods: {
    /***********权限验证方法**************/
    // btnRight() {
    //   let right = this.getBtnRight("系统管理");
    //   if (right.length > 0) {
    //     this.btnRightList = [...right];
    //   }
    // },
    /***********当页面载入查询数据**************/
    getSystemList() {
      this.sendAxios();
    },

    /***********发送查询Ajax请求**************/
    sendAxios() {
      this.systemList = [];
      // 传入参数
      let param = {
        page: { pageNum: this.currentPage, pageSize: this.pageSize }
      };
      this.$http
        .post('/api/plat/getAllSystemListForPage', param)
        .then(res => {
          this.systemList = res.data.content.list;
          this.total = res.data.content.total;
        });
    },

    /***********点击分页跳转**************/
    handleCurrentChange(val) {
      // 更新当前页码
      this.currentPage = val;
      // 发送查询请求
      this.sendAxios();
    },

    /***********新建系统**************/
    createSystem: function() {
      this.$router.push("/systemAdd");
    },

    /***************　打开修改系统对话框　*********************/
    editSystem(rowData, rowName, dlgTitle) {
      // 编辑前内容(用于重名校验)
      this.beforeEdit = rowData.rowName;
      // 判断弹出框展示样式
      switch (rowName) {
        case 'info': {
          this.dlgSettings = { title: dlgTitle, visible: true, inputType: "textarea", rowNum: 4};
          break;
        }
        default: {
          this.dlgSettings = { title: dlgTitle, visible: true, inputType: "text", rowNum: 1};
          break;
        }
      }
      // 根据列名添加校验规则
      switch (rowName) {
        case 'sortNumber': {
          // 手动添加的数字校验
          this.rules.content = [{ validator: v_checkNumber, trigger: "blur" }];
          break;
        }
        case 'name': {
          this.rules.content = [
            { required: true, message: "请输入" + dlgTitle + "，长度在50个字符内", trigger: "blur", max: 50 },
            { validator: this.whetherExist, trigger: "blur" }
          ];
          break;
        }
        case 'info': {
          this.rules.content = [
            { required: true, message: "请输入" + dlgTitle + "，长度在500个字符内", trigger: "blur", max: 500 },
          ];
          break;
        }
        case 'url': {
          this.rules.content = [
            { required: true, message: "请输入" + dlgTitle + "，长度在500个字符内", trigger: "blur", max: 500 },
          ];
          break;
        }
        default: {
          this.rules.content = [
            { required: true, message: "请输入" + dlgTitle + "，长度在50个字符内", trigger: "blur", max: 50 },
          ];
          break;
        }
      }
      // 清空表单
      this.clearForm("editForm");
      this.editInfo = {
        id: rowData.id,
        property: rowName,
        content: rowData[rowName]
      };
    },
    /*********************** 根据系统名 校验是否存在系统  ***************************/
    whetherExist(rule, value, callback) {
      if (this.beforeEdit == this.editInfo.content) {
        callback();
      }
      let param = { content: { name: value } };
      this.$http
        .post('/api/plat/whetherExitSystem', param)
        .then(res => {
          if (200 != res.data.status) {
            callback(new Error("系统已存在，请修改后在提交"));
          } else {
            callback();
          }
        });
    },
    /***************　提交修改信息　*********************/
    onSubmit() {
      if (this.beforeEdit == this.editInfo.content) {
        this.dlgSettings.visible = false; // 对话框关闭
        this.$message.success("修改成功！");
        return;
      }
      this.$refs.editForm.validate(valid => {
        if (valid) {
          // 提交修改
          this.sendAxiosForEdit();
        } else {
          return;
        }
      });
    },
    /***************  发送修改系统请求　*********************/
    sendAxiosForEdit() {
      // 传入参数
      let param = {
        content: {}
      };
      param.content.id = this.editInfo.id; // 修改记录的ID
      param.content[this.editInfo.property] = this.editInfo.content; // 修改记录的属性和属性值
      this.$http.post('/api/plat/editSystem', param).then(res => {
        if (200 === res.data.status) {
          this.sendAxios();
          this.dlgSettings.visible = false; // 对话框关闭
          this.$message.success("修改成功！");
        } else if (1002 === res.data.status) {
          this.dlgSettings.visible = true; // 对话框开启
          this.$message.error("系统已存在");
        } else {
          this.dlgSettings.visible = true; // 对话框开启
          this.$message.error("修改失败！");
        }
      });
    },
    /***************  删除系统　*********************/
    delSystem(id) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnPressEscape: false,
        closeOnClickModal: false,
        type: "warning"
      })
        .then(() => {
          let param = {
            content: { id: id, isDeleted: 1, isEnable: 0 }
          };
          this.$http.post('/api/plat/editSystem', param).then(res => {
            if (200 === res.data.status) {
              this.sendAxios();
              this.$message.success("删除成功！");
            } else {
              this.$message.error("删除失败！");
            }
          });
        })
        .catch(() => {});
    },
    /***************  停用/启用系统　*********************/
    stopSystem(id, isEnable) {
      // 出入参数
      let param = {
        content: {},
        operate: ""
      };
      if (isEnable == 1) {
        param.operate = "此操作将停用该系统, 是否继续？";
        param.content.id = id;
        param.content.isEnable = 0;
      } else {
        param.operate = "此操作将启用该系统, 是否继续？";
        param.content.id = id;
        param.content.isEnable = 1;
      }
      this.$confirm(param.operate, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnPressEscape: false,
        closeOnClickModal: false,
        type: "warning"
      })
        .then(() => {
          this.$http.post('/api/plat/editSystem', param).then(res => {
            if (200 === res.data.status) {
              this.sendAxios();
              this.$message.success("操作成功！");
            } else {
              this.$message.error("操作失败！");
            }
          });
        })
        .catch(() => {});
    },
    /***************  每页展示多少条　*********************/
    handleSizeChange(val) {
      this.pageSize = val;
      this.sendAxios();
    },
    /***************  清空Form　*********************/
    clearForm(formName) {
      // 修改框未初始化时，不清空表单
      if (typeof this.$refs[formName] != "undefined") {
        this.$refs[formName].resetFields();
      }
    }
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
