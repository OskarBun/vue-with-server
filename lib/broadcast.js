// ATTENTION!!

//This is deprecated in favour of redis-pubsub (pubsub.js)


// IMPORTS
// ––

// –– Helper Functions –– //
function array_remove(arr, item){
    const index = arr.indexOf(item)
    if(index != -1) {
        arr.splice(index, 1)
        return true
    }
    return false
}

// Define Pub-Sub Service
const pubsub = {
    _topics: {
        sockets: []
    },
    register(ws, topic){
        // split topic string and start at root level
        const subtopics = topic.split('/')
        let level = this._topics

        // create and step through each level for requested topic
        for(sub of subtopics){
            if(level[sub]) level = level[sub]
            else level = level[sub] = {sockets: []}
        }

        // check for websocket has not already been registered
        if(level.sockets.indexOf(ws) === -1) {
            // register websocket
            level.sockets.push(ws)

            // push the registration to the websockets list
            if(ws.subs) ws.subs.push(topic)
            else ws.subs = [topic]
        }
    },
    deregister(ws,topic){
        // if no topic then deregister from all topics
        if(!topic && ws.subs){
            // remove all registrations for the websocket
            for(ws_topic of ws.subs) this.deregister(ws, ws_topic)
        }
        else {
            let t = topic || "";
            // split topic string and start at root level
            const subtopics = t.split('/')
            let level = this._topics

            // step through each level
            for(sub of subtopics){
                // set next level or cancel deregistration for null topic
                if(level[sub]) level = level[sub]
                else return false
            }

            // remove registration at topic level and from websocket list
            array_remove(level.sockets, ws)
            array_remove(ws.subs, topic)
        }
    },
    emit(topic, message){
        // cancel broadcasts for null topics
        if(!topic) return false

        // split topic string and start at root level
        const subtopics = topic.split('/')
        let level = this._topics

        // go through all levels and build list of sockets to broacast to
        let sockets = level.sockets
        for(sub of subtopics){
            if(level[sub]){
                // set next level and add to broadcast list
                level = level[sub]
                sockets = sockets.concat(level.sockets)
            } else break
        }

        // send message to each socket
        for (ws of sockets) {
            // send
            try { ws.send(message) }
            catch(err) {
                console.log(err);
                // deregister if broadcast failed
                console.log("Deregistering loose websocket")
                this.deregister(ws)
            }
        }

        // successfully attempted broadcast
        return true
    }
}

module.exports = pubsub
