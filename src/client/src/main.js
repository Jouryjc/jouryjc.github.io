require('babel-register')

import Vue from 'vue'
import App from './App.vue'
import {
    Table,
    TableColumn,
    Button,
    Tag,
    MessageBox,
    Dialog,
    Form,
    FormItem,
    Input,
    Message,
    Loading
} from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Button)
Vue.use(Tag)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Loading)

Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;

new Vue({
    render: h => h(App)
}).$mount('#app')