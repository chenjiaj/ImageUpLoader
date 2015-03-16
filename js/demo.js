/**
 * Created with JetBrains PhpStorm.
 * Desc:
 * Author: chenjiajun
 * Date: 15-3-10
 * Time: 下午2:40
 */
(function(){
    var demo = {
        init:function(){
            this.createImgUpLoader();
            this.setSortable();
        },
        createImgUpLoader:function(){
            this.imgUpLoader  = new ImgUpLoader({
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
                $thumbWidth:100,
                $thumbHeight:100,
                $fileNumLimit:300,
                $fileSizeLimit:500000000000090
            });
        },
        setSortable:function(){
            var end,start;
            var fixHelper = function(e, ui) {
                //console.log(ui)
                ui.children().each(function() {
                    $(this).width($(this).width());		//在拖动时，拖动行的cell（单元格）宽度会发生改变。在这里做了处理就没问题了
                });
                return ui;
            };
            $( "#fileList tbody").sortable({
                helper: fixHelper,					//调用fixHelper
                axis:"y",
                items:'tr:not(:has(th))',           //禁止标题拖拽
                handle:'td:not(".delete")',
                start:function(e, ui){
                    start = ui.item.index();
                    ui.helper.css({"background":"#fff"})     //拖动时的行，要用ui.helper
                    return ui;
                },
                stop:function(e, ui){
                    //ui.item.removeClass("ui-state-highlight"); //释放鼠标时，要用ui.item才是释放的行
                    end = ui.item.index();
                    var id = ui.item.attr('id');
                    var data = {
                        id : id,
                        newSque:end
                    };
                    if(end != start){
                        $.post('',data,function(res){
                            var result = 0;
                            if(result == 0){

                            }
                        },'json');
                        Tip('修改图片展示顺序成功','success',1000);
                        if(end > start){
                            for(var i = start;i<=end;i++){
                                $( "#fileList tbody tr").eq(i).find('.j_sort').text(i);
                            };
                        }else{
                            for(var i = end;i<=start;i++){
                                $( "#fileList tbody tr").eq(i).find('.j_sort').text(i);
                            };
                        }
                    }
                    return ui;
                }
            }).disableSelection();
        }
    }
    demo.init();
})();