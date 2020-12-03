import "./index.less";
import _ from 'lodash';
import { printMe } from '../../assets/scripts/print';

if (module.hot) {
  module.hot.accept()
}

$(function () {

  console.log(_.defaults({ 'a': 1 }, { 'a': 3, 'b': 2 }));
  console.log('hot');
  printMe();
})

console.log("index");