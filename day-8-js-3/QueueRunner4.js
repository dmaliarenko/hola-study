var QueueRunner = (function(){

    function QueueRunner() {};

    QueueRunner.prototype.running = false;

    QueueRunner.prototype.queue = [];

    QueueRunner.prototype.push = function(callback) {
        var _this = this;

        this.queue.push(function(){
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

    QueueRunner.prototype.exec = function(callback){
        this.running = false;

        var shift = this.queue.shift();
        if(shift) {
            this.running = true;
            shift();
        }
    }

    return QueueRunner;

})();
