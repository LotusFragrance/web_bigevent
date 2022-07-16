$(function () {
    //定义一个查询的参数对象
    let q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }
    //时间补零的函数
    function padZero(n) {
        if (n < 10) {
            return '0' + n
        } else {
            return n
        }
    }
    // 定义格式化时间的过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        var dt = new Date(dtStr)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    initTable();
    initCate()
    //获取文章列表
    function initTable() {
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: q,
            success: res => {
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章列表失败!')
                }
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                //渲染分页内容
                renderPage(res.total)
            }
        })

    }
    //渲染选择分类筛选部分
    function initCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: res => {
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章分类列表失败！')
                }
                let htmlStr = template('tpl-option', res)
                $('[name="cate_id"]').html(htmlStr)
                //layui重新渲染
                layui.form.render()
            }
        })
    }
    //给筛选部分表单注册事件
    $('#form_choose').on('submit', function (e) {
        e.preventDefault()
        let cate_id = $('[name="cate_id"]').val()
        let state = $('[name="state"]').val()
        q.cate_id = cate_id
        q.state = state
        initTable();
    })

    const laypage = layui.laypage
    //封装一个渲染分页内容的函数
    function renderPage(total) {
        laypage.render({
            elem: page,
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            limits: [2, 3, 4, 5, 6],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: (obj, first) => {
                q.pagesize = obj.limit
                q.pagenum = obj.curr
                if (!first) {
                    initTable()
                }
            }
        })
    }

    //注册删除文章的事件
    $('tbody').on('click', '.btn_delete', function () {
        let num_btndelete = $('.btn_delete').length
        let id = $(this).attr('data-id')
        layer.confirm('确认删除?', function (index) {
            $.ajax({
                type: 'GET',
                url: '/my/article/delete/' + id,
                success: res => {
                    if (res.status !== 0) return layui.layer.msg('删除失败!')
                    layui.layer.msg('删除成功!')
                    if (num_btndelete === 1) {
                        //让页码值减1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })
})