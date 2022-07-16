$(function () {
    //第二行 定义一个模板引擎
    $.ajax({
        type: 'GET',
        url: '/my/article/cates',
        success: res => {
            if (res.status !== 0) return layui.layer.msg('获取文章分类失败！')
            let htmlStr = template('tpl-option', res)
            $('[name="cate_id"]').html(htmlStr)
            layui.form.render()
        }
    })
    // 初始化富文本编辑器
    initEditor()
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)
    //给选择封面注册事件
    $('#btn_chooseimage').on('click', function () {
        $('#coverFile').click()
    })

    //监听coverFile 的change事件
    $('#coverFile').on('change', function (e) {
        // 拿到用户选择的文件
        var files = e.target.files
        if (files.length === 0) return
        //根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        //先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    //注册发布事件
    let pub_state = '已发布'
    $('.btn_save').on('click', function () {
        pub_state = '草稿'
    })
    $('#form_pub').on('submit', function (e) {
        e.preventDefault()
        let fd = new FormData($(this)[0])
        fd.append('state', pub_state)
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                //发起ajax请求
                pubArt(fd)
            })
    })

    //封装一个发布文章的方法
    function pubArt(fd) {
        $.ajax({
            type: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: res => {
                if (res.status !== 0) return layui.layer.msg('发布文章失败!')
                layui.layer.msg('发布文章成功!')
                location.href = './art_list.html'
            }
        })
    }
})