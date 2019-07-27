let ary = [ { id: 0, name: 'name0' },
    { id: 1, name: 'name1' },
    { id: 2, name: 'name2' },
    { id: 3, name: 'name3' },
    { id: 4, name: 'name4' } ];

// console.log(ary);

let obj = { id: 3, name: 'name3' };
let obj2 = obj;

console.log(obj === obj2);

let include1 = ary.includes(obj);
console.log("是否包含元素1：", include1);

let target = ary.filter(item => item.id === obj.id);
console.log("target:", target);

console.log("找到的元素：", target[0]);

let include2 = ary.includes(target[0]);
console.log("是否包含元素2：", include2);

console.log("对象相等：", target[0] === obj);