export let sum = (x,y)=>{
  return x+y;
}

export let minus = (x,y)=>{
  return x-y;
}

//在main.js中可以通过下面几种方法导入
import {sum,minus} from './util'

console.log(`${sum(1,8)}`);

import * as util from './util'

console.log(`${util.sum(1,8)}`)


