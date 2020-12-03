(function(window,undefined){
    /*
     * 兼容IE8-浏览器事件添加对象
     */
    var EventUtil = {};
    EventUtil.addEvent = function(element,type,handler){
        if(element.addEventListener){
            element.addEventListener(type,handler,false);
        }else if(element.attachtEvent){
            var scope = function(){
                handler.call(element);
            };
            element.attachtEvent("on"+type,scope);
            this[handler.name] = scope;
        }else{
            element["on"+type] = handler;
        }
    };
    EventUtil.removeEvent = function(element,type,handler){
        if(element.removeEventListener){
            element.removeEventListener(type,handler,false);
        }else if(element.detachEvent){
            if(this[handler.name]){
                element.detachEvent("on"+type,this[handler.name]);
                delete this[handler.name];
            }else{
                element["on"+type] = null;
            }
        }
    };

    EventUtil.stopPropagation = function(){
        if(event.stopPropagation){
            event.stopPropagation();
        }else if(typeof event.cancelBubble == "boolean"){
            event.cancelBubble = true;
        }else{
            throw new Error("element can not stopPropagation");
        }
    };

    //不兼容火狐游览器。火狐游览器中全局的event不存在，必须要在回调函数中传入
    EventUtil.preventDefault = function(){
        var hasReturnValue = function(){
            for(var key in event){
                if(key == "returnValue")
                    return true;
            }
            return false;
        };
        if(event.preventDeafult){
            event.preventDeafult();
        }else if(hasReturnValue()){
            event.returnValue = false;
        }else{
            throw new Error("element can not preventDefault");
        }
    };

    EventUtil.getTarget = function(){
        return event.target ? event.target : event.srcElement;
    };

    //获取当鼠标点击时候用户是否同时按下 ctrl,shift,meta,alt键
    EventUtil.getClickKeys = function(){
        var keys = new Array();
        if(event){
            if(event.shiftKey){
                keys.push("shift");
            }
            if(event.ctrlKey){
                keys.push("ctrl");
            }
            if(event.metaKey){
                keys.push("meta");
            }
            if(event.altKey){
                keys.push("alt");
            }
        }
        return keys;
    };

    //获得相关元素。只有在mouseout和mouseover中才存在该属性
    EventUtil.getRelatedTarget = function(){
        if(event.relatedTarget){
            return event.relatedTarget;
        }else if(event.fromElement){
            return event.fromElement;
        }else if(event.toElement){
            return event.toElement;
        }else{
            return null;
        }
    };

    //获取鼠标点击时候的键位，0表示点击鼠标主按钮（左键）,1表示中间按钮，2表示鼠标次按钮
    EventUtil.getMouseButton = function(){
        if(document.implementation.hasFeature("MouseEvents","2.0")){
            if(typeof event.button == "number")
                return event.button;
            else
                return -1;
        }else{
            var type = event.button || -1;
            switch(type){
                case 0:
                case 1:
                case 3:
                case 5:
                case 7:
                    return 0;
                case 2:
                case 6:
                    return 2;
                case 4:
                    return 1;
                default:
                    return -1;
            }
        }
    };
    window ? window.eventUtil = EventUtil : eventUtil = EventUtil;
})(window);

(function(win,doc){

    let defaultSetting = {
        pageNow: 1,
        pageTotal: 1,
        prevPageContent: "上一页",
        nextPageContent: "下一页",
        showEnds: true,
        currentSize: 0
    };

    function SetPage(option){
        var self = this;
        self.target = option.target;
        self.pageNow = option.pageNow || defaultSetting.pageNow;
        self.pageTotal = option.pageTotal || defaultSetting.pageTotal;
        self.showEnds = option.showEnds === false ? option.showEnds : defaultSetting.showEnds;
        self.callback = option.callback || "";
        self.prevPageContent = option.prevPageContent || defaultSetting.prevPageContent;
        self.nextPageContent = option.nextPageContent || defaultSetting.nextPageContent;
        self.currentSize = option.currentSize || defaultSetting.currentSize;
        self._render();
        self._addListener();
    }

    SetPage.prototype = {
        _render: function(){
            var self = this;
            let page = "<div class='pageContainer'><a href='javascript:;' class='prev-page'>"+ self.prevPageContent +"</a>";
            if(self.showEnds){
                page += "<a href='javascript:;' class='page-start'>首页</a>";
            }
            if(self.pageNow == 1){
                page = page + "<span class='page-now'>1</span>";
            }else{
                page = page + "<a href='javascript:;' class='page-link'>1</a>";
            }
            if(self.pageTotal > 2){
                if(self.pageTotal <= 7){
                    for(let i = 2; i < self.pageTotal; i++){
                        if(self.pageNow == i){
                            page = page + "<span class='page-now'>"+ i +"</span>";
                        }else{
                            page = page + "<a href='javascript:;' class='page-link'>"+ i + "</a>";
                        }
                    }
                }else{
                    if(self.pageNow - 3 > 1){
                        page = page + "<span class='page-omit'>...</span>";
                    }
                    if(self.pageNow - 2 > 1){
                        page = page + "<a href='javascript:;' class='page-link'>" + (self.pageNow - 2) +"</a>";
                        page = page + "<a href='javascript:;' class='page-link'>" + (self.pageNow - 1) +"</a>";
                    }else if(self.pageNow - 2 == 1){
                        page = page + "<a href='javascript:;' class='page-link'>" + (self.pageNow - 1) +"</a>";
                    }
                    if(self.pageNow != 1 && self.pageNow != self.pageTotal){
                        page = page + "<span class='page-now'>" + self.pageNow +"</span>";
                    }
                    if(self.pageNow + 2 < self.pageTotal){
                        page = page + "<a href='javascript:;' class='page-link'>" + (self.pageNow + 1) +"</a>";
                        page = page + "<a href='javascript:;' class='page-link'>" + (self.pageNow + 2) +"</a>";
                    }else if(self.pageNow + 2 == self.pageTotal){
                        page = page + "<a href='javascript:;' class='page-link'>" + (self.pageNow + 1) +"</a>";
                    }
                    if(self.pageNow + 3 < self.pageTotal){
                        page = page + "<span class='page-omit'>...</span>";
                    }
                }
            }
            if(self.pageTotal > 1){
                if(self.pageNow == self.pageTotal){
                    page = page + "<span class='page-now'>" + self.pageTotal + "</span>";
                }else{
                    page = page + "<a href='javascript:;' class='page-link'>" + self.pageTotal +"</a>";
                }
            }
            if(self.showEnds){
                page += "<a href='javascript:;' class='page-end'>尾页</a>";
            }
            page += "<a href='javascript:;' class='next-page'>"+self.nextPageContent+"</a>";
            if(self.currentSize){
                page = page + "<span class='page-current'>记录数: " + self.currentSize + "条</span></div>";
            }else {
                page += "</div>";
            }
            document.querySelector(self.target).innerHTML = page;

        },
        _addListener: function(){
            var self = this;
            let pageTarget = document.querySelector(self.target);
            eventUtil.addEvent(pageTarget,'click',function(e){
                var target = e.target,
                    nodeName = target.nodeName.toLocaleLowerCase();
                target = nodeName == 'img' ? target.parentNode : target;
                if(nodeName !='a' && nodeName !='img') return;
                switch(target.getAttribute("class")){
                    case "prev-page":
                        if(self.pageNow == 1){return;}
                        self.pageNow -= 1;
                        break;
                    case "next-page":
                        if(self.pageNow >= self.pageTotal){return;}
                        self.pageNow += 1;
                        break;
                    case "page-link":
                        if(self.pageNow == target.innerHTML){return;}
                        self.pageNow = target.innerHTML - 0;
                        break;
                    case "page-start":
                        if(self.pageNow == 1){return;}
                        self.pageNow = 1;
                        break;
                    case "page-end":
                        if(self.pageNow >= self.pageTotal){return;}
                        self.pageNow = self.pageTotal;
                        break;
                    default:
                        break;
                }
                self._go();
            });
        },
        _go: function(){
            var self = this;
            self._render();
            self.callback ? self.callback({pageNow:self.pageNow,pageTotal:self.pageTotal}) : "";
        },
        _reset: function(option){
            var self = this;
            self.pageNow = option.pageNow || self.pageNow;
            self.pageTotal = option.pageTotal || self.pageTotal;
            self.currentSize = option.currentSize || self.currentSize;
            self._render();
        }
    };

    win.SetPage = SetPage;
})(window,document);