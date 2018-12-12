const express = require("express");
const app = express();
const dbUser = require("./db.js");
const db = new dbUser("mydb1808");
const bodyparser = require("body-parser");

app.use(bodyparser.urlencoded({extended:false}));

app.listen(8080,()=>{
    console.log("http://localhost:8080 服务")
})
//获取数据
app.get("/getdata",(req,res)=>{
    let obj = req.query;
    db.find("manage",obj,(err,data)=>{
        if(err) throw err;
        res.send(data)
    })
})
app.get("/get",(req,res)=>{
    let obj = req.query;
    db.find("manage",{},(err,data)=>{
        if(err) throw err
        for (let i = 0; i <data[0].list.length ; i++) {
            if(data[0].list[i].type==obj.type){
                res.send(data[0].list[i])
            }
        }
    })
})

//购物车
app.post("/addcar",(req,res)=>{
    let obj = req.body;
    db.count ("shop",{id:obj.id},(err,count)=>{
        if(err) throw err
        if(count==0){
            db.insertOne("shop",obj,(err,data2)=>{
                res.send("ok")
            })
        }else{
            db.find("shop",{query:{id:obj.id}},(err,data3)=>{
                data3.num = obj.num*1+data3[0].num*1
                db.updateOne("shop",{id:obj.id},{num:data3.num},(err,data4)=>{
                    res.send({
                        statusText:"success"
                    })
                })
            })
        }
    })
})
app.post("/jiancar",(req,res)=>{
    let obj = req.body;
    db.find("shop",{query:{id:obj.id}},(err,data3)=>{
        data3.num =data3[0].num*1 - obj.num*1
        db.updateOne("shop",{id:obj.id},{num:data3.num},(err,data4)=>{
            res.send({
                statusText:"success"
            })
        })
    })
})

app.get("/getcar",(req,res)=>{
    db.find("shop",{},(err,data)=>{
        if(err) throw err
        let zong
        let arr = data.map(function(item,index){
             zong = item.price * item.num
            return {item,zong}
        })
        res.send(arr)
    })
})
app.all("*",(req,res)=>{
    res.sendFile(__dirname+req.url)
})

