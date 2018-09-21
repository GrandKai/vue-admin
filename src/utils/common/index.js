import {$vm} from '@/main'

export default {

  // 电话号码校验
  isMobilePhone: function (tel) {
    let pattern = /^((13[0-9])|(17[0-9])|(14[0-9])|(15[0-9])|(18[0-9]))\d{8}$/;
    return pattern.test(tel)
  },

  // 是否为空
  isEmpty: function (str) {
    return (typeof str === 'undefined') || (str == null) || (str === '') || (str === 'null') || (str === 'NULL') || (str == undefined) || (str == "undefined")
  },

  // 是否为字符串
  isString: function (it) {
    return !!arguments.length && it != null && (typeof it === 'string' || it instanceof String)
  },

  // 是否为数组
  isArray: function (it) {
    return (it && it instanceof Array) || Array.isArray(it)
  },

  // 是否为方法
  isFunction: function (obj) {
    return typeof obj === 'function'
  },

  isDOMElement: function (obj) {
    return !!(obj && typeof window !== 'undefined' && (obj === window || obj.nodeType))
  },

  // 是否为布尔
  isBoolean: function (obj) {
    return obj === true || obj === false
  },

  isNumeric: function (obj) {
    return /^\d+(\.\d+)?$/.test(obj)
  },

  isChinese: function (str) {
    return /[\u4E00-\u9FA5]/g.test(str)
  },

  trim: function (str) {
    return str.replace(/(^\s*)|(\s*$)/g, '')
  },

  // 字符串转json
  stringToJson: function (json) {
    if (typeof json === 'object') {
      return json
    }
    return JSON.parse(json)
  },

  // json转字符串
  jsonToString: function (json) {
    if (this.isString(json)) {
      return json
    }
    return JSON.stringify(json)
  },

  // 放到缓存中
  pushLocalStorage: function (key, value) {
    value = this.jsonToString(value)
    sessionStorage.setItem(key, value)
  },

  // 从缓存中取出
  popLocalStorage: function (key) {
    var value = sessionStorage.getItem(key)
    if (!this.isEmpty(value)) {
      value = this.stringToJson(value)
      return value
    } else {
      return "";
    }
  },

  // 格式化日期
  dateFormat: function (date, fmt) {
    if (!date instanceof Date) {
      return ""
    }
    if (!fmt || !this.isString(fmt)) {
      fmt = "yyyy-MM-dd"
    }
    var o = {
      "M+": date.getMonth() + 1, // 月份
      "d+": date.getDate(), // 日
      "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 小时
      "H+": date.getHours(), // 小时
      "m+": date.getMinutes(), // 分
      "s+": date.getSeconds(), // 秒
      "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
      "S": date.getMilliseconds() // 毫秒
    };
    var week = {
      "0": "\u65e5",
      "1": "\u4e00",
      "2": "\u4e8c",
      "3": "\u4e09",
      "4": "\u56db",
      "5": "\u4e94",
      "6": "\u516d"
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
    }
    if (/(E+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[date.getDay() + ""])
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
      }
    }
    return fmt
  },
  // 克隆对象
  clone: function (obj) {
    var buf;
    if (obj instanceof Array) {
      buf = [];
      for (var i = 0; i < obj.length; i++) {
        buf.push(this.clone(obj[i]))
      }
    } else if (obj instanceof Object) {
      buf = {}
      for (var j in obj) {
        buf[j] = this.clone(obj[j])
      }
    } else {
      buf = obj
    }
    return buf
  },
  // 字符串转数字
  stringToInt: function (str) {
    if ((typeof str === 'undefined') || (str == null) || (str === '') || (str === 'null') || (str === 'NULL')) {
      return 0;
    } else {
      return parseFloat(str)
    }
  },
  numberFormat: function (val, index) {
    var vm = this;
    var fa = "";
    val = val + "";
    if (val.substring(0, 1) == "-")
    // fa = "-"; // 允许为负数
      fa = ""; // 不允许为负数
    var str = "";
    if (index == 1) {
      str = (val.replace(/[^0-9.]/g, '')).replace(/[.][0-9]*[.]/, '.').replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3');
    } else if (index == 2) {
      str = (val.replace(/[^0-9.]/g, '')).replace(/[.][0-9]*[.]/, '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
    } else {
      str = (val.replace(/[^0-9.]/g, '')).replace(/[.][0-9]*[.]/, '.');
    }
    if (str.substring(0, 1) == ".")
      str = "0" + str;
    return fa + str;
  },
  // 是否存在数字
  existNumber: function (str) {
    var p = /[0-9]/;
    var b = p.test(str);
    return b;
  },

  // 获得url中的参数
  getQueryString: function () {
    var url = location.href; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
      var str = url.substr(url.indexOf("?") + 1);
      var strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
      }
    }
    return theRequest;
  },

  // 金额加逗号的format
  formatCash: function (num, digit) {
    if (common.isEmpty(num)) {
      return null;
    }
    digit = digit ? digit : 2;

    var num = num.toString(),
      minus = num.substring(0, 1) == '-' ? '-' : '';
    num = minus == '-' ? num.substring(1) : num;
    num = num.replace(/\.$/, '');

    var integral = num,
      decimal = '';
    if (num.indexOf('.') != -1) {
      integral = num.substring(0, num.indexOf('.'));
      decimal = num.substring(num.indexOf('.'));

      decimal = decimal.length > (1 + digit) ? decimal.substring(0, (1 + digit)) : decimal;
    }

    var result = '';
    while (integral.length > 3) {
      result = ',' + integral.slice(-3) + result;
      integral = integral.slice(0, integral.length - 3);
    }

    if (integral) {
      result = integral + result;
    }

    return minus + result + decimal;
  },

  // 加密手机号中间四位
  formatPhone: function (phone) {
    var str = '1366668888';
    if (phone.length == 11) {
      return phone.substr(0, 3) + "****" + phone.substr(7);
    } else {
      return phone;
    }
  },
  getSelRan: function (id) {
    var obj = document.activeElement;
    if (document.activeElement.id == id) {
      var pos = common.getCursorPos(obj);
      common.setCursorPos(obj, pos);
    }
  },

  //获取光标位置
  getCursorPos: function (ctrl) {
    var pos = 0; // IE Support
    if (ctrl.selection) {
      var Sel = ctrl.selection.createRange();
      Sel.moveStart('character', -ctrl.value.length);
      pos = Sel.text.length;
    }
    // Firefox support
    else if (ctrl.selectionStart || ctrl.selectionStart == '0')
      pos = ctrl.selectionStart;
    return (pos);
  },

  //设置光标位置
  setCursorPos: function (ctrl, pos) {
    if (ctrl.setSelectionRange) {
      ctrl.setSelectionRange(pos, pos);
    } else if (ctrl.createTextRange) {
      var range = ctrl.createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  },

  getUrlParam: function (key) {
    let currentUrl = window.location.href;
    let paramStr = currentUrl.substr(currentUrl.indexOf("?") + 1);
    let paramArr = paramStr.split("&");
    let result = null;
    paramArr.map((item) => {
      // alert(key)
      // alert(item.split("=")[0])
      // alert(item.split("=")[1])
      if (key == item.split("=")[0]) {
        result = item.split("=")[1];
      }
    });
    return result;
  },

  /***************  递归树状结构　*********************/
  /**
   * 传入参数为展示的树形数据
   * 参数格式如下：
   * { data: "数据数组" , nodeName :"节点显示名称属性名" , nodeId : "节点ID属性名" , parentId : "父节点ID属性名"};
   * { data: data , nodeName : "organizeName" , nodeId : "organizeCode" , parentId : "organizeParentCode" };
   */
  toTree(config) {
    // 删除 所有 children,以防止多次调用
    config.data.forEach(function (item) {
      delete item.children;
    });
    // 将数据存储为 以 id 为 KEY 的 map 索引数据列
    var map = {};
    config.data.forEach(function (item) {
      // 树 的label
      item.label = item[config.nodeName];
      map[item[config.nodeId]] = item;
    });
    var val = [];
    config.data.forEach(function (item) {
      // 以当前遍历项，的pid,去map对象中找到索引的id
      var parent = map[item[config.parentId]];
      // 如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
      if (parent) {
        (parent.children || (parent.children = [])).push(item);
      } else {
        //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
        val.push(item);
      }
    });
    return val;
  },

  /****************** 展开树 **********************/
  /** 需要定义的变量如下：
   * treeShow: true, // 树的显示状态
   * isExpand: false, // 默认展开
   * currentTreeKey:"", // 树的选中节点
   *
   * 建议增加参数：引用树的ref
   */
  treeOpen() {
    this.currentTreeKey = this.$refs.departmentTree.getCurrentKey();
    this.isExpand = true;
    this.treeShow = false;
    setTimeout(() => {
      this.treeShow = true;
      if (this.currentTreeKey != null) {
        this.$nextTick(() => {
          this.$refs.departmentTree.setCurrentKey(this.currentTreeKey);
        })
      }
    }, 10)
  },

  /****************** 合并树 **********************/
  /** 需要定义的变量如下：
   * treeShow: true, // 树的显示状态
   * isExpand: false, // 默认展开
   * currentTreeKey:"", // 树的选中节点
   *
   * 建议增加参数：引用树的ref
   */
  treeClose() {
    this.currentTreeKey = this.$refs.departmentTree.getCurrentKey();
    this.isExpand = false
    this.treeShow = false
    setTimeout(() => {
      this.treeShow = true
      if (this.currentTreeKey != null) {
        this.$nextTick(() => {
          this.$refs.departmentTree.setCurrentKey(this.currentTreeKey);
        })
      }
    }, 10)
  },

  // 列表中空数据的显示形式
  emptyFilter: (val) => {
    if (common.isEmpty(val) && 0 !== val) {
      return constant.EMPTY;
    }
    return val;
  },

  // 列表中空数据的显示形式
  emptyFormat: function (row, column) {
    var val = row[column.property];
    if (common.isEmpty(val)) {
      return constant.EMPTY;
    }
    return val;
  },
  toZeroFormat: function (row, column) {
    var val = row[column.property];
    if (common.isEmpty(val)) {
      return 0;
    }
    return val;
  },

  // 通过身份证号获得身份详细信息
  getInfoByCard(idcard) {
    //获取出生日期
    let birth = idcard.substring(6, 10) + "-" + idcard.substring(10, 12) + "-" + idcard.substring(12, 14);

    //获取性别
    let sex = {};
    if (parseInt(idcard.substr(16, 1)) % 2 == 1) {
      //男
      sex = {code: 1, name: "男"};
    } else {
      //女
      sex = {code: 2, name: "女"};
    }
    //获取年龄
    let age = 0;
    var myDate = new Date();
    var month = myDate.getMonth() + 1;
    var day = myDate.getDate();
    age = myDate.getFullYear() - idcard.substring(6, 10) - 1;
    if (idcard.substring(10, 12) < month || idcard.substring(10, 12) == month && idcard.substring(12, 14) <= day) {
      age++;
    }
    return {sex, age, birth}
  },

  // 确认提示框的共通
  confirm(option) {
    return $vm.$confirm(option.message, common.isEmpty(option.title) ? '提示' : option.title, {
      confirmButtonText: common.isEmpty(option.confirmButtonText) ? '确定' : option.confirmButtonText,
      cancelButtonText: common.isEmpty(option.cancelButtonText) ? '取消' : option.cancelButtonText,
      type: 'warning',
      closeOnPressEscape: false,
      closeOnClickModal: false,
    });
  },

  // 提示信息的共通
  message(option) {
    if (common.isEmpty(option.type)) {
      option.type = "success"
    }
    if (common.isEmpty(option.confirmButtonText) && common.isEmpty(option.confirm)) { // 如果没有按钮
      $vm.$message({
        message: option.message,
        type: option.type
      });
    } else { // 如果有按钮
      return $vm.$alert(option.message, {
        dangerouslyUseHTMLString: true,
        confirmButtonText: common.isEmpty(option.confirmButtonText) ? '确定' : option.confirmButtonText,
      })
    }
  },

  // 其他联系方式，后四位是****
  formatContactInformation: function (info) {
    return info.substring(0, info.length - 4) + "****";
  },

  // 地址市后显示****
  formatAddress: function (address) {
    // let cityIndex = address.indexOf("市");
    // return address.substring(0, address.length-4) + "****";
  },

  // 获取登录者信息
  getLoginUserInfo: function () {
    return eval('(' + sessionStorage.getItem('loginUserInfo') + ')');
  },

  // 比较两个对象
  compare: function (objA, objB) {
    return common.compareObj(objA, objB, true); //默认为true
  }, compareObj: function (objA, objB, flag) {
    for (var key in objA) {
      let valA = common.nullToString(objA[key]);
      let valB = common.nullToString(objB[key]);
      if (!flag) //跳出整个循环
        break;
      if (!objB.hasOwnProperty(key)) {
        flag = false;
        break;
      }
      if (!common.isArray(valA)) { //子级不是数组时,比较属性值
        if (valB != valA) {
          console.log(key, "有变化")
          flag = false;
          break;
        }
      } else {
        if (!common.isArray(valB)) {
          flag = false;
          break;
        }
        var oA = valA,
          oB = valB;
        if (oA.length != oB.length) {
          flag = false;
          break;
        }
        for (var k in oA) {
          if (!flag) //这里跳出循环是为了不让递归继续
            break;
          flag = compareObj(oA[k], oB[k], flag);
        }
      }
    }
    return flag;
  },

  // 空转空串
  nullToString: function (param) {
    if (common.isEmpty(param)) {
      return "";
    } else {
      return param;
    }
  },

  // 判断是否为json
  isJSON(obj) {
    // if (typeof str == 'string') {
    try {
      // var obj=JSON.parse(str);
      if (typeof obj == 'object' && obj) {
        return true;
      } else {
        return false;
      }

    } catch (e) {
      return false;
    }
    // }
    // console.log('It is not a string!')
  },

  // 获取焦点后, 全选文本内容
  focus(event) {
    event.currentTarget.select();
  },

  v_checkNumber: function(rule, value, callback) {
    if (!(/^[0-9]+$/.test(value))) {
      callback(new Error('请输入数字值'));
    } else {
      if (!(value <= 30000 && value >=1)) {
        callback(new Error("排序值范围是1-30000"));
      } else {
        callback();
      }
    }

  }
}