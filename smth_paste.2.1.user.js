// ==UserScript==
// @name         水木社区发帖 Ctrl+V 贴图自动上传 (完美适配发帖/回复/编辑)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  无视前端路由(pjax)加载延迟，完美兼容发帖、回复、编辑三大场景的剪贴板自动传图
// @author       You
// @match        *://www.newsmth.net/nForum/*
// @match        *://*.mysmth.net/nForum/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log("【水木贴图助手】脚本已注入！正在全局静默监听...");

    let lastPasteTime = 0;
    let lastPasteSize = 0;

    // 直接监听整个 document 的 paste 事件
    document.addEventListener('paste', function(e) {
        // 【关键判断】：如果触发粘贴的元素不是发帖输入框，就无视它，当作没发生
        if (!e.target || e.target.id !== 'post_content') {
            return;
        }

        console.log("【水木贴图助手】💥 精准捕获到发帖框内的粘贴(paste)事件！");

        const clipboardData = e.clipboardData || window.clipboardData;
        if (!clipboardData) return;

        const items = clipboardData.items;
        let foundImage = false;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            if (item.kind === 'file' && item.type.indexOf('image/') !== -1) {
                foundImage = true;
                const blob = item.getAsFile();
                if (!blob) continue;

                e.preventDefault(); // 拦截默认行为

                const currentTime = new Date().getTime();
                // 1秒防手抖去重
                if (currentTime - lastPasteTime < 1000 && blob.size === lastPasteSize) {
                    console.log("【水木贴图助手】拦截到重复手抖操作，已去重。");
                    return;
                }

                lastPasteTime = currentTime;
                lastPasteSize = blob.size;

                console.log(`【水木贴图助手】成功提取剪贴板图片！大小: ${blob.size} 字节`);

                // 寻找上传组件的隐藏 input
                const fileInput = document.querySelector('.plupload input[type="file"]');
                if (fileInput) {
                    const fileName = "paste_image_" + currentTime + ".png";
                    const file = new File([blob], fileName, { type: item.type });

                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    fileInput.files = dataTransfer.files;

                    console.log("【水木贴图助手】图片已移交底层组件，尝试触发上传...");
                    fileInput.dispatchEvent(new Event('change', { bubbles: true }));

                    // 等待 Plupload 读取后点击上传
                    setTimeout(() => {
                        const uploadBtn = document.getElementById('upload_upload');
                        if (uploadBtn) {
                            uploadBtn.click();
                            console.log("【水木贴图助手】🚀 '上传文件'按钮已被自动点击！");
                        } else {
                            console.error("【水木贴图助手】❌ 找不到'上传文件'按钮！");
                        }
                    }, 300);
                } else {
                    console.error("【水木贴图助手】❌ 当前页面未找到底层 plupload 上传组件！");
                }
            }
        }

        if (!foundImage) {
            console.log("【水木贴图助手】剪贴板中无图片。");
        }
    });
})();