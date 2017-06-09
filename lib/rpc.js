const db = require('./db')

// RPC Methods
const methods = {
    async _auth({cookie}, ctx){
        return null
    },
    async register({topic}, ctx){
        if(topic instanceof Array){
            for(t of topic){
                ctx.broadcast.register(ctx.websocket, t)
            }
        } else {
            ctx.broadcast.register(ctx.websocket, topic)
        }
        return ["done", null]
    },
    async deregister({topic}, ctx){
        if(topic instanceof Array){
            for(t of topic){
                ctx.broadcast.deregister(ctx.websocket, t)
            }
        } else {
            ctx.broadcast.deregister(ctx.websocket, topic)
        }
        return ["done", null]
    },

    async echo({message}, ctx){
        return [message, 'echo']
    }
}

module.exports = methods;
