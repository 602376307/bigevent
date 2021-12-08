$(function () {
    var form = layui.form
    var layer = layui.layer
    // 定义昵称的验证规则
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符之间'
            }
        }
    })
    inituserinfo()
    // 获取用户信息
    function inituserinfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                // 调用该方法为表单快速赋值
                form.val('formUserInfo', res.data)
            }
        })
    }
    // 重置功能 默认的重置行为会清空用户登录名
    $('#btnReset').on('click', function (e) {
        // 先阻止layui的默认重置行为
        e.preventDefault()
        // 再次调用函数inituserinfo即可
        inituserinfo()
    })
    // 修改资料功能
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            // serialize()快速获取表单数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                // 在子页面中调用父页面的方法重新渲染用户信息 window代表iframe
                window.parent.getUserInfo()
            }
        })
    })
})