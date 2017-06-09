const loc = window.location;
let new_uri = "";
if (loc.protocol === "https:") {
    new_uri = "wss:";
} else {
    new_uri = "ws:";
}
new_uri += "//" + loc.host;

const ws = new WebSocket(new_uri)

const outs = {}
let id = 1
const pending = []

const rpc = (method, params) => {
    return new Promise((resolve, reject)=>{
        if(ws.readyState === 0){
            pending.push(()=>{
                const req = {jsonrpc: "2.0", id: id, method: method, params: params}
                ws.send(JSON.stringify(req))
                outs[req.id] = {resolve,reject}
                id++
            })
        } else if (ws.readyState == 1) {
            const req = {jsonrpc: "2.0", id: id, method: method, params: params}
            ws.send(JSON.stringify(req))
            outs[req.id] = {resolve,reject}
            id++
        } else {
            console.error("Websocket closed/closing");
        }
    })

}

ws.onopen = () => {
    for(send in rpc.pending){
        send();
    }
    setInterval(() => {
        if(ws.readyState == 1) ws.send("ping")
    }, 30000);
}

export default {
    rpc: rpc,
    vuex: store => {
        store.$rpc = rpc;
        ws.onmessage = (event) => {
            if(event.data === 'pong') return;
            const resp = JSON.parse(event.data);
            if(resp.id === null){
                const topics = resp.topic.split('/'),
                      topic = topics[0],
                      id    = topics[1],
                      sub_topic = topics[2],
                      sub_id    = topics[3];
                if(store.state[topic] && sub_topic===undefined){
                    store.commit("set_"+topic, resp.result);
                } else {
                    if(!sub_id){
                        store.commit("set_destinations", resp.result)
                    } else {
                        store.commit("push_"+sub_topic, resp.result);
                    }
                }
                if(topic === "user"){
                    store.commit("set_trip_user", resp.result)
                }
            } else if(resp.id === 0) {
                console.log(resp.message)
                if(resp.user){
                    store.commit("set_user", resp.user);
                }
            } else if(outs[resp.id] === undefined) {
                console.error("Could not find response id")
            } else if(resp.error){
                outs[resp.id].reject(resp.error)
            } else {
                outs[resp.id].resolve(resp.result)
            }
        }
    }
}
