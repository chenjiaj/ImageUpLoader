/**
 * Created with JetBrains PhpStorm.
 * Desc:
 * Author: chenjiajun
 * Date: 15-3-10
 * Time: 下午2:40
 */
var ImgUpLoader;
(function(){
    function ImageUpLoader(opt){
        this.opts = $.extend({
            $fileList:$('#fileList'),//上传后文件显示列表
            $queueList:$('#queueList'),//上传文件队列
            $dndArea:$('#dndArea'),//拖拽区域
            $placeholder:$('#imageUpLoader .placeholder'),
            $dndAreaid:'#imageUpLoader #dndArea',//拖拽ID
            $pickId:'#filePicker',
            $picker2:$('#filePicker2'),
            $upLoadBtn:$('#imageUpLoader .uploadBtn'),
            $picker2Id:'#filePicker2',
            $statusBar:$('#imageUpLoader .statusBar'),//状态条
            $thumbWidth:200,
            $thumbHeight:200,
            $fileNumLimit:20,
            $fileSizeLimit:33333
        },opt);
        this.fileCount = 0;
        this.fileSize = 0;
        this.succFile = 0;
        this.upSize = 0;
        this.erroFile = 0;
        this.QueList = {};
        this.init();
    }

    ImageUpLoader.prototype = {
        init:function(){
            this.createUpLoader();
            this.toggleShow();
            this.bindEvent();
        },
        bindEvent:function(){
            var _this = this;
            _this.opts.$queueList.on('click','.operate span',function(){
                _this.operate($(this));
            });

            _this.opts.$fileList.on('click','.j_show_big_img',function(){
                _this.creatBigImg($(this));
            });
        },
        creatBigImg:function(self){
            var _this = this;
            var file = self.closest('tr');
            this.index = self.closest('tr').index();//若用var index在click绑定的闭包里边会有问题，闭包里边的index始终是上一次执行的值，不是同一个index
            if(!this.dialog){
                this.dialog = $('<div class="dialog">' +
                        '<div class="prev toggle">' +
                            '<span class="icon-left-open"></span>' +
                        '</div>' +
                            '<img/>' +
                        '<div class="next toggle">' +
                            '<span class="icon-right-open"></span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="mask"></div>');
                $('body').append(this.dialog);

                $('.dialog .toggle').click(function(){

                    var the = $(this);
                    var fileId;
                    if(the.hasClass('prev')){
                        if(_this.index>1){
                            _this.index--;
                            fileId = _this.opts.$fileList.find('tr').eq(_this.index).attr('id');
                            _this.onmakeThumb(fileId);
                        }
                    }else{
                        if(_this.index < _this.opts.$fileList.find('tr').length-1){
                            _this.index++;
                            fileId = _this.opts.$fileList.find('tr').eq(_this.index).attr('id');
                            _this.onmakeThumb(fileId);
                        }
                    }
                });

                $('.mask').click(function(){
                    _this.dialog.hide();
                });

            }
            this.dialog.show();
            this.onmakeThumb(file.attr('id'));
        },
        onmakeThumb:function(file){
            var _this = this;
            this.uploader.makeThumb( file, function( error, src ) {
                if ( error ) {
                    _this.dialog.find('img').replaceWith('<span>不能预览</span>');
                    return;
                }
                _this.dialog.find('img').attr('src',src);
            },600, 400);
        },
        toggleShow:function(){
            if(this.opts.$queueList.find('li').length > 0){
                this.opts.$placeholder.hide();
                this.opts.$picker2.css('visibility','visible');
                this.opts.$statusBar.css('visibility','visible');
            }else{
                this.opts.$placeholder.show();
                this.opts.$statusBar.css('visibility','hidden');
            }
        },
        setUpLoadBtn:function(){//上传文件按钮点击触发函数
            var status = this.opts.$upLoadBtn.attr('data-status');
            if(!status){
                this.opts.$upLoadBtn.attr('data-status','ready');
                status = 'ready';
            }
            switch (status){
                case 'ready':
                    this.uploader.upload();
                    this.opts.$upLoadBtn.text('暂停上传');
                    this.opts.$upLoadBtn.attr('data-status','pase');
                    this.opts.$picker2.css('visibility','hidden');
                    break;
                case 'pase':
                    this.setInfo('pase');
                    this.opts.$upLoadBtn.text('继续上传');
                    this.opts.$upLoadBtn.attr('data-status','ready');
                    this.uploader.stop();
                    break;
                case 'start':
                    this.opts.$upLoadBtn.text('开始上传');
                    this.opts.$upLoadBtn.attr('data-status','ready');
            }
        },
        createUpLoader:function(){//创建上传组件
            if ( !WebUploader.Uploader.support() ) {
                alert( 'Web Uploader 不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器');
                throw new Error( 'WebUploader does not support the browser you are using.' );
            }

            this.uploader =WebUploader.create({
                pick:{
                    id: this.opts.$pickId,
                    label: '点击选择图片'
                },
                paste: document.body,
                auto: false,// 选完文件后，是否自动上传。
                swf: 'Uploader.swf', // swf文件路径
                disableGlobalDnd: true,
                dnd: this.opts.$dndAreaid,
                server: 'http://localhost/fileUpLoader/controller/fileupload.php',// 文件接收服务端。
                accept: {  // 只允许选择图片文件。
                    title: 'Images',
                    extensions: 'gif,jpg,jpeg,bmp,png',
                    mimeTypes: 'image/*'
                },
                thumb: {
                    allowMagnify: true,
                    crop: true
                },
                fileNumLimit:this.opts.$fileNumLimit,
                fileSizeLimit:this.opts.$fileSizeLimit,
                compress:{
                    width: 1600,
                    height: 1600,

                    // 图片质量，只有type为`image/jpeg`的时候才有效。
                    quality: 100,

                    // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
                    allowMagnify: false,

                    // 是否允许裁剪。
                    crop: false,

                    // 是否保留头部meta信息。
                    preserveHeaders: true,

                    // 如果发现压缩后文件大小比原来还大，则使用原来图片
                    // 此属性可能会影响图片自动纠正功能
                    noCompressIfLarger: false,

                    // 单位字节，如果图片大小小于此值，不会采用压缩。
                    compressSize: 0
                } //是否压缩
            });

            this.uploaderBindEvent();
        },
        uploaderBindEvent:function(){//为组件绑定事件
            var _this = this;

            // 当有文件被添加进队列的时候
            this.uploader.on( 'fileQueued', function( file ) {
                _this.onFileQueued(file);
            });

            // 添加“添加文件”的按钮，按钮高度设置存在问题，必须存在高度，否则为0，因此隐藏时不能用display只能用visibility
            this.uploader.addButton({
                id: _this.opts.$picker2Id,
                label: '继续添加'
            });

            //文件上传
            _this.opts.$upLoadBtn.click(function(){
                if(!_this.opts.$upLoadBtn.hasClass('disabled')){
                    _this.setUpLoadBtn();
                }
            });

            // 文件上传过程中创建进度条实时显示。
            this.uploader.on( 'uploadProgress', function( file, percentage ) {
                var $li = $( '#'+file.id ),
                    $percent = $li.find('.progress span');

                // 避免重复创建
                if ( !$percent.length ) {
                    $percent = $('<p class="progress"><span></span></p>')
                        .appendTo( $li )
                        .find('span');
                }
                $percent.css( 'width', percentage * 100 + '%' );
            });

            // 文件上传成功，给item添加成功class, 用样式标记上传成功。
            this.uploader.on( 'uploadSuccess', function( file ) {
                _this.onUpLoadSuccess(file);
            });

            // 文件上传失败，显示上传出错。
            this.uploader.on( 'uploadError', function( file ) {
                _this.erroFile++;
                $( '#'+file.id).find('.info').text('上传失败');
            });

            // 完成上传完了，成功或者失败，先删除进度条。
            this.uploader.on( 'uploadComplete', function( file ) {
                $( '#'+file.id ).find('.progress').remove();
            });

            this.uploader.on('error',function(e){//添加文件时保存信息
                switch (e){
                    case 'Q_TYPE_DENIED':
                        Tip('文件类型有误，只支持格式为gif,jpg,jpeg,bmp,png的图片','error',2000);
                        break;
                    case 'Q_EXCEED_NUM_LIMIT':
                        Tip('最多可上传'+_this.opts.$fileNumLimit+'个文件','error',2000);
                        break;
                    case 'Q_EXCEED_SIZE_LIMIT':
                        Tip('文件总大小不能超过'+WebUploader.formatSize(_this.opts.$fileSizeLimit),'error',2000);
                        break;
                }
            });

            this.uploader.on('uploadFinished',function(){
                _this.setInfo('allComplete');
                _this.resetFileData();
                _this.toggleShow();
                _this.opts.$upLoadBtn.attr('data-status','start');
                _this.setUpLoadBtn();
            });

            $('.retry').on('retry',function(){
                _this.uploader.retry();
            });

        },
        resetFileData:function(){
            this.fileCount = 0;
            this.fileSize = 0;
            this.succFile = 0;
            this.upSize = 0;
            this.erroFile = 0;
        },
        onFileQueued:function(file){//添加到队列时触发函数
            var _this = this;
                this.QueList[file.id] = {
                    size:file.size,
                    name:file.name,
                    rotation:0
                };
            var $li = $(
                    '<li id="' + file.id + '" class="file-item thumbnail">' +
                        '<img>' +
                        '<p class="thumb"></p>' +
                        '<div class="info">'+file.name+'</div>' +
                        '</li>'
                ),
                $img = $li.find('img');

            // $fileList为容器jQuery实例
            _this.opts.$queueList.append($li);
            //显示图形操作和删除

            var $btn = '<div class="operate">' +
                '<span class="icon-ccw" data-mark="ccw"></span>' +
                ' <span class="icon-cw" data-mark="cw"></span>' +
                '<span class="icon-trash" data-mark="trash"></span>' +
                '</div>';

            $($btn).appendTo($li).hide();

            $li.on( 'mouseenter', function() {
                $(this).find('.operate').stop().slideDown(300);
            });

            $li.on( 'mouseleave', function() {
                $(this).find('.operate').stop().slideUp(300);
            });

            file.rotation = 0;


            // 创建缩略图
            // 如果为非图片文件，可以不用调用此方法。
            // thumbnailWidth x thumbnailHeight 为 100 x 100
            $li.find('.thumb').text('预览中');
            _this.uploader.makeThumb( file, function( error, src ) {
                if ( error ) {
                    $img.replaceWith('<span>不能预览</span>');
                    return;
                }
                $li.find('.thumb').remove();
                $img.attr( 'src', src );
            }, _this.opts.$thumbWidth, _this.opts.$thumbHeight );


            _this.fileCount++;
            _this.fileSize += file.size;

            this.toggleShow();
            this.setInfo('ready');
        },
        onUpLoadSuccess:function(file){
            this.succFile++;
            this.upSize += file.size;
            this.setInfo('upsucc');
            $( '#'+file.id).remove();
            var _this = this;
            this.uploader.makeThumb( file, function( error, src ) {
                if ( error ) {
                    var img = '不能预览';
                    return;
                }
                var img = '<img src = '+src+' title="点击查看大图" class="j_show_big_img">';
                var tr = '<tr class="ui-state-default" id="'+file.id+'">' +
                    '<td><input type="checkbox" name="check"></td>' +
                    '<td>'+img+'</td>' +
                    '<td>'+file.name+'</td>' +
                    '<td>'+WebUploader.formatSize(file.size)+'</td>' +
                    '<td class="j_sort">'+_this.opts.$fileList.find('tr').length+'</td>' +
                    '<td class="delete"><a href="#">删除</a></td>' +
                    '</tr>';
                _this.opts.$fileList.find('tr:last').after(tr);
            }, this.opts.$thumbWidth, this.opts.$thumbHeight );

        },
        operate:function(the){//操作旋转和删除按钮时触发函数
            var li = the.closest('li');
            var file = this.uploader.getFile(li.attr('id'));
            var item = this.QueList[li.attr('id')];
            var supportTransition = (function(){
                var s = document.createElement('p').style,
                    r = 'transition' in s ||
                        'WebkitTransition' in s ||
                        'MozTransition' in s ||
                        'msTransition' in s ||
                        'OTransition' in s;
                s = null;
                return r;
            })();

            switch (the.attr('data-mark')){
                case 'ccw':
                    file.rotation -=90;
                    break;
                case 'cw':
                    file.rotation +=90;
                    break;
                case 'trash':
                    this.uploader.removeFile(file);
                    this.fileCount --;
                    this.fileSize -= item.size;
                    delete this.QueList[file.id];
                    $('#'+file.id).remove();
            }

            if (supportTransition) {
                var deg = 'rotate(' + file.rotation + 'deg)';
                the.closest('.file-item').find('img').css({
                    '-webkit-transform': deg,
                    '-mos-transform': deg,
                    '-o-transform': deg,
                    'transform': deg
                });
            } else {
                the.closest('.file-item').find('img').css( 'filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation='+ (~~((file.rotation/90)%4 + 4)%4) +')');
            }
        },
        setInfo:function(status){//设置左下角信息显示
            switch (status){
                case 'ready':
                    var text = '共选中'+this.fileCount+'张图片，共'+WebUploader.formatSize(this.fileSize);
                    this.opts.$statusBar.find('.info').html(text);
                    break;
                case 'upsucc':
                    var text = '共'+this.fileCount+'张图片('+WebUploader.formatSize(this.fileSize)+')，已上传'+
                                this.succFile+'('+WebUploader.formatSize(this.upSize)+')';
                    this.opts.$statusBar.find('.info').html(text);
                    break;
                case 'allComplete':
                    if(this.erroFile>0){
                        var text = '成功上传'+this.succFile+'张图片(共'+WebUploader.formatSize(this.upSize)+'),' +
                            '有'+this.erroFile+'上传失败,<a href="#" class="retry">重新上传</a>';
                    }else{
                        var text = '成功上传'+this.succFile+'张图片(共'+WebUploader.formatSize(this.upSize)+')';
                    }
                    this.opts.$statusBar.find('.info').html(text);
                    break;
                case 'pase':
                    var text = '已暂停';
                    this.opts.$statusBar.find('.info').html(text);
                    break;
            }
        }
    }
    ImgUpLoader = ImageUpLoader;
})();