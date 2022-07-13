$.ajaxPrefilter(options => {
    //统一拼接路径
    options.url = 'http://www.liulongbin.top:3007' + options.url;
    //统一为有权限的接口设置headers
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    //complete
    options.complete = res => {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            localStorage.removeItem('token');
            location.href = './login.html';
        }
    }
})