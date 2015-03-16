# ImageUpLoader
图片上传demo,使用webuploader和jquery-ui-sortable 插件
##拖拽效果使用的插件    
<script type="text/javascript" src="js/jquery.ui.core.js"></script>
<script type="text/javascript" src="js/jquery.ui.widget.js"></script>
<script type="text/javascript" src="js/jquery.ui.mouse.js"></script>
<script type="text/javascript" src="js/jquery.ui.sortable.js"></script>
##上传文件或图片需要的插件
<script type="text/javascript" src="js/webuploader.js"></script>
##
html文档
<code>
<div class="image-wrapper">
    <div id="imageUpLoader">
        <!--用来存放item-->
        <div id="dndArea">
            <ul id="queueList" class="uploader-list">
            </ul>
            <div class="placeholder">
                <div id="filePicker"></div>
                <p>或将照片拖到这里，单次最多可选300张</p>
            </div>
        </div>

        <div class="statusBar">
           <!-- <div class="progress" style="display: none">
                <span class="text">0%</span>
                <span class="percentage"></span>
            </div>-->
            <div class="info"></div>
            <div class="btns">
                <div id="filePicker2"></div>
                <div class="uploadBtn state-ready">开始上传</div>
            </div>
        </div>
    </div>

    <table id="fileList" class="tableStyle">
        <tr>
            <th><label><input type="checkbox" name="check">全选</label></th>
            <th>图片</th>
            <th>图片名称</th>
            <th>图片大小</th>
            <th>图片位置</th>
            <th>操作</th>
        </tr>
    </table>
</div>
</code>
##
修改样式更改imageuploader.less
##
详细使用参见demo.js
