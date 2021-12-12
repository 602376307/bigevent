$(function () {
    var layer = layui.layer
    var form = layui.form
    // 定义获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('获取文章分类列表失败')
                }
                var htmlStr = template('tpl', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    initArtCateList()
    // 给顶部添加分类按钮绑定事件
    var indexAdd = null
    $('#btnAdd').on('click', function () {
        // 添加分类弹出层
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            // content的内容写到单独一个中 
            content: $('#dialog-add').html() // $('#dialog-add')是整个script标签，要加html()才正确
        });
    })
    // 通过代理的形式为form-add绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        // 先阻止默认提交行为
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('添加分类失败')
                }
                // 重新获取一下数据
                initArtCateList()
                layer.close(indexAdd)
                layer.msg('添加分类成功')
            }
        })
    })
    // 通过代理为页面中的每一项修改按钮btn-edit绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        // 修改分类弹出层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            // content的内容写到单独一个中 
            content: $('#dialog-edit').html()
        })
        // 获得 当前 修改按钮添加的自定义属性的值id，
        var id = $(this).attr('data-id')
        // 知道了id发起请求获取并填充表格数据
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                // 填充数据 form-edit是lay-filter的值
                form.val('form-edit', res.data)
            }
        })
        // 通过代理监听修改分类表单的提交行为
        $('body').on('submit', '#form-edit', function (e) {
            // 先阻止默认提交行为
            e.preventDefault()
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function (res) {
                    if (res.status != 0) {
                        return layer.msg('修改分类失败')
                    }
                    // 重新获取一下数据
                    initArtCateList()
                    layer.close(indexEdit)
                    layer.msg('修改分类成功')
                }
            })
        })
    })
    // 通过代理为每一个删除按钮btn-delete绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        layer.confirm('确认删除吗?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            $.ajax({
                type: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status != 0) {
                        return layer.msg(res.message)
                    }
                    initArtCateList()
                    layer.close(index);
                    layer.msg('删除分类成功')
                }
            })
        });
    })
})