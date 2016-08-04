var QueueRunner = (function(){

    function QueueRunner() {};
    QueueRunner.prototype = {
        running: false,

        pause_mode: false,
        stop_mode: false,

        queue: [],

        exec: function(){
            if (!this.pause_mode && !this.stop_mode && this.queue.length) this.queue.shift().call();
        },

        push: function(obj){

            var fn = obj.fn;
            var data = obj.data;

            var _this = this;
            var callback = function(data){ _this.exec(); };
            this.queue.push(function(){ fn.apply(callback, data||[]);callback();});
        },

        pause: function(){
            this.pause_mode = true;
        },

        stop: function(){
            this.stop_mode = true;
        },

        cleanup: function(){
            this.queue = [];
        },

        resume: function(){
            this.run();
        },

    };

    return QueueRunner;

})();
