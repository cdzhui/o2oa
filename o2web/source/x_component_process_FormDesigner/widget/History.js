MWF.xApplication.process.FormDesigner.widget = MWF.xApplication.process.FormDesigner.widget || {};
MWF.xDesktop.requireApp("Template", "MTooltips", null, false);
MWF.xApplication.process.FormDesigner.widget.History = new Class({
	Implements: [Options, Events],
	Extends: MWF.widget.Common,
	options: {

	},
	initialize: function(form, actionNode, options){
		this.setOptions(options);
        this.form = form;
        this.actionNode = actionNode;
        this.root = this.form.node;
		// this.path = "../x_component_process_FormDesigner/widget/$ImageClipper/";
		// this.cssPath = "../x_component_process_FormDesigner/widget/$ImageClipper/"+this.options.style+"/css.wcss";
		// this._loadCss();
	},

	load: function(data) {
        //存储当前表面状态数组-上一步
        this.preArray = [];
        //存储当前表面状态数组-下一步
        this.nextArray = [];

        this.node = new Element("div", {"height":"100px"});

        var _self = this;
        this.tooltips = new MWF.FCWHistory.Tooltips(
            this.form.designer.formNode,
            this.actionNode,
            this.form.designer,
            null,
            {
                onPostCreate: function () {
                    _self.node.inject( this.contentNode );
                    _self.add({
                        "operation": "open", //操作 create, copy, move, delete
                        "type": "form", //property
                        "json": {"id":"form"}
                    });

                }
            }
        );
        this.tooltips.load();
    },
    //获取domPath
    getPath: function (node) {
	    var root = this.root;
        var path = [];
        var parent, childrens, nodeIndex;
        while (node && node !== root) {
            parent = node.parentElement;
            childrens = Array.from(parent.children);
            nodeIndex = childrens.indexOf(node);
            path.push(nodeIndex);
            node = parent;
        }
        return path.reverse();
    },
    add: function(log, module) {
        // var log = { //也有可能是对象数组
        //     "operation": "create", //操作 create, copy, move, delete, mergeCell
        //     "type": "module", //property
        //     "json": {},  //最终json
        //     "jsonObject": {}, //本json所包含的子json
        //     "html": "", //最终html
        //     "path": "", //最终dom path
        //      "fromLog": { //初始数据
        //          "json": {},
        //          "jsonObject": {},
        //          "html": "",
        //          "path": ""
        //      }
        // };
        var item;
        switch (log.json.type) {
            case "Tab$Page":
                item = new MWF.FCWHistory.TabpageItem(this, log);
                break;
            default:
                item = new MWF.FCWHistory.Item(this, log);
        }
        item.load();

        var it;
        while( this.nextArray.length ){
            it = this.nextArray.pop();
            it.destroy();
        }

        this.preArray.push(item);
    },
    goto: function(item){
	    var it;
	    if( item.status === "pre" ){
	        it = this.preArray.getLast();
	        while (it && item !== it){
                it.undo();
                this.nextArray.unshift(it); //插入到灰显数组前面
                this.preArray.pop(); //删除preArray最后一个
                it = this.preArray.getLast();
            }
        }else if( item.status === "next" ){
            it = this.nextArray[0];
            while (it && item !== it){
                it.redo();
                this.preArray.push(it); //插入到preArray数组最后
                this.nextArray.shift();
                it = this.nextArray[0];
            }
            item.redo();
            this.preArray.push(item); //插入到preArray数组最后
            this.nextArray.shift();
        }
    }
});

MWF.FCWHistory = MWF.xApplication.process.FormDesigner.widget.History;

MWF.FCWHistory.Item = new Class({
    Implements: [Options, Events],
    options: {},
    initialize: function (history, log) {
        this.history = history;
        this.data = log;
        this.status = "pre";
        this.form = this.history.form;
        this.root = this.history.root;
    },
    load: function () {
        this.node = new Element("div", {
            styles : {
                "color": "#333",
                "padding": "5px"
            },
            text: this.getText(),
            events: {
                click: this.comeHere.bind(this)
            }
        }).inject( this.history.node );
    },
    getText: function () {
        return this.data.operation + " " + this.data.json.id
    },
    comeHere: function () {
        this.history.goto(this)
    },
    undo: function () { //回退
        this.status = "next";
        this.node.setStyles({
            "color": "#ccc"
        });
        switch (this.data.type) {
            case "module":
                this.undoModule();
                break;
            case "property":
                this.undoPropery();
                break;
        }
        console.log( this.data );
    },
    redo: function(){ //重做
        this.status = "pre";
        this.node.setStyles({
            "color": "#333"
        });
        switch (this.data.type) {
            case "module":
                this.redoModule();
                break;
            case "property":
                this.redoPropery();
                break;
        }
        console.log( this.data );
    },
    undoPropery: function(){

    },
    redoPropery: function(){

    },
    undoModule: function(){
        var dom, module, log;
        debugger;
        switch (this.data.operation) {
            case "create":
                dom = this.getDomByPath( this.data.path );
                if(dom)module = dom.retrieve("module");
                if(module)module.destroy();
                break;
            case "copy":
                dom = this.getDomByPath( this.data.path );
                if(dom)module = dom.retrieve("module");
                if(module)module.destroy();
                break;
            case "move":
                dom = this.getDomByPath( this.data.path );
                this.injectToByPath( this.data.fromLog.path, dom );
                break;
            case "delete":
                this.loadModule();
                break;
            case "mergeCell": //table的操作，合并单元格
                dom = this.getDomByPath( this.data.path );
                module = dom.retrieve("module");
                module.destroy();
                this._loadModule( this.data.path, this.data.fromLog.html, this.data.fromLog.json, this.data.fromLog.jsonObject );
                break;
            case "insertRow": //td的操作，插入行
                var tr;
                for( var i=this.data.logList.length-1; i>-1; i-- ){
                    log = this.data.logList[i];
                    dom = this.getDomByPath( log.path );
                    if( !tr )tr = dom.getParent("tr");
                    module = dom.retrieve("module");
                    module.destroy();
                }
                if(tr)tr.destroy();
                break;
            case "insertCol": //td的操作，插入列
                for( var i=this.data.logList.length-1; i>-1; i-- ){
                    log = this.data.logList[i];
                    dom = this.getDomByPath( log.path );
                    module = dom.retrieve("module");
                    module.destroy();
                }
                break;
            case "deleteRow": //td的操作，删除行

                break;
        }
        this.unselectModule();
    },
    redoModule: function(){
        var dom, module, log;
        switch (this.data.operation) {
            case "create":
                this.loadModule();
                break;
            case "copy":
                this.loadModule();
                break;
            case "move":
                dom = this.getDomByPath( this.data.fromLog.path );
                this.injectToByPath( this.data.path, dom );
                break;
            case "delete":
                dom = this.getDomByPath( this.data.path );
                if(dom)module = dom.retrieve("module");
                if(module)module.destroy();
                break;
            case "mergeCell": //合并单元格
                dom = this.getDomByPath( this.data.path );
                module = dom.retrieve("module");
                module.destroy();
                this.loadModule();
                break;
            case "insertRow": //td的操作，插入行
                var path = Array.clone(this.data.logList[0].path);
                path.pop();
                this.injectHtmlByPath( path, "<tr></tr>" ); //创建tr
                for( var i=0; i<this.data.logList.length; i++ ){
                    log = this.data.logList[i];
                    this._loadModule( log.path, log.html, log.json, log.jsonObject );
                }
                break;
            case "insertCol": //td的操作，插入列
                for( var i=0; i<this.data.logList.length; i++ ){
                    log = this.data.logList[i];
                    this._loadModule( log.path, log.html, log.json, log.jsonObject );
                }
                break;
        }
        this.unselectModule();
    },

    destroy: function () {
        this.node.destroy();
    },
    unselectModule: function () {
        if(this.form.currentSelectedModule && this.form.currentSelectedModule.unSelected){
            this.form.currentSelectedModule.unSelected()
        }
        this.form.currentSelectedModule = null;
    },


    //根据路径获取dom
    getDomByPath: function(path){
        var i, nodeIndex;
        var node = this.root;
        for( i=0; i<path.length; i++ ){
            nodeIndex = path[i];
            node = node.children[nodeIndex];
        }
        return node;
    },
    //插入到对应位置
    injectToByPath: function(path, dom){
        var i, nodeIndex;
        var node = this.root;
        for( i=0; i<path.length - 1; i++ ){
            nodeIndex = path[i];
            node = node.children[nodeIndex];
        }
        var last = path.getLast();
        if( last === 0 ){
            dom.inject( node, "top" );
        }else{
            var contains = false;
            for( i=0; i<last; i++ ){
                if( node.children[i] === dom ){ //如果位置包含当前dom
                    contains = true;
                    break;
                }
            }
            node = node.children[contains ? last : (last-1)];
            dom.inject(node, "after");
        }
        this.resetTreeNode( dom );
    },
    //插入HTML到对应位置
    injectHtmlByPath: function(path, html){
        debugger;
        var i, nodeIndex;
        var node = this.root;
        for( i=0; i<path.length - 1; i++ ){
            nodeIndex = path[i];
            node = node.children[nodeIndex];
        }
        var dom = new Element("div");
        var last = path.getLast();
        var parentNode = node;
        if( last === 0 ){
            dom.inject( node, "top" );
        }else{
            node = node.children[last-1];
            dom.inject(node, "after");
        }
        dom.outerHTML = html; //dom没了
        dom = parentNode.children[last];
        return dom;
    },
    resetTreeNode: function(node){
        var module = node.retrieve("module");
        if(module){
            module.parentContainer = this.getParentModule( node );
            module._resetTreeNode();
        }
    },
    addModulesJson: function( jsonObject ){
        if(jsonObject){
            for( var id in jsonObject ){
                this.form.json.moduleList[id] = jsonObject[id];
            }
        }
    },
    loadModule: function(){
        this._loadModule( this.data.path, this.data.html, this.data.json, this.data.jsonObject );
    },
    _loadModule: function( path, html, json, jsonObject ){
        var dom = this.injectHtmlByPath( path, html );
        this.addModulesJson(jsonObject);
        var parentModule = this.getParentModule(dom);
        var module = this.form.loadModule(json, dom, parentModule || this.form);
        module._setEditStyle_custom("id");
    },
    getParentModule: function (node) {
        var parent, parentNode = node.getParent();
        while( parentNode && !parent ){
            var mwftype = parentNode.get("mwftype");
            if( mwftype === "form") {
                parent = this.form;
            }else if( mwftype ){
                parent = parentNode.retrieve("module");
            }else{
                parentNode = parentNode.getParent();
            }
        }
        return parent;
    },
    getParentModuleByType: function( node, moduleType ){
        var parentNode = node;
        var module;
        while( parentNode && !module ){
            if( parentNode.get("mwftype") === moduleType )module = parentNode.retrieve("module");
            parentNode = parentNode.getParent();
        }
        return module;
    }
});


MWF.FCWHistory.TabpageItem = new Class({
    Extends: MWF.xApplication.process.FormDesigner.widget.History.Item,
    restoreTabage: function(){
        var contentNode = this.injectHtmlByPath( this.data.content.path, this.data.content.html );
        this.addModulesJson( this.data.content.jsonObject );

        var tabNode = this.injectHtmlByPath( this.data.path, this.data.html );
        this.addModulesJson( this.data.jsonObject );

        var tabModule = this.getParentModuleByType(tabNode, "tab");

        tabModule.loadExistedNodePage(tabNode, contentNode, this.data.json, this.data.content.json);
    },
    undoModule: function(){
        var dom, module;
        switch (this.data.operation) {
            case "add":
                dom = this.getDomByPath( this.data.path );
                if(dom)module = dom.retrieve("module");
                if(module)module._delete();
                break;
            case "copy":
                break;
            case "move":
                dom = this.getDomByPath( this.data.path );
                this.injectToByPath( this.data.fromLog.path, dom );

                dom = this.getDomByPath( this.data.content.path );
                this.injectToByPath( this.data.content.fromLog.Path, dom );
                break;
            case "delete":
                this.restoreTabage();
                break;
        }
        this.unselectModule();
    },
    redoModule: function(){
        var dom, module;
        switch (this.data.operation) {
            case "add":
                this.restoreTabage();
                break;
            case "copy":
                break;
            case "move":
                debugger;
                dom = this.getDomByPath( this.data.fromLog.path );
                this.injectToByPath( this.data.path, dom );

                dom = this.getDomByPath( this.data.content.fromLog.path );
                this.injectToByPath( this.data.content.path, dom );
                break;
            case "delete":
                dom = this.getDomByPath( this.data.path );
                if(dom)module = dom.retrieve("module");
                if(module)module._delete();
                break;
        }
        this.unselectModule();
    }
});


MWF.FCWHistory.Tooltips = new Class({
    Extends: MTooltips,
    options : {
        style: "design",
        axis: "y",      //箭头在x轴还是y轴上展现
        position : { //node 固定的位置
            x : "right", //x轴上left center right,  auto 系统自动计算
            y : "bottom" //y 轴上top middle bottom, auto 系统自动计算
        },
        event : "click", //事件类型，有target 时有效， mouseenter对应mouseleave，click 对应 container 的  click
        isAutoHide: false,
        hiddenDelay : 200, //ms  , 有target 且 事件类型为 mouseenter 时有效
        displayDelay : 0,   //ms , 有target 且事件类型为 mouseenter 时有效
        hasArrow : false,
        hasCloseAction: true,
        hasMask: false,
        isParentOffset: true,
        nodeStyles: {
            padding: "0px",
            "min-height": "100px",
            "border-radius" : "0px"
        }
    },
    _customNode : function( node, contentNode ){
        new Element("div", {
            "style": "padding-left: 10px; background-color: rgb(242, 242, 242); color: #333333; height: 30px; line-height: 30px; ",
            "text": "历史记录"
        }).inject(contentNode, "before");
        //var width = ( parseInt( this.selector.options.width )  )+ "px";
        //node.setStyles({
        //    "width": width,
        //    "max-width": width
        //});
        debugger;
        // if( this.data && this.data.length > 0 ){
        //     this.createItemList( this.data, contentNode )
        // }else if( this.selector.options.tooltipWhenNoSelectValue ){
        //     this.createNoSelectValueNode( contentNode );
        // }
    },
})
