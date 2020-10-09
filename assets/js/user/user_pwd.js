$(function() {
    // 密码校验
    var form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samepwd: function(value) {
            var oldpwd = $('[name=oldPwd]').val();
            if (value === oldpwd) {
                return '新旧密码不能相同'
            }
        },
        repwd: function(value) {
            var newpwd = $('[name=newPwd]').val();
            if (value !== newpwd) {
                return '两次密码输入不一致'

            }
        }
    });
    // 修改密码
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg('修改成功');
                $('.layui-form')[0].reset();
            }
        })
    })
})