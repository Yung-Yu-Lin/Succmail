//關於succmail的scrollTop 共用這個animateScroll.js
$(window).load(function () {
    $('html,body').scrollTop($('.title').offset().top - 160);
});

// 聯絡succmail & 安全網路服務 的scrollTop 各自寫在自己的.cshtml