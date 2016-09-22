/**
 * Created by malyarenko on 22.09.2016.
 */

var addMinutes = (datetime, minutes) => new Date(datetime.getTime() + minutes * 60000);

var tryOn = (trip, realtime) => {
    return new Promise((resolve, reject) => {
       setTimeout(() => {
           if (trip.inTime(realtime)) {
               resolve(trip.finish);
               console.log("You arrived intime and your " + trip.name + "trip will be finished at " + trip.finish);
           } else {
               reject("You are late to " + trip.name);
           }
       }, 3000);
    });
};

class Trip {

    constructor(id, begin, duration) {
        this.id = id;
        //datetime like 2016/09/22 12:00 // todo
        this.strt = new Date(begin.match(/\d{4}\/\d{2}\/\d{2}\s+\d{2}:\d{2}/));
        this.dur = duration;
    }

    get name() {
        return this.id;
    }


    get start() {
        return this.strt;
    }

    set start(begin) {
        if (begin) this.strt = begin;
    }

    get duration() {
        return this.dur;
    }

    set duration(duration) {
        if (duration) this.dur = duration;
    }

    get finish() {
        return addMinutes(this.start, this.duration);
    }

    inTime(arrivedtime) {
        return arrivedtime <= this.start;
    }
}

let trainTrip = new Trip('train', '2016/09/22 12:00', 600);
let busTrip = new Trip('bus', '2016/09/22 22:15', 60);
let airTrip = new Trip('air', '2016/09/22 23:00', 60);

let mystart = new Date('2016/09/22 11:00'.match(/\d{4}\/\d{2}\/\d{2}\s+\d{2}:\d{2}/));

tryOn(trainTrip, mystart)
    .then(arrivedtime => tryOn(busTrip, arrivedtime))
    .then(arrivedtime => tryOn(airTrip, arrivedtime))
    .then(arrivedtime => console.log("You are finished at: " + arrivedtime))
    .catch(error => console.log(error));

