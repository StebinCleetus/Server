//..............................................initilize modules......................................................
const Express = require("express");
const Cors = require("cors");
const Mongoose = require("mongoose");
const Bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");

//...........................................import schema file.........................................................
const userModel = require("./models/user");
const timeTracker = require("./models/timeTracker")
const project = require("./models/project");
const task = require("./models/task")

//create a variable
const app = Express();

app.use(Express.urlencoded({ extended: true })); //body-parser
app.use(Express.json());                         //body-parser
app.use(Cors());

//.............................................. mongoDB Connection.....................................................
Mongoose.connect("mongodb+srv://test:test@cluster0.clsirok.mongodb.net/ProjectDB?retryWrites=true&w=majority", { useNewUrlParser: true })

//..............................................Sign-In API......................................................
app.post("/signin", (req, res) => {
    let getEmail = req.body.email;
    let password = req.body.password;
    let result = userModel.find({ email: getEmail }, (err, data) => {
        if (data.length > 0) {
            const passwordValidator = Bcrypt.compareSync(password, data[0].password)
            
            if (passwordValidator) {

                if (data[0].role=="admin") {
                    Jwt.sign({ email: getEmail, id: data[0]._id }, "clockintimeadmin", { expiresIn: "1d" },
                    (err, token) => {
                        if (err) {
                            res.json({ "status": "Error", "error": err })
                        }
                        else {
    
                            res.json({ "status": "Sucess", "data": data, "token": token })
                        }
                    }
                )
                
                } else {
                    //token generation for Authentication
                Jwt.sign({ email: getEmail, id: data[0]._id }, "clockintime", { expiresIn: "1d" },
                (err, token) => {
                    if (err) {
                        res.json({ "status": "Error", "error": err })
                    }
                    else {

                        res.json({ "status": "Sucess", "data": data, "token": token })
                    }
                }
            )
                }
                
            } else {
                res.json({ "status": "failed", "data": "Invalid Password" })
            }
        }
        else {
            res.json({ "status": "failed", "data": "Invalid email Id" })
        }
    })
})
//..................................................Sign-In API end......................................................

//..............................................Add employee API Start ......................................................

app.post("/addemployee", async (req, res) => {

    Jwt.verify(req.body.token, "clockintimeadmin", (err, decoded) => {
        if (decoded && decoded.email) {
            let data = new userModel({ userName: req.body.userName, email: req.body.email, password: Bcrypt.hashSync(req.body.password, 10), role: req.body.role })
            data.save();
            res.json({ "Status": "sucessfully added" });
        }
        else {
            res.json({ "Status": "Unauthorised" });
        }
    })

})


//..............................................Time Tracker API......................................................

app.post("/timetracker", (req, res) => {
    console.log(req.body);
    let data = new timeTracker({ empmail: req.body.empmail, tproject: req.body.tproject, ttask: req.body.ttask, tdes:req.body.tdes, tmeth:req.body.tmeth,tstart: req.body.tstart, tend: req.body.tend })
    data.save();
    res.json({ "Status": "sucessfully added" });

    //delete till here.
    // Jwt.verify(req.body.token, "clockintime", (err, decoded) => {
    //     if (decoded && decoded.email) {
    //         let data = new postModel({ userId: req.body.userId, post: req.body.post })
    //         data.save();
    //         res.json({ "Status": "sucessfully added" });
    //     }
    //     else {
    //         res.json({ "Status": "Unauthorised" });
    //     }
    // })
})


//..............................................Project API......................................................
app.post("/project", (req, res) => {
    Jwt.verify(req.body.token, "clockintimeadmin", (err, decoded) => {
        if (decoded && decoded.email) {
            let data = new project({ pname: req.body.pname });
            data.save();
            res.json({ "Status": "sucessfully added" });
        }
        else {
            res.json({ "Status": "Unauthorised" });
        }
    })
})

app.get('/project', (req, res) => {
    project.find((err, data) => {
        if (err) console.log(err);
        else res.json(data);
    });
});

//..............................................Project API end......................................................

//..............................................Task API......................................................
app.post("/task", async (req, res) => {

    Jwt.verify(req.body.token, "clockintimeadmin", (err, decoded) => {
        if (decoded && decoded.email) {
            let data = new task({ tname: req.body.tname });
            data.save();
            res.json({ "Status": "sucessfully added" });
        }
        else {
            res.json({ "Status": "Unauthorised" });
        }
    })
})

app.get('/task', (req, res) => {
    task.find((err, data) => {
        if (err) console.log(err);
        else res.json(data);
    });
});

//..............................................Task API end......................................................


app.listen(3001, () => {
    console.log("server running at 3001");
})