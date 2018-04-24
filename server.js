/**
 * Created by lenovo on 2017/3/29.
 */
const http=require('http');
const  fs=require('fs');
const mime=require('mime');
const url=require('url');
function readBooks(callback) {
    fs.readFile('./book.json','utf8',function (err,data) {
            if(err || data==''){
                callback([])
            }else{
                callback(JSON.parse(data))
            }
    })
}
function writeBooks(data,callback) {
    fs.writeFile('./book.json',JSON.stringify(data),callback)
}
http.createServer(function (req,res) {
    let {pathname,query}=url.parse(req.url,true);
    if(pathname=='/'){
        res.setHeader('Content-Type','text/html;charset=utf8');
        fs.createReadStream('index.html').pipe(res);
    }else if(/^\/book(\/(\d+))?$/.test(pathname)){
        var id=/^\/book(?:\/(\d+))?$/.exec(pathname)[1];
        console.log(id)
        switch (req.method){
            case 'GET':
                if(id){
                    readBooks(function (book) {
                        var b= book.find(function (item) {
                           return item.id==id;
                        });
                         res.end(JSON.stringify(b))
                    })
                }else{
                    readBooks(function (data) {
                        res.end(JSON.stringify(data));
                    })
                }
                break;
            case 'POST':
                var str='';
                req.on('data',function (data) {
                    str+=data;
                });
                req.on('end',function () {
                    var obj=JSON.parse(str);
                   readBooks(function (book) {
                       obj.id=book.length?book[book.length-1].id+1:1;
                       book.push(obj);
                       writeBooks(book,function () {
                           res.end(JSON.stringify(obj))
                       })
                   })
                })
                break;
            case 'PUT':
                if(id){
                    var str='';
                    req.on('data',function (data) {
                        str+=data;
                    });
                    req.on('end',function () {
                        var obj=JSON.parse(str);
                        readBooks(function (data) {
                            data=data.map(function (item) {
                                if(item.id==id){
                                    return obj
                                }else{
                                    return item;
                                }
                            })
                            writeBooks(data,function () {
                                res.end(JSON.stringify(obj))
                            })
                        })
                    })
                }
                break;
            case 'DELETE':
                if(id){
                    readBooks(function (data) {
                        data=data.filter(function (item) {
                            return item.id!=id;
                        });
                        writeBooks(data,function () {
                            res.end(JSON.stringify({}))
                        })
                    })
                }

                break;
        }
    }else{
        fs.exists('.'+pathname,function (flag) {
            if(flag){
                res.setHeader('Content-Type',mime.lookup(pathname)+';charset=utf8');
                fs.createReadStream('.'+pathname).pipe(res);
            }else{
                res.statusCode=404;
                res.end('not found');
            }
        })
    }
}).listen(2000)