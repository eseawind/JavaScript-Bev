/* COPYRIGHT 2012 SUPERMAP
 * 本程序只能在有效的授权许可下使用。
 * 未经许可，不得以任何手段擅自使用或传播。*/

/**
 * Class: SuperMap.Control.BevLayerSwitcher
 * 图层选择控件类。
 * 用于控制地图中的图层可见性(BEV定制)。
 *
 * Inherits from:
 *  - <SuperMap.Control.LayerSwitcher>
 */
SuperMap.Control.BevLayerSwitcher = SuperMap.Class(SuperMap.Control.LayerSwitcher, {

    /**
     * APIProperty: position
     * {String} 控件的摆放位置，有left和right供选择
     */
    position: "right",

    /**
     * APIProperty: offsetX
     * {Number} 相对于控件默认位置的偏移量
     */
    offsetX: 0,

    /**
     * APIProperty: offsetY
     * {Number} 相对于控件默认位置的偏移量
     */
    offsetY: 0,

    /**
     * Constructor: SuperMap.Control.BevLayerSwitcher
     * 图层转换控件类
     *
     * Parameters:
     * options - {Object} 设置该类开放的属性。
     * 	 
     * 可用两种方式添加：	 
     * （1）在初始化构造 Map 的时候，设置 Map 的 controls 属性来添加控件，如 ：
     * (code)	 
     * 	var map = new SuperMap.Map('map',{controls:[
     *      new SuperMap.Control.BevLayerSwitcher()
     *  ]}); 	 
     * (end)
     * 	 
     * （2）在Map构造完成后，调用接口 Map 的方法 addControl() 来添加控件，如 ：
     * (code)	 
     * var map = new SuperMap.Map('map');
     * map.addControl(new SuperMap.Control.BevLayerSwitcher());
     * (end) 	 
     */
    initialize: function(options) {
        SuperMap.Control.LayerSwitcher.prototype.initialize.apply(this, arguments);
        this.displayClass = this.displayClass.replace(/smControlBevLayerSwitcher/,"smControlLayerSwitcher");
    },

    /**
     * Method: draw
     *
     * Returns:
     * {DOMElement} A reference to the DIV DOMElement containing the
     *     switcher tabs.
     */
    draw: function() {
        SuperMap.Control.LayerSwitcher.prototype.draw.apply(this);

        this.div.style.top = (50+this.offsetY) + "px";
        if(this.position == "right"){
            this.div.style.right = (0+this.offsetX) + "px";
        }
        else{
            this.div.style.left = (0+this.offsetX) + "px";
        }

        return this.div;
    },

    /**
     * Method: loadContents
     * Set up the labels and divs for the control
     */
    loadContents: function() {

        SuperMap.Event.observe(this.div, "mouseup",
            SuperMap.Function.bindAsEventListener(this.mouseUp, this));
        SuperMap.Event.observe(this.div, "click",    this.ignoreEvent);
        SuperMap.Event.observe(this.div, "mousedown",
            SuperMap.Function.bindAsEventListener(this.mouseDown, this));
        SuperMap.Event.observe(this.div, "dblclick", this.ignoreEvent);

        // 图层列表div
        this.layersDiv = document.createElement("div");
        this.layersDiv.id = this.id + "_layersDiv";
        SuperMap.Element.addClass(this.layersDiv, "layersDiv");

        this.baseLbl = document.createElement("div");
        this.baseLbl.innerHTML = SuperMap.i18n("Base Layer");
        SuperMap.Element.addClass(this.baseLbl, "baseLbl");

        this.baseLayersDiv = document.createElement("div");
        SuperMap.Element.addClass(this.baseLayersDiv, "baseLayersDiv");

        this.dataLbl = document.createElement("div");
        this.dataLbl.innerHTML = SuperMap.i18n("Overlays");
        SuperMap.Element.addClass(this.dataLbl, "dataLbl");

        this.dataLayersDiv = document.createElement("div");
        SuperMap.Element.addClass(this.dataLayersDiv, "dataLayersDiv");

        if (this.ascending) {
            this.layersDiv.appendChild(this.baseLbl);
            this.layersDiv.appendChild(this.baseLayersDiv);
            this.layersDiv.appendChild(this.dataLbl);
            this.layersDiv.appendChild(this.dataLayersDiv);
        } else {
            this.layersDiv.appendChild(this.dataLbl);
            this.layersDiv.appendChild(this.dataLayersDiv);
            this.layersDiv.appendChild(this.baseLbl);
            this.layersDiv.appendChild(this.baseLayersDiv);
        }

        this.div.appendChild(this.layersDiv);

        imgLocation = SuperMap.Util.getImagesLocation();
        var sz = new SuperMap.Size(24,24);

        // 最大按钮div
        if(this.position=="left"){
            img = imgLocation + 'layer-switcher-maximize-l.png';
        }
        else{
            img = imgLocation + 'layer-switcher-maximize.png';
        }


        this.maximizeDiv = SuperMap.Util.createAlphaImageDiv(
            "SuperMap_Control_MaximizeDiv",
            null,
            sz,
            img,
            "absolute",
            "2px");
        SuperMap.Element.addClass(this.maximizeDiv, "maximizeDiv");
        this.maximizeDiv.style.display = "none";
        // 最小按钮div
        if(this.position=="left"){
            this.maximizeDiv.style.left = "0px";
        }
        else{
            this.maximizeDiv.style.right = "0px";
        }
        SuperMap.Event.observe(this.maximizeDiv, "click",
            SuperMap.Function.bindAsEventListener(this.maximizeControl, this)
        );

        this.div.appendChild(this.maximizeDiv);

        // 最小按钮div
        if(this.position=="left"){
            img = imgLocation + 'layer-switcher-minimize-l.png';
        }
        else{
            img = imgLocation + 'layer-switcher-minimize.png';
        }
        var sz = new SuperMap.Size(171,24);
        this.minimizeDiv = SuperMap.Util.createAlphaImageDiv(
            "SuperMap_Control_MinimizeDiv",
            null,
            sz,
            img,
            "absolute");
        var content = document.createElement('span');
        content.innerHTML = SuperMap.i18n("LayerSwitcher");
        content.className = 'layerSwitcherContent';
        this.minimizeDiv.appendChild(content);
        SuperMap.Element.addClass(this.minimizeDiv, "minimizeDiv");
        this.minimizeDiv.style.display = "none";
        SuperMap.Event.observe(this.minimizeDiv, "click",
            SuperMap.Function.bindAsEventListener(this.minimizeControl, this)
        );

        this.div.appendChild(this.minimizeDiv);
    },

    CLASS_NAME: "SuperMap.Control.BevLayerSwitcher"
});
