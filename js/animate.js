var animate = {
    start: function () {
        var dom = document.querySelector("#list_ul");
        for (var item of dom.children) {
            item.style.left = "-300px";
        }
        this.moveX(dom.children, 0);
    },

    //move in X direction
    moveX: function (doms, i) {
        if (i >= doms.length) {
            return;
        }
        var dom = doms[i];
        $(dom).animate({
            left: '0px'
        }, 50, function () {
            animate.moveX(doms, i + 1);
        });
    }

};