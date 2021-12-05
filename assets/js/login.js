window.addEventListener('load', function () {
    // 登录注册 切换功能
    var link_reg = document.querySelector('#link_reg')
    var link_login = document.querySelector('#link_login')
    var login_box = document.querySelector('.login-box')
    var reg_box = document.querySelector('.reg-box')
    link_reg.addEventListener('click', function () {
        login_box.style.display = 'none'
        reg_box.style.display = 'block'
    })
    link_login.addEventListener('click', function () {
        login_box.style.display = 'block'
        reg_box.style.display = 'none'
    })
    // 密码预验证功能
    // 获取form对象
    var form = layui.form
    // 用form.verify方法自定义注册密码验证规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value, item) {
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次输入密码不一致'
            }
        }
    })
    // 获取layer对象
    var layer = layui.layer
    // 注册提交功能
    $('#form_reg').on('submit', function (e) {
        e.preventDefault()
        var data = {
            username: $('.reg-box [name=username]').val(),
            password: $('.reg-box [name=password]').val()
        }
        $.post('/api/reguser', data, function (res) {
            if (res.status != 0) {
                return layer.msg(res.message, {
                    icon: 5
                })
            }
            layer.msg('注册成功,请登录', {
                icon: 6
            })
            // 自动跳转回登录
            link_login.click()
        })
    })
    // 登录功能
    $('#form_login').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: $(this).serialize(), // serialize快速获取表单中的所有数据
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                // 把token存储到本地存储中
                localStorage.setItem('token', res.token)
                // 页面跳转到index.html
                location.href = '/index.html'
            }
        })
    })
})