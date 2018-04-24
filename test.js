/**
 * Created by lenovo on 2017/3/29.
 */
var fs=require('fs');
/*function read(callback) {
    fs.readFile('./book.json','utf8',function (err,data) {
        if(err || data==''){
            callback([])
        }else{
            callback(JSON.parse(data))
        }
    })
}
read(function (data) {
    console.log(data)
})*/
function write(data,callback) {
    fs.writeFile('./book.json',JSON.stringify(data),callback)
}
write({name:1},function () {
    console.log('写入成功')
})