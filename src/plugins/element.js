/* eslint-disable import/no-duplicates */
import Vue from 'vue'
import { Button } from 'element-ui'
import { Form, FormItem } from 'element-ui'
import { Input } from 'element-ui'
// 消息弹框
import { Message } from 'element-ui'
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 弹框组件挂载至$message
Vue.prototype.$message = Message
