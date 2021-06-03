// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
// options 调用ajax传递的对象
$.ajaxPrefilter(function(options) {
        // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
        options.url = 'http://api-breakingnews-web.itheima.net' + options.url

        // 统一为有权限的接口设置headers 请求头
        // header是请求头配置的对象,因为我们的请求是有权限的，所以需要加上一个header
        if (options.url.indexOf('/my/') !== -1) {
            options.headers = {
                // || ''表示如果没有token就是一个空字符串
                Authorization: localStorage.getItem('token') || ''
            }
        }

        // 全局统一挂载 complete 回调函数
        options.complete = function(res) {
            // 成功调用success失败调用error，不管成功还是失败都会调用complete      
            // 在complate回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                // 1.强制清空token
                localStorage.removeItem('token');
                // 2.强制跳转到登陆页面
                location.href = '/login.html';
            }
        }

    })
    // 这样再api修改之后就不用再每次都修改了

//