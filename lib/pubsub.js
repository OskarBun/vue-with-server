// IMPORTS
//This is a work in progress
// –– NPM
const NRP = require('node-redis-pubsub');

//Should be checking here for heroku env vars
const config = {
  port: 6379,
  scope: 'myapp'
}

const redis = new NRP(config)

// Define Pub-Sub Service
const pubsub = {
    register(ws, topic){
        if(ws.subs && ws.subs[topic]) return;
        //Subscribe
        const sub = redis.on(topic, data=>{
            //Send data
            try { ws.send(data) }
            catch(err) {
                // deregister if broadcast failed
                console.log("Deregistering loose websocket")
                this.deregister(ws)
            }
        });
        //Store copy for deregistering
        if(ws.subs) ws.subs[topic] = sub
        else ws.subs = {[topic]:sub}
    },
    deregister(ws,topic){
        // if no topic then deregister from all topics
        if(!topic && ws.subs){
            // remove all registrations for the websocket
            for(t in ws.subs) {
                ws.subs[t]();
            }
        }
        else {
            const deregister = ws.subs[topic]
            if(deregister) deregister()
        }
    },
    emit(topic, message){
        redis.emit(topic, message)
    }
}

module.exports = pubsub
