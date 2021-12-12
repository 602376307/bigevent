$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    // 定义 一个查询参数q
    var q = {
        pagenum: 1, // 默认显示第一页
        pagesize: 2, // 默认显示每页两条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章发布状态
    }
    // 用模板引擎的过滤器定义时间美化函数
    template.defaults.imports.dateFormat = function (date) {
        var dt = new Date(date)
        var y = padZero(dt.getFullYear())
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var h = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var s = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s
    }
    // 定义 一个时间补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 定义 获取文章列表函数
    function initTable() {
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('获取文章列表失败')
                }
                console.log(res);
                // 利用模板引擎渲染数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用渲染分页方法 并传入文章总数
                renderpage(res.total)
            }
        })
    }
    initTable()
    // 初始化分类筛选框功能，使用模板引擎动态添加
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('获取文章分类数据失败')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    initCate()
    // 监听筛选区域的提交事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        q.cate_id = $('[name=cate_id]').val()
        q.state = $('[name=state]').val()
        initTable()
    })
    // 定义渲染分页方法
    function renderpage(total) {
        laypage.render({
            elem: 'pageBox',
            count: 5,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], // 自定义排版
            limits: [2, 5, 10, 15, 20], // 每页条数的选择项
            // jump回调 ，调用了laypage.render()或者点击页码时都会触发
            jump: function (obj, first) {
                q.pagenum = obj.curr // 当前页
                q.pagesize = obj.limit // 每页显示的条数
                if (!first) { // first是布尔值，随调用方式改变，当调用了laypage.render()时是true
                    //do something
                    initTable()
                }

            }
        })

    }
    // 删除功能
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        layer.confirm('确认删除吗?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            $.ajax({
                type: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status != 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    // 重新渲染一下
                    initTable()
                }
            })
            layer.close(index);
        });
    })
})