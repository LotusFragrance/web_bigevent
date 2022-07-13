$(function () {
    $('#link_reg').on('click', () => {
        $('.login').hide();
        $('.reg').show();
    })
    $('#link_login').on('click', () => {
        $('.reg').hide();
        $('.login').show();
    })

    //表单验证
    let form = layui.form;
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],
        repwd: value => {
            let pwd = $('.reg [name=password]').val();
            if (value !== pwd) return '两次密码不一致！'
        }
    });

    //监听注册表单的事件
    const layer = layui.layer;
    $('#form_reg').on('submit', e => {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/api/reguser',
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            success: res => {
                if (res.status !== 0) return layer.msg(res.message, { icon: 5 });
                layer.msg(res.message, { icon: 6 });
                $('#link_login').click();
            }
        })
    })
    //监听登录表单的事件
    $('#form_login').on('submit', e => {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: $('#form_login').serialize(),
            success: res => {
                if (res.status !== 0) return layer.msg(res.message + '检查账号或密码是否输入正确', { icon: 5 });
                layer.msg(res.message, { icon: 6 });
                //将登录成功获得的token字符串存到localStorage中
                localStorage.setItem('token', res.token);
                //跳转到后台主页
                location.href = './index.html'
            }
        })
    })
})