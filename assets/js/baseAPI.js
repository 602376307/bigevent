$.ajaxPrefilter(function (options) {
    // options.url为$.ajax中的url，因此进行拼接前缀,进行赋值
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    // 
    if (options.url.indexOf('/my/') != -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 挂载complete函数 无论请求成功与否都会执行该回调
    options.complete = function (res) {
        if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {
            // 清空token
            localStorage.removeItem('token')
            // 跳转回登录页面
            location.href = '/login.html'
        }
    }
})