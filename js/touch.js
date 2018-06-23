//all touch event are stored here
var touchEvent = {
    isTouch: false,
    isMultipleTouch: false,
    positionList: [],
    chooseList: [],
    moveDirection: 1,
    nowItem: 0,
    //touch start
    TS: function (event) {
        console.log(event.touches.length);
        //single
        if (event.touches.length == 1) {
            this.isTouch = true;
            this.positionList = [];
            this.chooseList = [];
            var dom = document.querySelector("#list_ul");
            for (var item of dom.children) {
                this.positionList.push([
                    item.getBoundingClientRect().left,
                    item.getBoundingClientRect().top,
                    item.getBoundingClientRect().left + item.offsetWidth,
                    item.getBoundingClientRect().top + item.clientHeight
                ]);
            }
        }
        //2 fingers
        else if (event.touches.length == 2) {
            console.log('m begin')
            this.isMultipleTouch = true;
            this.isTouch = false;
            this.positionList = [];
            this.chooseList = [];
            this.positionList.push(event.touches[0].pageX);
            this.positionList.push(event.touches[1].pageX);
            var selectedDom = document.querySelector('.filtering_ul');
            for (var i = 0; i <= 2; i++) {
                if (selectedDom.children[i].classList.contains('selected_li')) {
                    this.nowItem = i;
                    break;
                }
            }
        }
    },
    //touch move
    TM: function (event) {
        //single fingers
        if (this.isTouch && event.touches.length == 1) {
            var evt = event.touches[0];
            var x = Number(evt.pageX);
            var y = Number(evt.pageY);
            var dom = document.querySelector("#list_ul");
            for (var i = 0; i < this.positionList.length; i++) {
                if (!this.positionList.includes(i)) {
                    if (
                        x > this.positionList[i][0] &&
                        x < this.positionList[i][2] &&
                        y > this.positionList[i][1] &&
                        y < this.positionList[i][3]
                    ) {
                        var ii = i;
                        this.chooseList.push(ii);
                    }
                }
            }
        }
        //multiple fingers 
        else if (this.isMultipleTouch) {
            if (event.touches[0].pageX < this.positionList[0]) {
                this.moveDirection = -1;
            } else {
                this.moveDirection = 1;
            }
        }
    },
    //touch end
    TE: function (event) {
        if (this.isTouch) {
            var controller = new Controller();
            for (var item of this.chooseList) {
                controller.completeModel(item);
            }
            this.isTouch = false;
        } else if (this.isMultipleTouch) {
            var selectedDom = document.querySelector('.filtering_ul');
            var selectedIndex = 0;
            for (var i = 0; i <= 2; i++) {
                if (selectedDom.children[i].classList.contains('selected_li')) {
                    selectedIndex = i;
                    break;
                }
            }
            if (this.nowItem == selectedIndex) {
                selectedIndex += this.moveDirection;
                if (selectedIndex > 2) {
                    selectedIndex = 0;
                } else if (selectedIndex < 0) {
                    selectedIndex = 2;
                }
                selectedDom.children[selectedIndex].onclick();
                this.isMultipleTouch = false;
            }
        }
    }
};