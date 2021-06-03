$(function() {
    // 调用getUserInfo获取用户信息
    getUserInfo()
    var layer = layui.layer;
    // 点击按钮实现退出功能
    $('#btnLoginout').on('click', function() {
        // 提示用户是否确认退出
        layer.confirm('确认退出登录?', { icon: 3, title: '提示' }, function(index) {
            //do something
            // 1.清空本地存储的token
            localStorage.removeItem('token')
                // 2.重新跳转到登陆页面
            location.href = '/login.html'

            // 关系confirm询问框
            layer.close(index);
        });
    })
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // header是请求头配置的对象,因为我们的请求是有权限的，所以需要加上一个header
        // headers: {
        //     // || ''表示如果没有token就是一个空字符串
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg("获取用户信息失败");
            }
            // 调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data)
        },
        // 成功调用success失败调用error，不管成功还是失败都会调用complete
        complete: function(res) {
            // console.log("执行了complate回调");
            // console.log(res);
            // 在complate回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                // 1.强制清空token
                localStorage.removeItem('token');
                // 2.强制跳转到登陆页面
                location.href = '/login.html';
            }

        }
    })
}

// 渲染用户的头像
function renderAvatar(user) {
    // 1.获取名称，如果有nickname就使用nickname没有的话就使用username
    var name = user.nickname || user.username;
    // 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp' + name);
    // 3.按需渲染用户的头像
    if (user.user_pic !== null) {
        // 3.1渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 3.2 渲染文本头像
        $('.layui-nav-img').hide()
            // 得到字符串的第一个字符，可以把字符串当作一个数组
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}