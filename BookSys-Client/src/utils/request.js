import axios from 'axios'
import {MessageBox, Message, Loading} from 'element-ui'
import store from '@/store'
import {getToken} from '@/utils/auth'


let loading        //定义loading变量

function startLoading() {    //使用Element loading-start 方法
  loading = Loading.service({
    lock: true,
    text: '拼命加载中',
    spinner: "el-icon-loading",
    background: 'rgba(0, 0, 0, 0.8)'
  })
}
function endLoading() {    //使用Element loading-close 方法
  loading.close()
}
//那么 showFullScreenLoading() tryHideFullScreenLoading() 要干的事儿就是将同一时刻的请求合并。
//声明一个变量 needLoadingRequestCount，每次调用showFullScreenLoading方法 needLoadingRequestCount + 1。
//调用tryHideFullScreenLoading()方法，needLoadingRequestCount - 1。needLoadingRequestCount为 0 时，结束 loading。
let needLoadingRequestCount = 0
export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers.token = getToken()
      // config.headers.contentType="application/json;charset=utf-8"
    }
    //showFullScreenLoading()
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    if (res.code !== 200 || res.code !==0) {
      tryHideFullScreenLoading()
      if (res.code === 401) {
        // to re-login
        MessageBox.alert('您已注销，可以取消以停留在此页面，或重新登录', '确认登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }else if (res.code === 403) {
        Message({
          message: res.message || 'warning',
          type: 'warning',
          duration: 5 * 1000
        });
      }else if(res.code === 300){
        Message({
          message: res.message || 'warning',
          type: 'warning',
          duration: 5 * 1000
        });
      }else{
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        });
        return Promise.reject(new Error(res.message || 'Error'))
      }

    } else {
      tryHideFullScreenLoading()
      return res
    }
  },
  error => {
    tryHideFullScreenLoading()
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
