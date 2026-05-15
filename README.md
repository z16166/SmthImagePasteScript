# SmthImagePasteScript
Tampermonkey script to use Ctrl + V to paste image from clipboard when posting on SMTH web BBS.

适合桌面电脑版浏览器的油猴脚本，用于在水木清华BBS发帖子时自动上传剪贴板里的图片，省去将图片落地为磁盘文件再上传的步骤。

在水木清华BBS(https://www.newsmth.net)发新帖、回复帖子、编辑帖子时，在文本编辑区按ctrl + v，自动把剪贴板里的图片存为临时的内存文件上传。
    
这样贴图就方便了：截图软件截图 -> 保存到剪贴板 -> ctrl + v贴图。不用落地为磁盘文件。

因为水木清华有严格的文字审查，文本内容很容易被拒绝，需要发图片。

在Tampermonkey里测试通过。
先在Chrome浏览器里安装Tampermonkey插件，然后打开Tampermonkey的设置界面，点击加号新建脚本，然后把smth_paste.2.1.user.js的内容复制粘贴进去后，ctrl + s保存即可。