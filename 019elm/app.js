const express = require("express");
const app = express();
const Db = require("./db.js")
const db = new Db("mydb1808");
const bodyparser = require("body-parser");

app.use(bodyparser.urlencoded({extended:false}))
app.use(express.static("./"));

app.listen(8080,()=>{
    console.log("http://localhost:8080  启动")
})

app.get("/getdata",(req,res)=>{
    let arr=[]
    db.find("elm",{},(err,data1)=>{
        if(err) throw err
        arr = data1
        let arr1 = data1.map(function(item,index){
            let id = item._id.toString();
            return new Promise((resolve,reject)=>{
                db.find("elmcar",{query:{shopId:id}},(err,data2)=>{
                    if(err){
                        reject(err)
                    }else{
                        resolve(data2)
                    }
                })
            })
        })
        Promise.all(arr1).then(res1=>{
            let znum=0;
            let zong=0;
            for (var i = 0; i < arr.length; i++) {
                arr[i].children = res1[i]
                znum += res1[i][0].num*1
                zong += arr[i].shopPrice*res1[i][0].num
            }
            res.send({
                arr,
                znum,
                zong
            })
        })
    })
})

app.post("/addnum",(req,res)=> {
    let obj = req.body;
    db.find("elmcar", {query: {shopId: obj.id}}, (err, count) => {
        if (err) throw err
        if (count.length > 0) {
            db.updateOne("elmcar", {shopId: obj.id}, {num: obj.num}, (err, data) => {
                if (err) throw err
                res.send("ok")
            })
        } else {
            db.insertOne("elmcar", obj, (err, data) => {
                if (err) throw err
                res.send("ok")
            })
        }
    })
})


// elm[{
//     shopName:"粥",
//     shopPrice:"8",
//     shopImg: "jcc.png"
// },{
//     shopName:"美食",
//     shopPrice:"14",
//     shopImg:"lc.png"
// }]
// elmcar[{
//     shopId:"5c1203d4ebc07a112430da47",
//     num:"2"
// },{
//     shopId:"5c1203d4ebc07a112430da48",
//     num:"2"
// }]