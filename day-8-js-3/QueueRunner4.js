var QueueRunner = (function(){

    function QueueRunner() {};

    QueueRunner.prototype.running = false;

    QueueRunner.prototype.QueueRunner = [];

    QueueRunner.prototype.push = function(callback) {
        var _this = this;

        this.QueueRunner.push(function(){
            var finished = callback();
            if(typeof finished === "undefined" || finished) {

               _this.exec();
            }
        });

        if(!this.running) {

            this.exec();
        }

        return this;
    }

    QueueRunner.prototype.exec = function(){
        this.running = false;

        var shift = this.QueueRunner.shift();
        if(shift) {
            this.running = true;
            shift();
        }
    }

    return QueueRunner;

})();
