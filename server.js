//NPM
const Koa = require('koa');
const files = require('koa-serve-static');
const ws = require('koa-websocket')
const fs = require('fs');

//Local
const rpc = require('./lib/rpc')
const broadcast = require('./lib/broadcast')

//Create app
const app = ws(new Koa())
//Attach to the context
app.context.rpc = rpc
app.context.broadcast = broadcast

//------If dev mode run this--------
if(process.env.NODE_ENV === 'development'){
    const webpack = require('koa-webpack');
    app.use(webpack({
        dev: {
            noInfo: true
        }
    }));
}
//---------------------------------

app.use(async (ctx, next) => {
    if(!ctx.url.split('?')[0].match(/\./)) {
        ctx.body = fs.createReadStream('./index.html')
        ctx.set('content-type', 'html')
    } else await next();
})

//Static File handler
app.use(files('./'))

//Websocket middleware, set up rpc on socket
app.ws.use(async ctx => {
    const welcome = {
        jsonrpc: "2.0",
        id: 0,
        message: "Welcome"
    }

    const cookie = ctx.cookies.get('my-app.cookie');
    if(cookie) welcome.user = ctx.websocket.user = await ctx.rpc._auth({cookie}, ctx);

    ctx.websocket.send(JSON.stringify(welcome))

    ctx.websocket.on('message', async message => {
        if(message === 'ping') ctx.websocket.send("pong")
        else {
        const rpc = JSON.parse(message)
        console.log("Rpc call: "+ rpc.method);
        [result,topic] = await ctx.rpc[rpc.method](rpc.params, ctx)

        const resp = {jsonrpc: "2.0", id: rpc.id, result: result}

        //Respond with request
        ctx.websocket.send(JSON.stringify(resp))

        //Tell everyone about it
        resp.id = null;
        resp.topic = topic;
        ctx.broadcast.emit(topic, JSON.stringify(resp))
    }});

    ctx.websocket.on('close', () => {
        ctx.broadcast.deregister(ctx.websocket);

        console.log('disconnected');
    });
})

//Run app
const port = process.env.PORT || 8888

app.listen(port, () => {
    console.log("Listening on "+port)
})
