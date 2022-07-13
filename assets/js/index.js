$(function () {
    userMessage();
    //点击退出登录
    $('#rem_login').on('click', () => {
        layer.confirm('是否退出登录？', { icon: 3, title: '提示' }, function (index) {
            localStorage.removeItem('token');
            location.href = './login.html';
            layer.close(index);
        });
    })

})
const layer = layui.layer;
//封装一个函数，获取用户的信息
function userMessage() {
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: res => {
            if (res.status !== 0) return layer.msg('获取用户信息失败！');
            //调用函数
            renderAvatar(res.data);
        },
        /* complete: res => {
            console.log(res);
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                localStorage.removeItem('token');
                location.href = './login.html';
            }
        } */
    })
}

//封装一个函数，用来渲染用户的图像和用户名
function renderAvatar(msg) {
    //用户没用昵称就用它的登录用户名
    let name = msg.nickname || msg.username;
    $('#welcome').html(`欢迎&nbsp;&nbsp;${name}`);
    //渲染图像
    if (msg.user_pic !== null) {
        $('.layui-nav-img').attr('src', msg.user_pic).show();
        $('.text-avatar').hide();
    } else {
        //让第一个首字母大写
        let first = name[0].toUpperCase();
        $('.layui-nav-img').hide();
        $('.text-avatar').html(first).show();
    }
}