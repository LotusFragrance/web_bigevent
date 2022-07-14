$(function () {
    const form = layui.form;
    const layer = layui.layer;
    form.verify({
        nickname: [/^[\S]{1,6}$/, '昵称长度必须1~6位']
    })
    initUserinfo();
    //初始化用户信息
    function initUserinfo() {
        $.ajax({
            type: 'GET',
            url: '/my/userinfo',
            success: res => {
                if (res.status !== 0) return layer.msg('获取用户信息失败！', { icon: 5 });
                form.val('userInfo', res.data);
            }
        })
    }
    //注册重置按钮事件
    $('#btnReset').on('click', e => {
        //阻止表单的默认行为
        e.preventDefault();
        //重新调用initUserinfo();
        initUserinfo();
    })
    //注册更新表单事件
    $('.layui-form').on('submit', e => {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: $('.layui-form').serialize(),
            success: res => {
                if (res.status !== 0) return layer.msg('更新用户信息失败！', { icon: 5 });
                layer.msg('更新用户信息成功！', { icon: 6 });
                //更新父页面的用户名和图像
                window.parent.userMessage();
            }
        })
    })
    
})

