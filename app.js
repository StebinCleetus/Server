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

    Jwt.verify(req.body.token, "clockintime", (err, decoded) => {
        if (decoded && decoded.email) {
            let data = new userModel({ userName: req.body.userName, email: req.body.email, password: Bcrypt.hashSync(req.body.password, 10), role: req.body.role })
            data.save();
            res.json({ "Status": "sucessfully added" });
        }
        else {
            res.json({ "Status": "Unauthorised" });
        }
    })



    // console.log(req.body); // to check req.body
    // let data = new userModel({ userName: req.body.userName, email: req.body.email, password: Bcrypt.hashSync(req.body.password, 10),role: req.body.role});
    // await data.save();
    // res.json({ "Status": "success", "Status": data });
})


//..............................................Time Tracker API......................................................

app.post("/timetracker", (req, res) => {
    console.log(req.body);
    let data = new timeTracker({ empmail: req.body.empmail, tproject: req.body.tproject, ttask: req.body.ttask, tstart: req.body.tstart, tend: req.body.tend, tdur: req.body.tdur })
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
app.post("/project", async (req, res) => {
    let data = new project({ pname: req.body.pname });
    await data.save();
    res.json({ "Status": "success", "Status": data });
})

//..............................................Task API......................................................
app.post("/task", async (req, res) => {
    let data = new task({ tname: req.body.tname });
    await data.save();
    res.json({ "Status": "success", "Status": data });
})


app.listen(3001, () => {
    console.log("server running at 3001");
})