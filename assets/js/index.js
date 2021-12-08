$(function () {
    // 请求用户信息
    getUserInfo()
    // 退出功能
    var layer = layui.layer // 导入layer
    $('#btnLogout').on('click', function () {
        layer.confirm('确认退出登录吗？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            // 清空token
            localStorage.removeItem('token')
            // 跳转回登录页
            location.href = '/login.html'
            layer.close(index); // 关闭询问框
        });
    })

})
// 请求用户信息函数
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('请求用户信息失败')
            }
            // 渲染用户头像
            renderAvatar(res.data)
        }
    })
}
// 渲染用户头像函数
function renderAvatar(user) {
    var name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    if (user.user_pic) {
        $('.avatar').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('.avatar').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}