'use strict'


function Controller() {
    var model = getList();
    this.addModel = function (c) {
        var subItem = new Item(c, true);
        getList().addModel(subItem);
        saveModel();
        render();
    };
    this.removeModel = function (i) {
        model.list.splice(getList().renderList[i], 1);
        saveModel();
        render();
    };
    this.selectModel = function (i) {
        model.list[getList().renderList[i]].status = !model.list[getList().renderList[i]].status;
        saveModel();
        render();
    }
    this.clearCompleted = function () {
        for (var i = model.list.length - 1; i >= 0; i--) {
            if (!model.list[i].status) {
                model.list.splice(i, 1);
            }
        }
        saveModel();
        render();
    }


    this.completeModel = function (i) {
        model.list[getList().renderList[i]].status = false;
        saveModel();
        render();
    }

    this.recoverModel = function(i){
        model.list[getList().renderList[i]].status = true;
        saveModel();
        render();
    }


    this.modifyModelContent = function(i , con){
        model.list[getList().renderList[i]].content = con;
        saveModel();
        render();
    }

}