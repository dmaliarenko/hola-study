window.$ = function(selector){

    function listing(callback){
        if (typeof selector === "string") {
            var object = document.querySelectorAll(selector);
            for (i in object){
                if (typeof object[i] === "object")
                    callback(object[i]);
            }
        } else {
            callback(selector);
        }

        return this;
    }


    function getSelector(){
        return typeof selector === "string" ? document.querySelector(selector) : selector;
    }


    this.html = function(value){

        if (typeof value === "undefined"){
            return getSelector().innerHTML;
        }

        return listing(function(object){
            object.innerHTML = value;
        });
    };

    return this;
}
