SuccApp.service('subjectOpen', function () {
    //點擊主題列表 showSubject
    this.OpenSubjectDetailBlock = function ()
    {
        return {
            "browseContentStyle": { "visibility": "visible", "display": "block" },
            "browseContentClass": "browse-content-div tab_pane active",
            "browseContent_li_css": { "display": "inline-block" },
            "browseContent_li": "browse-content-li tab_list_head_li active",
            "newmessage_li": "new-message-li tab_list_head_li",
            "newMessage_Div": { "display": "none", "visibility": "hidden" },
            "tab_list_content": { "display": "block" },
            "tab_list_body": { "width": "60%", "right": "-60%" },
            "tab_list_body_class": "tab_list_body nopadding",
            "blackpad_css": { "display": "block", "z-index": "998" },
            "body_css": { "background-attachment": "fixed", "overflow-y": "hidden" }
        };
    };

    //點擊新增訊息
    this.ClickNewMsg = function ()
    {
        return {
            "newMessageClass":"new-message-div tab_pane active",
            "newMessage_Div": { "visibility": "visible","display":"block" },
            "newMsg_li_css": { "display": "inline-block", },
            "newmessage_li": "new-message-li tab_list_head_li active",
            "browseContent_li": "browse-content-li tab_list_head_li",
            "browseContentStyle": { "display": "none", "visibility": "hidden" },
            "tab_list_content": { "display": "block" },
            "tab_list_body": { "width": "60%", "right": "-60%" },
            "tab_list_body_class": "tab_list_body nopadding new-message",
            "blackpad_css": { "display": "block", "z-index": "998" },
            "body_css": { "background-attachment": "fixed", "overflow-y": "hidden" }
        }
    };

    //關閉RightSide View
    this.CloseRightSide = function ()
    {
        return {
            "tab_list_body_class": "tab_list_body nopadding",
            "tab_list_content": { "display": "none" },
            "blackpad_css": { "display": "none", "z-index": "-11" },
            "body_css": { "background-attachment": "fixed", "overflow-y": "scroll" }
        }
    };


    //點擊標籤開啟新訊息
    this.newMsgLabel = function ()
    {
        return {
            "browseContentStyle": { "display": "none", "visibility": "visible" },
            "tab_list_body_class": "tab_list_body nopadding new-message",
            "newMessage_Div": { "display": "block","visibility":"visible" },
            "tab_list_content": { "display": "block" },
            "tab_list_body": { "width": "60%", "right": "-60%" },
            "blackpad_css": { "display": "block", "z-index": "998" },
            "body_css": { "background-attachment": "fixed", "overflow-y": "hidden" }
        }
    };

    //點擊標籤開啟詳細頁
    this.SubjDetail = function ()
    {
        return {
            "browseContentStyle": { "display": "block","visibility":"visible" },
            "newMessage_Div": { "display": "none", "visibility": "visible" },
            "tab_list_body_class": "tab_list_body nopadding",
            "tab_list_content": { "display": "block" },
            "tab_list_body": { "width": "60%", "right": "-60%" },
            "blackpad_css": { "display": "block", "z-index": "998" },
            "body_css": { "background-attachment": "fixed", "overflow-y": "hidden" }
        }
    };

    //點擊取消離開新訊息頁面
    this.DeleteNewSubjBlock = function ()
    {
        return {
            "tab_list_body_class": "tab_list_body nopadding",
            "newMsg_li_css": { "display": "none" },
            "newMessage_Div": { "display": "none", "visibility": "hidden" },
            "body_css": { "background-attachment": "fixed", "overflow-y": "scroll" },
            "tab_list_content": { "display": "none" },
            "tab_list_body": { "width": "0" },
            "tab_list_head": { "right": "0" },
            "blackpad_css": { "display": "none", "z-index": "-11" },
            "browseContent_li": "browse-content-li tab_list_head_li active",
            "browseContentStyle": { "visibility": "visible", "display": "block" },
        }
    };

    //點擊關閉主題詳細頁
    this.DeleteSubjDetailBlock = function ()
    {
        return {
            "newMsg_li_css": { "display": "inline-block", },
            "tab_list_body_class": "tab_list_body nopadding new-message",
            "browseContent_li_css": { "display": "none" },
            "browseContentStyle": { "visibility": "hidden", "display": "none" },
            "tab_list_content": { "display": "none" },
            "tab_list_body": { "width": "0" },
            "tab_list_head": { "right": "0" },
            "blackpad_css": { "display": "none", "z-index": "-11" },
            "newMessage_Div": { "display": "block", "visibility": "visible"},
            "browseContent_li": "browse-content-li tab_list_head_li",
            "newmessage_li": "new-message-li tab_list_head_li active",
            "NoNewMessage_body_css": { "background-attachment": "fixed", "overflow-y": "scroll" },
            "body_css": { "background-attachment": "fixed", "overflow-y": "hidden" }
        };
    };

});