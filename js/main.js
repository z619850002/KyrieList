"use strict";

window.onload = function () {
    var controller = new Controller();
    document.querySelector("#input_content").addEventListener("keyup", function (event) {
        if (event.keyCode == 13) {
            //add new item into the list
            controller.addModel(this.value, true);
        }
    });

    var items = document.querySelectorAll(".filtering_ul li");
    for (var item of items) {
        item.onclick = function () {
            for (var subItem of document.querySelectorAll(".filtering_ul li")) {
                subItem.classList.remove("selected_li");
            }
            this.classList.add("selected_li");
            render();
        };
    }


    //bind the touch event of the todolist
    var listDom = document.getElementsByClassName('section')[0];
    listDom = document.body;
    listDom.addEventListener("touchstart", touchEvent.TS);
    listDom.addEventListener('touchmove', touchEvent.TM);
    listDom.addEventListener('touchend', touchEvent.TE);


    var clearButton = document.querySelector(".clear_button");
    clearButton.onclick = controller.clearCompleted;
    recoverModel();
    render();
};




//render function
function render() {

    var leftItem = 0;
    document.querySelector('.clear_button').style.display = "none";
    for (var item of getList().list) {
        if (!item.status) {
            leftItem++;
        }
    }
    if (leftItem){
        document.querySelector('.clear_button').style.display = "block";
    }




    //clear the input content
    var listDom = document.querySelector("#input_content");
    listDom.value = "";

    //clear the content
    var listDom = document.querySelector("#list_ul");
    listDom.innerHTML = "";

    var l = getList().list;

    l = filtering(l);



    //set the border   
    var items = document.querySelectorAll(".filtering_ul li");
    for (var item of items) {
        item.style.border = "";
    }
    document.querySelector('.selected_li').style.border = "1px solid red";




    //add items into the container
    for (var i = 0; i < l.length; i++) {
        var item = l[i];
        var dom = document.createElement("li");
        dom.id = "item_li";
        var content = item.content;

        //if this item completed
        var styleContent = "";
        if (item.status) {
            dom.style.opacity = "1.0";
            dom.style.border = "border: #999990 solid 3px;";
        }


        //if the strike is needed
        var content2 = content;
        if (!l[i].status) {
            content2 = content.strike();
        }
        dom.innerHTML = [
            '<div class="item_div select_dom">',
            '  <label class="content_label" type = "text" onselectstart="return false;">' +
            content2 +
            "</label>",
            '<button class="destroy" onselectstart="return false;"></button>',
            "</div>"
        ].join("");

        //the original dom
        //when editing the content, it`s display should be changed into none
        var originalDom = dom.children[0];

        listDom.appendChild(dom);
        //set the background of the items
        if (i % 2 == 0) {
            dom.style.backgroundColor = "purple";
            //dom.style.backgroundImage = "url(img/texture1.jpg)";
        } else {
            dom.style.backgroundColor = "red";
            //dom.style.backgroundImage = "url(img/texture2.jpg)";
        }
        dom.onselectstart = function () {
            return false;
        };


        var hammertime = new Hammer(dom);

    

        hammertime.on(
            "press",
            (function () {
                var choose = i;
                return function () {
                    var controller = new Controller();
                    controller.recoverModel(choose);
                };
            })()
        );

        hammertime.on(
            "doubletap",
            (function () {
                var ii = i;
                var od = originalDom;
                var d = dom;
                var c = content;
                return function () {
                    dom.onselectstart = null;
                    od.style.display = "none";
                    //add edit item
                    var edit = document.createElement("input");
                    var finished = false;
                    edit.style.position = "relative";
                    edit.style.top = "0px";
                    edit.style.width = "100%";
                    edit.style.height = "100%";
                    edit.style.border = "black solid 3px";
                    edit.setAttribute("type", "text");
                    edit.setAttribute("class", "edit");
                    edit.setAttribute("value", c);

                    function finish() {
                        if (finished) return;
                        finished = true;
                        d.removeChild(edit);
                        od.style.display = "";
                        dom.onselectstart = function () {
                            return null;
                        };
                    }
                    edit.addEventListener(
                        "blur",
                        function () {
                            finish();
                        },
                        false
                    );
                    edit.addEventListener(
                        "keyup",
                        function (ev) {
                            if (ev.keyCode == 27) {
                                // Esc
                                finish();
                            } else if (ev.keyCode == 13) {
                                new Controller().modifyModelContent(ii, edit.value);
                                render();
                            }
                        },
                        false
                    );
                    d.appendChild(edit);
                };
            })()
        );

        dom.ondblclick = (function () {
            var ii = i;
            var od = originalDom;
            var d = dom;
            var c = content;
            return function () {
                dom.onselectstart = null;
                od.style.display = "none";
                //add edit item
                var edit = document.createElement("input");
                var finished = false;
                edit.style.position = "relative";
                edit.style.top = "0px";
                edit.style.width = "100%";
                edit.style.height = "100%";
                edit.style.border = "black solid 3px";
                edit.setAttribute("type", "text");
                edit.setAttribute("class", "edit");
                edit.setAttribute("value", c);

                function finish() {
                    if (finished) return;
                    finished = true;
                    d.removeChild(edit);
                    od.style.display = "";
                    dom.onselectstart = function () {
                        return null;
                    };
                }
                edit.addEventListener(
                    "blur",
                    function () {
                        finish();
                    },
                    false
                );
                edit.addEventListener(
                    "keyup",
                    function (ev) {
                        if (ev.keyCode == 27) {
                            // Esc
                            finish();
                        } else if (ev.keyCode == 13) {
                            new Controller().modifyModelContent(ii, edit.value);
                            render();
                        }
                    },
                    false
                );
                d.appendChild(edit);
            };
        })();
        animate.start();
    }

    //status change events
    var changeDoms = document.querySelectorAll(".toggle");
    for (var i = 0; i < changeDoms.length; i++) {
        var item = changeDoms[i];
        if (!l[changeDoms.length - 1 - i].status) {
            item.checked = true;
        }
        item.onchange = (function () {
            var ii = i;
            return function () {
                new Controller().selectModel(ii);
            };
        })();
    }

    //destroy events
    var destroyDoms = document.querySelectorAll(".destroy");
    for (var i = 0; i < destroyDoms.length; i++) {
        var item = destroyDoms[i];
        item.style.backgroundImage = 'url(img/button.jpg)';
        item.style.backgroundSize = "100% 100%";
        item.style.border = "none";
        item.onclick = (function () {
            var ii = i;
            return function () {
                new Controller().removeModel(ii);
            };
        })();
    }

    var heightList = [];
    var widthList = [];
}