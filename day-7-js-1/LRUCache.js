
function DoubleLinkedList() {
    this.length = 0;
    this.head = null;
    this.tail = null;
}

DoubleLinkedList.prototype = {
    add: function(value) {
        var node = {
            value: value,
            next: null,
            prev: null,
        }
        if (this.length == 0) {
            this.head = node;
            this.tail = node;
        } else {
            this.tail.next = node;
            node.prev = this.tail;
            this.tail = node;
        }
        this.length++;
    },

    getByValue: function(value) {
        var node = this.head;
        var i = 0;

        while (i++ < this.length) {
            if (node.value === value){
                return node;
            }
            node = node.next;
        }

        return null;
    },

    removeByValue: function(value) {

        var node = this.getByValue(value);
        if (this.getByValue(value) === null) {
            return;
        }

        var i = 0;

        if (node.value === value){
            if (node.prev !== null && node.next !== null){
                node.next.prev = node.prev;
                node.prev.next = node.next;
                delete node;
                this.length--;
            }
            else if (node.prev === null && node.next !== null)
            {
                node.next.prev = null;
                this.head = node.next;
                delete node;
                this.length--;
            }
            else if (node.next === null && node.prev !== null) {
                node.prev.next = null;
                this.tail = node.prev;
                delete node;
                this.length--;
            }
            else{
                this.head = null;
                this.tail = null;
                delete node;
                this.length--;
            }
        }
        return;
    },

    getHead: function() {
        var node = this.head;
        return node.value;
    },

    removeHead: function() {

        var node = this.head;
        var i = 0;

        if (node !== null){
            if (node.next !== null){
                node.next.prev = null;
                this.head = node.next;
                delete node;
                this.length--;
            }
            else{
                this.head = null;
                this.tail = null;
                delete node;
                this.length--;
            }
        }
        return;
    },

    toString: function() {
        var node = this.head;
        var arr = [];
        var i = 0;

        while (i++ < this.length) {
            arr.push(node.value);
            node = node.next;
        }

        return arr.toString();

    },
};

function LRUCache(limit) {
    this.limit = 0;
    (typeof limit == "number") ? this.limit = limit : this.limit = 10;
    this.map = new Map();
    this.list = new DoubleLinkedList();
}
LRUCache.prototype = {
    has: function(key) {
        return this.map.has(key);
    },

    get: function(key) {
        if (this.map.has(key)) {
            this.list.removeByValue(key);
            this.list.add(key);
        }
        return this.map.get(key);
    },

    set: function(key, value) {
        if (!this.map.has(key) & this.list.length >= this.limit) {
            this.map.delete(this.list.getHead());
            this.list.removeHead();
        }
        this.list.removeByValue(key);
        this.list.add(key);
        this.map.set(key, value);
        return;
    },
    queueToString: function() {
        return this.list.toString();
    }

};
