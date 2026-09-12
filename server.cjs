const http = require('http');
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname,'dist');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.pdf':'application/pdf','.svg':'image/svg+xml','.png':'image/png','.glb':'model/gltf-binary','.json':'application/json','.txt':'text/plain'};
const port=Number(process.env.PORT||4173);
const base=process.env.BASE_PATH||'';
http.createServer((req,res)=>{let file;try{let url=decodeURIComponent(req.url.split('?')[0]);if(base){if(!url.startsWith(base+'/')){res.writeHead(404);return res.end('Not found');}url=url.slice(base.length);}file=path.resolve(root,'.'+(url==='/'?'/index.html':url));}catch{res.writeHead(400);return res.end();}if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end('Not found');}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Content-Length':data.length,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});res.end(data);});}).listen(port,'127.0.0.1',()=>console.log(`BeaglePlay Explorer is running at http://localhost:${port}${base}/`));
