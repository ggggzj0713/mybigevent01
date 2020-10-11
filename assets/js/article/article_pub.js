$(function() {
    var form = layui.form;
    var layer = layui.layer;
    // 获取所有文章分类函数
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
    // 初始化富文本编辑器
    initEditor();

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 选择封面
    $('#btnChooseImage').on('click', function() {
        $("#coverFile").click();
    });

    $("#coverFile").on('change', function(e) {
        var file = e.target.files[0];
        if (file == undefined) {
            return layer.msg('请选择文件')
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(file)
            // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    })

    // 设置状态
    var state = '已发布';
    $('#btnsave2').on('click', function() {
        state = '草稿';
    });
    // 文章添加
    $('#form-pub').on('submit', function(e) {
        e.preventDefault();
        var fd = new FormData(this);
        fd.append('state', state);
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob);
                console.log(...fd);
                // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })
    });


    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('发布文章成功');
                // location.href = '/article/article_list.html'
                setTimeout(function() {
                    window.parent.document.getElementById('art_list').click();
                }, 1500)
            }
        })
    }
})