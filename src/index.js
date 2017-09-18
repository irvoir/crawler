const Koa = require('koa');
const body = require('koa-better-body');
const unless = require('koa-unless');
const cors = require('kcors');
const json = require('koa-json');
const morgan = require('koa-morgan');
const requ = require('./request');
const linku = require('./requestLinks');
const start = Date.now();
const $ = new Koa();

$
  .use(cors())
  .use(morgan('dev'))
  .use(json())
  .use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time-was', `${ms}ms`);
  })
  .use(async (ctx, next) => {
    ctx.status = 404;
    ctx.body = { message: 'Error', code: ctx.status };
    await next();
  })
  .use(async (ctx, next) => {
    if (ctx.url.match(/^\/crawler/)) {
      ctx.status = 200;
      let url = ctx.req.headers.web, depth = ctx.req.headers.dep, message, code, con, link;
      if (depth == 0) {
        con = await requ(url)
        if (typeof con === 'string') {
          ctx.status = 504;
          ctx.body = { message: 'Error', code: ctx.status }
        } else {
          ctx.body = { message: message, code: ctx.status, content: con }
        }
      } else if (depth == 1) {
        let results = [], links = new Array, original = new Array, final = new Array;
        let linkTime;
        links = await linku(url);
        linkTime = links[0];
        links = links.filter(item => item !== linkTime);
        original = [await requ(url)];
        results = [await requ(links[0]), await requ(links[1]), await requ(links[2])];
        final = [...original, ...results, [linkTime]];
        ctx.body = { message: 'Depth[2]', code: ctx.status, content: final }
      }
    }
    await next();
  })
  .on('error', (error, ctx) => {
    console.error(error, ctx);
    ctx.status = 404;
    ctx.body = {
      message: 'Error', code: ctx.status, content: error
    }
  })
  .listen('8000', "0.0.0.0", () => {
    process.stdout.write('\x1bc');
    console.log('Koa is listening on port 8080; Time: ' + new Date());
  });
