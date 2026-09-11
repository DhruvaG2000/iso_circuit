const http = require('http');
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname,'dist');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.pdf':'application/pdf','.svg':'image/svg+xml'};
http.createServer((req,res)=>{let file;try{file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]==='/'?'/index.html':req.url.split('?')[0]));}catch{res.writeHead(400);return res.end();}if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end('Not found');}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(data);});}).listen(4173,'127.0.0.1',()=>console.log('Nano Atlas is running at http://localhost:4173'));
