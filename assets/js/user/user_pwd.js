$(function () {
    var form = layui.form
    // 定义密码验证规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        newpwd: function (value) {
            var oldpwd = $('.userpwd-box [name=oldPwd]').val()
            if (oldpwd === value) {
                return '新密码不能和旧密码一致'
            }
        },
        repwd: function (value) {
            var pwd = $('.userpwd-box [name=newPwd]').val()
            if (pwd !== value) {
                return '两次输入密码不一致'
            }
        }
    })
    // 发起请求重置密码
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layui.layer.msg('更新密码失败')
                }
                layui.layer.msg('更新密码成功')
                // 重置表单  $('.layui-form')[0] 转化为原生。 原生中有reset方法重置表单
                $('.layui-form')[0].reset()
            }
        })
    })
})