/**************** 自定义校验规则******************/
export function v_checkNumber(rule, value, callback) {

    // if (value.length != parseInt(value).toString().length) {
    //     callback(new Error("请输入数字值"));
    // }
    //
    // if (!Number.isInteger(parseInt(value))) {
    //     callback(new Error("请输入数字值"));
    // } else {
    //     if (0 < parseInt(value) && parseInt(value) < 30000) {
    //         callback();
    //     } else {
    //         callback(new Error("排序值范围是1-30000"));
    //     }
    // }

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

