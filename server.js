import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkLink } from './src/link-checker.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(root, 'public');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8'};
const json = (res, status, payload) => { res.writeHead(status, {'content-type':'application/json; charset=utf-8','cache-control':'no-store'}); res.end(JSON.stringify(payload)); };
async function body(req) { const chunks=[]; let size=0; for await (const c of req) { size += c.length; if(size>64_000) throw new Error('Requisição muito grande.'); chunks.push(c); } return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'); }
async function staticFile(urlPath, res) { const rel=urlPath==='/'?'index.html':urlPath.slice(1); const full=path.resolve(publicDir,rel); if(!full.startsWith(publicDir)) return false; try{const data=await fs.readFile(full);res.writeHead(200,{'content-type':types[path.extname(full)]||'application/octet-stream'});res.end(data);return true;}catch(e){if(e.code==='ENOENT')return false;throw e;} }
export function createMarkdownStudioServer({ checker = checkLink } = {}) { return http.createServer(async (req,res)=>{ const url=new URL(req.url,'http://localhost'); try { if(req.method==='GET'&&url.pathname==='/api/health') return json(res,200,{status:'ok',version:'0.1.0'}); if(req.method==='POST'&&url.pathname==='/api/check-links'){const data=await body(req);const links=Array.isArray(data.links)?data.links.slice(0,20):[];const results=[];for(const link of links){if(typeof link!=='string'||!/^https?:\/\//i.test(link)){results.push({url:link,ok:null,status:null,skipped:true});continue;}try{results.push(await checker(link));}catch(error){results.push({url:link,ok:false,status:null,error:error.message});}}return json(res,200,{results});} if((req.method==='GET'||req.method==='HEAD')&&await staticFile(url.pathname,res))return;return json(res,404,{error:'Rota não encontrada.'}); } catch(error){return json(res,400,{error:error.message});} }); }
if(process.argv[1]===fileURLToPath(import.meta.url)){const port=Number(process.env.PORT||3000);const host=process.env.HOST||'0.0.0.0';createMarkdownStudioServer().listen(port,host,()=>console.log(`Markdown Studio em http://${host}:${port}`));}
