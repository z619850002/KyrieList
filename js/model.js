function saveModel() {
  var l = getList().list;
  var storage = window.localStorage;
  storage.setItem("Kyrie", JSON.stringify(l));
  //   storage.setItem("size", l.length);
  //   for (var i = 0; i < l.length; i++) {
  //     storage.setItem(i + "c", l[i].content);
  //     storage.setItem(i + "s" , l[i].status);
  //   }
}


function recoverModel() {
  var storage = window.localStorage;
  if (storage["Kyrie"]){
  var obj = JSON.parse(storage["Kyrie"]);
  getList().list = obj;
  }else{
    getList().list = [];
  }
}





//filtering the list
function filtering(list) {
  getList().renderList = [];
  var items = document.querySelectorAll(".filtering_ul li");
  for (var i = 0; i <= 2; i++) {
    if (items[i].classList.contains("selected_li")) {
      //3 kinds of showing type
      switch (i) {
        case 0:
          for (var i = 0; i < list.length; i++) {
            getList().renderList.push(i);
          }
          return list;
        case 1:
          {
            var anotherList = new Array();
            for (var i = 0; i < list.length; i++) {
              item = list[i];
              if (item.status) {
                getList().renderList.push(i);
                anotherList.push(item);
              }
            }
            return anotherList;
          }
        case 2:
          {
            var anotherList = new Array();
            for (var i = 0; i < list.length; i++) {
              item = list[i];
              if (!item.status) {
                getList().renderList.push(i);
                anotherList.push(item);
              }
            }
            return anotherList;
          }
      }
    }
  }
}

//factory method
function Item(c, s) {
  var newModel = new Object();
  newModel.content = c;
  //true means it`s unfinished
  newModel.status = s;
  return newModel;
}

//singleton
//this store the information in the todo list
function infoList() {
  //the model list
  this.list = new Array();
  this.renderList = new Array();

  //add model into the list
  this.addModel = function (m) {
    this.list.splice(0, 0, m);
  };
}

//use the closure achieve the singleton goal
var getList = (function () {
  var instance = null;
  return function () {
    if (instance == null) {
      instance = new infoList();
    }
    return instance;
  };
})();





var touchEvent = {
    isTouch: false,
    positionList: [],
    chooseList:[],
    //touch start
    TS: function (event) {
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
            console.log([
                item.getBoundingClientRect().left,
                item.getBoundingClientRect().top,
                item.getBoundingClientRect().left + item.offsetWidth,
                item.getBoundingClientRect().top + item.clientHeight
            ]);
        }
    },
    TM: function (evt) {
        if (this.isTouch) {
            var event = evt.touches[0];
            var x = Number(event.pageX);
            var y = Number(event.pageY);
            var dom = document.querySelector("#list_ul");
            for (var i = 0; i < this.positionList.length; i++) {
                if (!this.positionList.includes(i)) {
                    if (
                        x > this.positionList[i][0] &&
                        x < this.positionList[i][2] &&
                        y > this.positionList[i][1] &&
                        y < this.positionList[i][3]
                    )
                    {
                        var ii = i;
                        this.chooseList.push(ii);
                    }
                }
            }
        }
    },

    TE: function (event) {
        if (this.isTouch) {
            var controller = new Controller();
            for (var item of this.chooseList) {
                controller.completeModel(item);
            }
        }
    }
};