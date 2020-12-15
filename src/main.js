import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

import '../public/UEditor/ueditor.config.js'
import '../public/UEditor/ueditor.all.min.js'
import '../public/UEditor/lang/zh-cn/zh-cn.js'
import '../public/UEditor/themes/default/css/ueditor.min.css'
// import '../public/UEditor/xiumi-ue-dialog-v5.js'
import '../public/UEditor/xiumi-ue-v5.css'

// import {
//   Notice,
//   Modal,
//   Button
// } from 'view-design';
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
Vue.use(ViewUI);
// Vue.prototype.$notice = Notice;
// Vue.prototype.$modal = Modal;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')