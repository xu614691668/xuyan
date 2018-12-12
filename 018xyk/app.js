const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const Db = require("./db.js");
const db = new Db("mydb1808");

app.use(bodyparser.urlencoded({extended:false}))
app.listen(8080,()=>{
    console.log("http:127.0.0.1:8080 开启")
})

app.post("/add",(req,res)=>{
    let obj = req.body;
    db.find("xyk",{query:{content:obj.content}},(err,data1)=>{
        if(err) throw err
        if(data1.length==0){
            db.insertOne("xyk",obj,(err,data)=>{
                if(err) throw err
                res.send("ok")
            })
        }else{
            res.send("重复添加")
        }
    })
})

app.get("/get",(req,res)=>{
    let obj = req.query;
    console.log(obj)
    db.find("xyk",{},(err,data)=>{
        console.log(data)
        if(err) throw err
        let arr = [];
        let arrIndex = [];
        if(data.length>8){
            if(arr.length<8){
                for (let i = 0; i < data.length; i++) {
                    let index = suiji(data.length,0);
                    if(arrIndex.indexOf(index) == -1){
                        arrIndex.push(index)
                        arr.push(data[index])
                    }
                }
            }
        }else{
            arr = data
        }
        console.log(arrIndex)
        console.log(arr)
        res.send(arr)
    })
})

app.post("/del",(req,res)=>{
    let obj = req.body;
    db.deleteById("xyk",obj.id,(err,data)=>{
        if(err) throw err
        res.send(data)
    })
})

app.post("/dui",(req,res)=>{
    let obj = req.body;
    console.log(obj)
    db.findById("xyk",obj._id,(err,data)=>{
        if(err) throw err
        console.log("data",data)
        data.color = 1;
        console.log("data1",data)
        db.updateById("xyk",obj._id,{color:data.color},(err,data)=>{
            if(err) throw err
            res.send("ok")
        })
    })
})

function suiji(max,min){
    return parseInt(Math.random()*(max-min)+min)
}
app.all("*",(req,res)=>{
    res.sendFile(__dirname+req.url)
})