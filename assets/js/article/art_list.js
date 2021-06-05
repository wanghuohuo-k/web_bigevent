$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;


    // 定义美化时间的过滤器
    template.defaults.imports.dataFromat = function(date) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;

    }

    // 定义补0的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    // 定义一个查询的参数对象
    // 需要将参数请求对象参数对象提交到服务器
    var q = {
            pagenum: 1, //默认请求第一页的数据
            pagesize: 3, //默认每页显示2条数据
            cate_id: '', //文章分类的id
            state: '' //文章的发布状态
        }
        // 获取文章数据的方法
    initTable()
    initCate();

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {

                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')

                }
                // console.log(res);
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)

                $('tbody').html(htmlStr)
                    // 调用渲染分页的方法
                renderPage(res.total)
                    // console.log(res.total);
            }
        })
    }
    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // layer.msg('获取分类数据成功！')
                // console.log(res);
                //    调用模板引擎渲染分类的模板项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    // 我们动态添加的数据不会被layui所监听到，所以需要先重新渲染
                    // 通知layui重新渲染表单区域的UI结构
                form.render()
            }


        })
    }
    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
            e.preventDefault()
                // 获取表单中选中项的值
            var cate_id = $('[name=cate_id]').val()
            var state = $('[name=state]').val()
                // 为查询对象 q 中对应的属性赋值
            q.cate_id = cate_id
            q.state = state
                // 根据最新的筛选条件。重新渲染表格的数据
            initTable()
        })
        // 定义渲染分页的方法
    function renderPage(total) {
        // 调用 laypage.render()方法渲染分页结构
        laypage.render({
            elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
                ,
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //指定默认选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发jump回调
            // 触发jump回调的方式有两种
            // 1.点击页码的时候会触发jump回调
            // 2.只要调用了laypage.render()方法，就会触发jump回调
            jump: function(obj, first) {
                // console.log(obj.curr);
                q.pagenum = obj.curr;
                // 把最新的条目数，赋值到q这个查询对象的pagesize的属性
                q.pagesize = obj.limit
                    // console.log(first);
                    // 根据最新的q回去对应的数据列表。并渲染表格
                    // initTable()
                    // 使用first必须是使用laypage.render()方法，触发jump回调
                    // 可以通过first判断那种方式触发的jump回调
                    // 如果first的值为true，证明是方式2触发，否则就是方式一触发
                if (!first) {
                    //do something
                    initTable()
                }
            }
        });


    }
    // 通过代理的形式，为删除按钮绑定的点击事件处理函数
    $('tbody').on('click', '.btn-delete', function() {
        // 获取当前页面删除按钮的个数
        var len = $('.btn-delete').length
        console.log(len);
        var id = $(this).attr('data-Id');
        //e询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            // 只要调用这个接口并且传进去那个参数，就会使得接口中的那个数据删除
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败');
                    }
                    layer.msg('删除文章成功');
                    // 当数据删除完成后需要判断这一页中是否还有剩余的数据，如果没有剩余的数据，就让当前的页码值减一
                    if (len == 1) {
                        // 如果len的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                    layer.close(index);
                }
            })


        });
    })

})