$.ajaxPrefilter(function (options) {
    // options.url为$.ajax中的url，因此进行拼接前缀,进行赋值
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
})