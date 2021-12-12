$(function () {
    var layer = layui.layer
    var form = layui.form

    // 定义加载文章分类方法  下拉选择框
    function initCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('初始化文章分类失败')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 记得调用form.render方法重新渲染数据
                form.render()
            }
        })
    }
    initCate()

    // 初始化富文本编辑器
    initEditor()

    // 初始化图片裁剪器
    var $image = $('#image')
    // 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 初始化裁剪区域
    $image.cropper(options)

    // 为隐藏的封面文件选择按钮 绑定 模拟的点击行为
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })
    $('#coverFile').on('change', function (e) {
        // 获取文件列表数组
        var files = e.target.files
        if (files.length === 0) {
            return layer.msg('请选择文件')
        }
        var newImgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    // 文章发布
    var art_state = '已发布' // 先定义一个变量 ，表示发布状态
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })
    // 为表单绑定submit事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        // 1基于form表单，快速创建一个FormData对象
        var fd = new FormData($(this)[0])
        // 2将文章发布状态添加到其中
        fd.append('state', art_state)
        /* fd.forEach(function (v, k) {
            console.log(k, v);
        }) */ // 演示存储数据的效果
        // 3将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象blob
                // 得到文件对象后，进行后续的操作
                // 4将图片存储至FormDate对象中
                fd.append('cover_img', blob)
            })
        // 发起请求  最佳是以方法形式调用
        publishArticle(fd)
    })
    // 发布文章的ajax请求函数
    function publishArticle(fd) {

        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 如果向服务器提交的是FormDate格式的数据
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('发布文章失败')
                }

                layer.msg('发布文章成功')
                // 跳转回文章列表页面
                location.href = '/article/art_pub.html'
            }
        })

    }
})