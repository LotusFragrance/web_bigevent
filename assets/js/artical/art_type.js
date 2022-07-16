$(function () {
    const layer = layui.layer;
    const form = layui.form;
    initartTypelist();
    function initartTypelist() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: res => {
                if (res.status !== 0) return '获取文章列表失败！';
                let htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }
    //注册添加类别事件
    let indexAdd = null;
    $('#addArtlist').on('click', () => {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#addHtml').html()
        });
    })
    //通过代理的形式，给表单注册事件
    $('body').on('submit', '#form_add', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: res => {
                if (res.status !== 0) return layer.msg('新增分类失败！');
                initartTypelist();
                layer.msg('新增分类成功！');
                layer.close(indexAdd);
            }
        })
    })
    //给编辑按钮注册事件
    let indexEdit = null;
    $('tbody').on('click', '#btnEdit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#editHtml').html()
        });
        let id = $(this).attr('data-id');
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + id,
            success: res => {
                if (res.status !== 0) return layer.msg('获取文章信息失败');
                form.val('form-edit', res.data);
            }
        })
    })
    //给修改的表单注册事件
    $('body').on('submit', '#form_edit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: res => {
                if (res.status !== 0) return layer.msg('修改分类信息失败！');
                initartTypelist();
                layer.msg('修改分类信息成功！');
                layer.close(indexEdit);
            }
        })
    })
    //给删除按钮注册事件
    $('tbody').on('click', '#btnDelte', function () {
        let id = $(this).attr('data-id');
        layer.confirm('是否要删除？', { icon: 5, title: '删除文章分类' }, function (index) {
            $.ajax({
                type: 'GET',
                url: '/my/article/deletecate/' + id,
                success: res => {
                    if (res.status !== 0) return layer.msg('删除文章分类失败！');
                    initartTypelist();
                    layer.msg('删除文章分类成功！');
                }
            })
            layer.close(index);
        });

    })
})