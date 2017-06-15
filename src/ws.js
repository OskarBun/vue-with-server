// JS Imports
// ––


// build ws url
const loc = window.location
let address = ""
if (loc.protocol === "https:") address = "wss:"
else address = "ws:"
address += "//" + loc.host

// create queue and request ids
let id = 1
const outs = {}
const pending = []

// define request rate for ping/intervals
const PING_RATE = 30000
const CONN_RATE = 60000

// track connection attempts
let attempts = 0
const gen_interval = (iterations) => {
    // generate a random interval, truncating it to a max out at the defined rate
    return Math.min(CONN_RATE,(Math.pow(2, iterations) - 1) * 1000)
}

// create websocket
var ws = new WebSocket(address)

// define ping callback
let ping = null
const send_ping = () => ws.send("ping")

// send and track requests by id
const track_send = (resolve, reject, request_data) => {
    ws.send(JSON.stringify(request_data))
    outs[request_data.id] = {resolve,reject}
    id++
}

// setup connection handler
ws.onopen = () => {
    // set attempts
    attempts = 1
    console.log("[WS] Connection established.")

    // send all pending rpcs
    for(send in rpc.pending) send()

    // begin keepalive ping (30sec)
    ping = setInterval(send_ping, PING_RATE)
}

// setup close handler
ws.onclose = () => {
    // clear keepalive ping
    clearInterval(ping)

    // get handlers
    const open = ws.onopen
    const close = ws.onclose
    const message = ws.onmessage

    // get reconnect interval
    let interval = gen_interval(attempts)

    // connect callback
    const connect = () => {
        // begin attempt
        attempts++

        // open new connection
        ws = new WebSocket(address)

        // copy handlers
        ws.onopen = open
        ws.onclose = close
        ws.onmessage = message
    }

    // attempt to reconnect after interval has passed
    console.log("[WS] Attempting to establish connection in "+interval/1000+"s")
    setTimeout(connect, interval)
}

// setup rpc message handler
const rpc = (method, params) => {
    // send all requests as promises
    return new Promise((resolve, reject) => {
        // prepare payload
        const data = {jsonrpc: "2.0", id: id, method: method, params: params}

        // check socket is ready to send
        if(ws.readyState == 1) {
            // send now
            track_send(resolve, reject, data)
            console.log("[WS] Sending rpc " +method+ " to server.")
        }
        else {
            // push to queue
            pending.push(() => track_send(resolve, reject, data))
            console.log("[WS] Adding rpc " +method+ " to ws queue.")
        }
    })
}

// setup vuex control
let vuex_ws = store => {
    // add rpc to store
    store.$rpc = rpc

    // setup response handler
    ws.onmessage = (event) => {
        // ignore returning pings
        if(event.data === 'pong') return

        // parse response data
        const resp = JSON.parse(event.data)

        // handle broadcasts (no id)
        if(resp.id === null) {
            // split topic string
            const topics = resp.topic.split('/')
            // update data for topic
            // ...
        }
        // handle initial response
        else if(resp.id === 0) {
            // set user in store
            if(resp.user) store.commit("set_user", resp.user)
        }
        // missing request id
        else if(outs[resp.id] === undefined) {
            // could not find request to match response
            console.error("[WS] Could not match response id!")
        }
        // handle error for request
        else if(resp.error) {
            outs[resp.id].reject(resp.error)
        }
        // pass to promise rsolution
        else {
            outs[resp.id].resolve(resp.result)
        }
    }
}

// export websocket for use in app
export { rpc, vuex_ws }
