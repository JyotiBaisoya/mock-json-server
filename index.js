const fs = require("fs");
const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser")

const server = jsonServer.create();
const router = jsonServer.router("./db.json");

const userdb = JSON.parse(fs.readFileSync("./user.json","utf8"));
const doctordb = JSON.parse(fs.readFileSync("./user.json","utf8"));
server.use(bodyParser.json())

server.use(jsonServer.defaults());

const key = "masai";

function createToken(payload){
    return jwt.sign(payload,key)
}

function isAuthenticated({email,password}){
    let data = userdb.users;
    for(let i=0;i<data.length;i++){
        if(data[i].email==email&& data[i].password==password){
            return true,data[i]
        }
    }
    return false
}



server.post("/user/register",(req,res)=>{
    const {name,email,password,role}=req.body;
    if(isAuthenticated({email,password})){
        res.send("already exist")
        return
    }

    fs.readFile("./user.json",(err,data)=>{
        if(err){
            const status = 401;
            const message = err;
            res.status(status).json({status,message})
            return
        }
        var data = JSON.parse(data.toString());
        var last_id = data.users[data.users.length-1].id;
        console.log(last_id)
        data.users.push({
            "id":last_id+1,
            name:name,
            email:email,
            password:password,role:role
        })

        var writedata = fs.writeFile("./user.json",JSON.stringify(data),(err,result)=>{
            if(err){
                res.send(err)
            }else{
                res.send("registered successfully")
            }
        })
    });
})


server.post("/user/login",(req,res)=>{
    const{email,password} = req.body;
    if(!isAuthenticated({email,password})){
        res.send("please register first")
    }else{
        res.send(isAuthenticated({email,password}))
        // const accesstoken = createToken({email,password})
        // console.log("access_token"+accesstoken);
        // res.send(accesstoken)
    }
})

server.post("/doctor",(req,res)=>{
    const {name,image,specialization,experience,location,date,slots,fees} = req.body
    fs.readFile("./db.json",(err,data)=>{
        if(err){
            const status = 401;
            const message = err;
            res.status(status).json({status,message})
            return
        }

   
    var drdata = JSON.parse(data.toString());
    var lastdr_id = drdata.doctors[drdata.doctors.length-1].id;
    console.log(lastdr_id)
    drdata.doctors.push({
        "id":lastdr_id+1,
        name:name,
        image,specialization,experience,location,date,slots,fees
    })

    var writedata = fs.writeFile("./db.json",JSON.stringify(drdata),(err,result)=>{
        if(err){
            res.send(err)
        }else{
            res.send("registered successfully")
        }
    })
});
})

server.get("/doctor",(req,res)=>{
    fs.readFile("./db.json",(err,data)=>{
        if(err){
            const status = 401;
            const message = err;
            res.status(status).json({status,message})
            return
        }

   
    var drdata = JSON.parse(data.toString());
    res.send(drdata)
});
})

server.use(router);
server.listen(8000,()=>{
    console.log("running server")
})

