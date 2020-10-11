$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义时间过滤器
    template.defaults.imports.dateFormat = function(dtStr) {
            var dt = new Date(dtStr)
            var y = dt.getFullYear();
            var m = padzero(dt.getMonth() + 1);
            var d = padzero(dt.getDate());
            var hh = padzero(dt.getHours());
            var mm = padzero(dt.getMinutes());
            var ss = padzero(dt.getSeconds());
            return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
        }
        // 补0函数
    function padzero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义查询参数
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示几条数据
        cate_id: '', //文章分类的id
        state: '' //文章的发布状态
    }
    initTable();
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var str = template('tpl-table', res)
                $('tbody').html(str);
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类的方法
    initCate();

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlstr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlstr);
                form.render();
            }
        })
    }

    // 筛选功能
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        var state = $('[name=state]').val();
        var cate_id = $('[name=cate_id]').val();
        q.state = state;
        q.cate_id = cate_id;
        initTable();
    })

    // 分页功能
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //在哪里显示
            count: total, //数据总数
            limit: q.pagesize, //每页几条
            curr: q.pagenum, //显示页数
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function(obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initTable();
                }
            }
        });
    }


    // 删除功能
    $('tbody').on('click', '#btn-delete', function() {
        var Id = $(this).attr('data-id');
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + Id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    if ($('#btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;
                    initTable();
                    layer.msg('文章删除成功')
                    layer.close(index);

                }
            })
        });
    })
})