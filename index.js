import { User } from "./UserSchema.js";
import express, { request, response } from "express";
import cors from 'cors';
import mongoose from "mongoose";
import { DATA_NOT_FOUND, DELETE_SUCCESS, ERROR_MESSAGE, INSERT_SUCCESS, UPDATE_SUCCESS } from './constants.js';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import { Admin } from "./AdminSchema.js";
import { Case } from "./CaselistSchema.js";
import { Detective } from "./DetectivelistSchema.js";
import jwt from 'jsonwebtoken';


//Middleware which is called before the request will proceed..
function verifyToken(request,response,next){
    const header = request.get('Authorization');    
    if (header) {
        const token = header.split(" ")[1];
        jwt.verify(token,"secret1234", (error, payload) => {
            if(error) {
                response.status(StatusCodes.UNAUTHORIZED).send({ message: "Invalid Token" ,token:token});
            }
            else {
                next();
            }
        });
    }
    else {
        response.status(StatusCodes.UNAUTHORIZED).send({ message: "please login first" });
    }
}


const app = express();

app.use(express.json());

app.use(cors());



// ==========================================================================================================
// Detective related apis

app.get('/detectivelist',async (request, response) => {
    try {
        const detectivelist = await Detective.find();
        response.send({ detective: detectivelist });
    } catch (error) {
        response.send({ message: ERROR_MESSAGE });
    }
});




app.get('/detectivelist/:id',async (request, response) => {
    try {
        const dectiveObj = await Detective.findOne({ "id": request.params.id });
        if (dectiveObj == null) {
            response.status(404).send(DATA_NOT_FOUND);
        }
        else {
            response.send({ detective : dectiveObj })
        }
    }
    catch (error) {
        response.status(500).send({ message: ERROR_MESSAGE })
    }
})

app.put('/detectivelist/:id', async (request, response) => {
    try {
        const dectiveObj = await Detective.findOne({ "id": request.params.id });
        if (dectiveObj == null) {
            response.status(404).send(DATA_NOT_FOUND);
        }
        else{
            await Detective.updateOne({ "id": request.params.id }, request.body);
            response.send({ message: UPDATE_SUCCESS });            
        }
    } catch (error) {
        response.send({ message: ERROR_MESSAGE });
    }
})

app.delete('/detectivelist/:id',async (request, response) => {
    try {
        const dectiveObj = await Detective.findOne({ "id": request.params.id });
        if (dectiveObj == null) {
            response.status(404).send(DATA_NOT_FOUND);
        }
        else{
            await Detective.deleteOne({ "id": request.params.id });
            response.send({ message: DELETE_SUCCESS });
        }
    }
    catch (error) {
        response.send({ message: ERROR_MESSAGE });
    }
})


app.post('/detectivelist', async (request, response) => {
    try {
        var reqData = request.body;        
        const detectivelist = new Detective(reqData);
        await detectivelist.save();
        response.send({ message: INSERT_SUCCESS });
    }
    catch (error) {
        response.status(StatusCodes.ERROR_MESSAGE).send({ message: ERROR_MESSAGE });
    }
})




// ======================================================================================================
// case related apis

app.get('/caselist',async (request, response) => {
    try {
        const caselist = await Case.find();
        response.send({ cases: caselist });
    } catch (error) {
        response.send({ message: ERROR_MESSAGE });
    }
});

app.get('/caselist/:id',async (request, response) => {
    try {
        const caseObj = await Case.findOne({ "id": request.params.id });
        if (caseObj == null) {
            response.status(404).send(DATA_NOT_FOUND);
        }
        else {
            response.send({ case: caseObj })
        }
    }
    catch (error) {
        response.status(500).send({ message: ERROR_MESSAGE })
    }
})

app.put('/caselist/:id', async (request, response) => {
    try {
        await Case.updateOne({ "id": request.params.id }, request.body);
        response.send({ message: UPDATE_SUCCESS });
    } catch (error) {
        response.send({ message: ERROR_MESSAGE });
    }
})

app.delete('/caselist/:id',async (request, response) => {
    try {
        await Case.deleteOne({ "id": request.params.id });
        response.send({ message: DELETE_SUCCESS });
    }
    catch (error) {
        response.send({ message: ERROR_MESSAGE });
    }
})


app.post('/caselist', async (request, response) => {
    try {
        var reqData = request.body;
        console.log(reqData);
        const caselist = new Case(reqData);
        await caselist.save();
        response.send({ message: INSERT_SUCCESS });
    }
    catch (error) {
        response.status(StatusCodes.ERROR_MESSAGE).send({ message: ERROR_MESSAGE });
    }
})


// ================================================================================================================
// Admin related API's

app.post("/admin/login", async (request, response) => {
    try {
        const admin = await Admin.findOne({ username: request.body.username });
        if (admin) {
            if (bcrypt.compareSync(request.body.password, admin.password)) {
                //Generate tokken
                const token = jwt.sign({ UserEmail: admin.email }, "secret1234");   
                response.status(StatusCodes.OK).send({ message: "Valid User","token":token}); 
            }
            else {
                response.status(StatusCodes.BAD_REQUEST).send({ message: "Invalid Username or Password" });
            }
        }
        else {
            response.status(StatusCodes.BAD_REQUEST).send({ message: "Invalid Username or Password" });
        }
    } catch (error) {
        response.status(StatusCodes.ERROR_MESSAGE).send({ message: ERROR_MESSAGE });
    }
})


app.post('/admin', async (request, response) => {
    try {
        var reqData = request.body;
        reqData.password = bcrypt.hashSync(reqData.password,10);
        const admin = new Admin(reqData);
        await admin.save();
        response.send({ message: INSERT_SUCCESS });
    }
    catch (error) {
        response.status(StatusCodes.ERROR_MESSAGE).send({ message: ERROR_MESSAGE });
    }
})

app.delete('/admin/:username',async (request, response) => {
    try {
        await User.deleteOne({ "username": request.params.username });
        response.send({ message: DELETE_SUCCESS });
    }
    catch (error) {
        response.send({ message: ERROR_MESSAGE });
    }
})

app.get('/admin', async (request, response) => {
    try {
        const admin = await Admin.find();
        response.send({ admins: admin });
    } catch (error) {
        response.send({ message: ERROR_MESSAGE });
    }
});

// ================================================================================================================
// User related API's


app.post("/user/login", async (request, response) => {
    try {
        const user = await User.findOne({ email: request.body.email});
        if (user) {
            if (bcrypt.compareSync(request.body.password, user.password)) {
                //Generate tokken
                const token = jwt.sign({ UserEmail: user.email }, "secret1234");   
                response.status(StatusCodes.OK).send({ message: "Valid User","token":token}); 
            }
            else {
                response.status(StatusCodes.BAD_REQUEST).send({ message: "Invalid Email or Password" });
            }
        }
        else {
            response.status(StatusCodes.BAD_REQUEST).send({ message: "Invalid Email or Password" });
        }
    } catch (error) {
        response.status(StatusCodes.ERROR_MESSAGE).send({ message: ERROR_MESSAGE });
    }
})


app.post('/user', async (request, response) => {
    try {
        var reqData = request.body;
        reqData.password = bcrypt.hashSync(reqData.password,10);
        const user = new User(reqData);
        await user.save();
        response.send({ message: INSERT_SUCCESS });
    }
    catch (error) {
        response.status(StatusCodes.ERROR_MESSAGE).send({ message: ERROR_MESSAGE });
    }
})

app.delete('/user/:email',async (request, response) => {
    try {
        await User.deleteOne({ "email": request.params.email });
        response.send({ message: DELETE_SUCCESS });
    }
    catch (error) {
        response.send({ message: ERROR_MESSAGE });
    }
})

app.get('/user', async (request, response) => {
    try {
        const user = await User.find();
        response.send({ users: user });
    } catch (error) {
        response.send({ message: ERROR_MESSAGE });
    }
});

const connectDb = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/DetectiveApp');
        console.log("Database connection created...");
    }
    catch (error) {
        console.log(error);
    }
}

app.listen(5600, () => {
    console.log("Server has been started..");
    connectDb();
})

