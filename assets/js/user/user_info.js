$(function() {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
            nickname: function(value) {
                if (value < 6) {
                    return '昵称长度必须在1~6个字符之间'
                }
            }
        })
        // 初始化用户的信息
    initUserInfo();

    // 将这个函数放到初始函数的外边，内部函数调用不了form和layer
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                // console.log(res);
                // 调用 form.val() 快速为表单赋值
                // 给那个表单赋值就给那个表单加上filter属性
                form.val('formUserInfo', res.data);
            }
        })
    }

    // 监听表单的提交事件
    $('.layui-form').on('submit', function(e) {
            // 阻止表单的默认提交行为
            e.preventDefault();
            // 发起ajax数据请求
            $.ajax({
                method: 'POST',
                url: '/my/userinfo',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('更新用户信息失败');
                    }
                    layer.msg('更新用户名称成功');
                    // iframe在index页面中，是index的子页面
                    // 调用子页面中父页面的方法，重新渲染用户的头像和信息
                    window.parent.getUserInfo()
                }
            })
        })
        // 重置表单的数据
    $('#btnReset').on('click', function(e) {
        // 阻止表单的默认重置行为
        e.preventDefault();
        // 表单重置就是将其返回到上一个未更改前的样子，就是刚从ajax中获取的
        initUserInfo();

    })

})