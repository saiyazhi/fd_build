const { ccclass, property } = cc._decorator;

@ccclass
export default class touch extends cc.Component {

    @property(cc.Prefab)
    kuang_prefab: cc.Prefab = null;
    @property(cc.Label)
    xylabel: cc.Label = null;
    @property(cc.Label)
    levellabel: cc.Label = null;
    @property(cc.Node)
    pictureMap: cc.Node = null;

    target_kuang: cc.Node = null;
    setXY: number = 3;


    curLevel: number = 1;
    @property(cc.EditBox)
    editbox: cc.EditBox = null;

    /** json属性 */
    @property(cc.JsonAsset)
    json: cc.JsonAsset = null;
    @property(cc.Label)
    title: cc.Label = null;


    start() {
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
        this.setLevelData();
        // console.log(this.json.json.images);

    }

    /** 测试json,输入测试第几关的数据 */
    test(curLevel) {
        return;
        let jsoniamges = this.json.json.images
        for (let i = 0; i < jsoniamges[curLevel - 1].point.length; i++) {
            let kuang = cc.instantiate(this.kuang_prefab);
            kuang.parent = this.node;
            kuang.setPosition(jsoniamges[curLevel - 1].point[i].x, jsoniamges[0].point[i].y);
            kuang.setContentSize(jsoniamges[curLevel - 1].point[i].w, jsoniamges[0].point[i].h);

        }
    }


    onMouseDown(event) {
        let kuang = cc.instantiate(this.kuang_prefab);
        kuang.parent = this.node;
        kuang.setPosition(this.node.convertToNodeSpaceAR(event.getLocation()));

        //  鼠标按下kuang节点，触发事件
        kuang.on(cc.Node.EventType.MOUSE_DOWN, this.onKuangMouseDown, this);
        //  鼠标按下kuang时移动,触发事件
        kuang.on(cc.Node.EventType.TOUCH_MOVE, this.onKuangTouchMove, this);
        //  鼠标移入kuang节点区域内，触发事件
        kuang.on(cc.Node.EventType.MOUSE_ENTER, this.onKuangMouseEnter, this);
        //  鼠标移出kuang节点区域内，触发事件
        kuang.on(cc.Node.EventType.MOUSE_LEAVE, this.onKuangMouseLeave, this);
        //  鼠标松开kuang节点，触发事件
        kuang.on(cc.Node.EventType.MOUSE_UP, this.onKuangMouseUp, this);
        //  鼠标滚轮滚动时，触发事件
        kuang.on(cc.Node.EventType.MOUSE_WHEEL, this.onKuangMouseWheel, this);
    }



    /** 鼠标按下kuang节点，触发事件 */
    onKuangMouseDown(event) {

        if (event.getButton() == cc.Event.EventMouse.BUTTON_LEFT) {
            this.target_kuang = event.target;
            event.target.children[0].children[0].color = cc.Color.BLUE;
        } else if (event.getButton() == cc.Event.EventMouse.BUTTON_RIGHT) {
            this.setXY += 1;
            if (this.setXY > 3) {
                this.setXY = 1;
            }
            if (this.setXY == 1) {
                this.xylabel.string = "设置宽";
            } else if (this.setXY == 2) {
                this.xylabel.string = "设置高";
            } else {
                this.xylabel.string = "同时设置宽高";
            }
        } else if (event.getButton() == cc.Event.EventMouse.BUTTON_MIDDLE) {
            event.target.destroy();
        }
    }
    /** 鼠标按下kuang时移动,触发事件 */
    onKuangTouchMove(event) {
        event.target.setPosition(this.node.convertToNodeSpaceAR(event.getLocation()));
    }
    /** 鼠标移入kuang节点区域内，触发事件 */
    onKuangMouseEnter(event) {
        event.target.children[0].getComponent(cc.Mask).enabled = true;
        event.target.children[0].children[0].color = cc.Color.BLUE;
    }
    /** 鼠标移出kuang节点区域内，触发事件 */
    onKuangMouseLeave(event) {
        event.target.children[0].getComponent(cc.Mask).enabled = true;
        event.target.children[0].children[0].color = cc.Color.RED;
    }
    /** 鼠标松开kuang节点，触发事件 */
    onKuangMouseUp(event) {
        event.target.children[0].getComponent(cc.Mask).enabled = true;
        event.target.children[0].children[0].color = cc.Color.RED;
    }
    /** 鼠标滚轮滚动时，触发事件 */
    onKuangMouseWheel(event) {
        //  设置节点的width和height
        if (this.setXY == 1) {
            event.target.width += event.getScrollY() / 100;
            event.target.children[0].width += event.getScrollY() / 100;
            event.target.children[0].children[0].width += event.getScrollY() / 100;
        } else if (this.setXY == 2) {
            event.target.height += event.getScrollY() / 100;
            event.target.children[0].height += event.getScrollY() / 100;
            event.target.children[0].children[0].height += event.getScrollY() / 100;
        } else {
            event.target.width += event.getScrollY() / 100;
            event.target.height += event.getScrollY() / 100;
            event.target.children[0].width += event.getScrollY() / 100;
            event.target.children[0].height += event.getScrollY() / 100;
            event.target.children[0].children[0].width += event.getScrollY() / 100;
            event.target.children[0].children[0].height += event.getScrollY() / 100;
        }
    }

    /** 跳关确认按钮事件 */
    public jumpLevelBtnClick() {
        this.curLevel = Number(this.editbox.string);
        this.setLevelData();
    }

    /** 下一关 */
    public nextLevel() {
        this.node.removeAllChildren();
        this.curLevel += 1;
        this.setLevelData();
    }


    public setLevelData() {
        //加载resources里的图片资源
        var self = this;
        cc.resources.load("lev/lev_" + this.curLevel, cc.SpriteFrame, function (err, spriteFrame) {
            //@ts-ignore
            self.pictureMap.children[0].getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        cc.resources.load("lev/lev_" + this.curLevel + "_d", cc.SpriteFrame, function (err, spriteFrame) {
            //@ts-ignore
            self.pictureMap.children[1].getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });

        this.levellabel.string = "第" + this.curLevel.toString() + "关";

        this.test(this.curLevel);
    }

    /** 导出数据 */
    exportData() {
        let jsonStrStart = ',{' + '\n' +
            "   " + '"id":' + '"' + this.curLevel + '"' + ',' + '\n' +
            "   " + '"point":' + '[' + "\n"

        let jsonStrMiddle = '';

        for (let i = 0; i < this.node.children.length; i++) {
            let x = this.node.children[i].x;
            let y = this.node.children[i].y;
            let w = this.node.children[i].width;
            let h = this.node.children[i].height;
            if (i < this.node.children.length - 1) {
                jsonStrMiddle += "   " + '{' + '\n' +
                    "   " + "   " + '"x":' + '"' + x + '"' + ',' + '\n' +
                    "   " + "   " + '"y":' + '"' + y + '"' + ',' + '\n' +
                    "   " + "   " + '"w":' + '"' + w + '"' + ',' + '\n' +
                    "   " + "   " + '"h":' + '"' + h + '"' + '\n' +
                    "   " + '},' + '\n'
            } else {
                jsonStrMiddle += "   " + '{' + '\n' +
                    "   " + "   " + '"x":' + '"' + x + '"' + ',' + '\n' +
                    "   " + "   " + '"y":' + '"' + y + '"' + ',' + '\n' +
                    "   " + "   " + '"w":' + '"' + w + '"' + ',' + '\n' +
                    "   " + "   " + '"h":' + '"' + h + '"' + '\n' +
                    "   " + '}'
            }

        }


        let jsonStrEnd = ']' + '\n' + '}'


        // console.log(jsonStrStart + jsonStrMiddle + jsonStrEnd);
        this.webCopyString(jsonStrStart, jsonStrMiddle, jsonStrEnd);

    }

    /** 复制文本到系统剪切板 */
    webCopyString(str1, str2, str3) {
        let str = str1 + str2 + str3;
        if (str2 == '') {
            // console.log("复制失败");
            this.title.string = "复制失败" + "\n" + "未配置数据";
            this.titileAction();
            return;
        }
        var input = str + '';
        const el = document.createElement('textarea');
        el.value = input;
        el.setAttribute('readonly', '');
        // el.style.contain = 'strict';
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        el.style.fontSize = '12pt'; // Prevent zooming on iOS

        const selection = getSelection();
        var originalRange = null;
        if (selection.rangeCount > 0) {
            originalRange = selection.getRangeAt(0);
        }
        document.body.appendChild(el);
        el.select();
        el.selectionStart = 0;
        el.selectionEnd = input.length;

        var success = false;
        try {
            success = document.execCommand('copy');
        } catch (err) { }

        document.body.removeChild(el);

        if (originalRange) {
            selection.removeAllRanges();
            selection.addRange(originalRange);
        }
        if (success) {
            // console.log("复制成功");
            this.title.string = "复制成功";
            this.titileAction();
        } else {
            // console.log("复制失败");
            this.title.string = "复制失败";
            this.titileAction();
        }
        return success;
    }


    titileAction() {
        cc.tween(this.title.node)
            .to(0.05, { opacity: 255 })
            .delay(0.3)
            .to(0.3, { opacity: 0 })
            .start();
    }

}
