$(function () {
    //表单验证
    const form = layui.form;
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        //新旧密码不能一样
        samePwd: value => {
            //先拿到旧密码
            let pwd = $('[name="oldPwd"]').val();
            if (value === pwd) return '不能和原密码相同';
        },
        //对比两次输入的密码是否正确
        user_pwd: value => {
            //先拿到型密码
            let pwd = $('#newPwd').val();
            if (value !== pwd) return '两次输入的密码不一致';
        }
    })

    //注册修改密码的事件
    $('.layui-form').on('submit', e => {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/updatepwd',
            data: $('.layui-form').serialize(),
            success: res => {
                if (res.status !== 0) return layui.layer.msg('修改密码失败！');
                layui.layer.msg('修改密码成功！');
                //重置表单
                $('.layui-form')[0].reset();
            }
        })
    })
})