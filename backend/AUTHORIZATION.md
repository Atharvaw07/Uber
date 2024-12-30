# Authorization Process

This document outlines the steps and code involved in implementing the authorization process for the Uber backend.

## Step 1: Setting Up Environment Variables

Create a `.env` file in the root directory and add the following environment variables:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

## Step 2: Connecting to the Database

Create a file `db/db.js` to handle the database connection:
```javascript
// filepath: /c:/Users/Atharva/Desktop/Uber/backend/db/db.js
const mongoose = require("mongoose");

function connectToDB() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to DB Successfully");
    })
    .catch((err) => console.log(err));
}

module.exports = connectToDB;
```

## Step 3: Creating User Model

Create a file `models/user-model.js` to define the user schema and methods:
```javascript
// filepath: /c:/Users/Atharva/Desktop/Uber/backend/models/user-model.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "First name must be atleast 3 characters long"],
    },
    lastname: {
      type: String,
      minlength: [3, "First name must be atleast 3 characters long"],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: [5, "Please enter correct email"],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  socketId: {
    type: String,
  },
});

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const userModel = mongoose.model("User", UserSchema);

module.exports = userModel;
```

## Step 4: Creating User Service

Create a file `services/user-service.js` to handle user-related operations:
```javascript
// filepath: /c:/Users/Atharva/Desktop/Uber/backend/services/user-service.js
const userModel = require("../models/user-model");

module.exports.createUser = async ({
  firstname,
  lastname,
  email,
  password,
}) => {
  if (!firstname || !email || !password) {
    throw new Error("All fields are required");
  }

  const user = userModel.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
  });
  return user;
};
```

## Step 5: Creating Middleware for Authentication

Create a file `middlewares/auth-middleware.js` to handle authentication:
```javascript
// filepath: /c:/Users/Atharva/Desktop/Uber/backend/middlewares/auth-middleware.js
const userModel = require("../models/user-model");
const jwt = require("jsonwebtoken");

module.exports.authUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const isBlacklisted = await userModel.findOne({ token: token });

  if(isBlacklisted){
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
```

## Step 6: Creating User Controller

Create a file `controllers/user-controller.js` to handle user-related requests:
```javascript
// filepath: /c:/Users/Atharva/Desktop/Uber/backend/controllers/user-controller.js
const userModel = require("../models/user-model");
const userService = require("../services/user-service");
const { validationResult } = require("express-validator");
const blacklistTokenModel = require("../models/blacklistToken-model");

module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password } = req.body;

  const hashedPassword = await userModel.hashPassword(password);

  const user = await userService.createUser({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashedPassword,
  });

  const token = user.generateAuthToken();

  res.status(201).json({ token, user });
};

module.exports.loginUser = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty) {
    return res.status(400).json({ errors: array() });
  }

  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = user.generateAuthToken();

  res.cookie("token", token);

  res.status(200).json({ message: "User Logged in successfully", token, user });
};

module.exports.getUserProfile = async (req, res, next) => {
  res.status(200).json(req.user);
};

module.exports.logoutUser = async (req, res, next) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];

  await blacklistTokenModel.create({token})

  res.status(200).json({ message: "Logged Out" });
};
```

## Step 7: Creating Routes

Create a file `routes/user-routes.js` to define the user-related routes:
```javascript
// filepath: /c:/Users/Atharva/Desktop/Uber/backend/routes/user-routes.js
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/user-controller");
const authMiddleware = require("../middlewares/auth-middleware");

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 character long"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be atleast 6 character long"),
  ],
  userController.registerUser
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be atleast 6 character long"),
  ],
  userController.loginUser
);

router.get("/profile", authMiddleware.authUser, userController.getUserProfile);

router.get('/logout', authMiddleware.authUser, userController.logoutUser);

module.exports = router;
```

## Step 8: Creating Blacklist Token Model

Create a file `models/blacklistToken-model.js` to define the blacklist token schema:
```javascript
// filepath: /c:/Users/Atharva/Desktop/Uber/backend/models/blacklistToken-model.js
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const blacklistTokenSchema = new Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // 24 hours in seconds
    }
});

module.exports = mongoose.model('BlacklistToken', blacklistTokenSchema);
```

## Step 9: Setting Up the Server

Create a file `server.js` to set up the server:
```javascript
// filepath: /c:/Users/Atharva/Desktop/Uber/backend/server.js
const http = require("http");
const app = require("./app");
const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

## Step 10: Setting Up the Application

Create a file `app.js` to set up the application:
```javascript
// filepath: /c:/Users/Atharva/Desktop/Uber/backend/app.js
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const connectToDB = require("./db/db");
const userRoutes = require("./routes/user-routes");
const cookieParser = require('cookie-parser');

connectToDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extends: true }));
app.use(cookieParser());

app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("hello world");
});

module.exports = app;
```

## Step 11: Documenting the Endpoints

Add documentation for the `/users/login` endpoint in the `README.md` file:
```markdown
# User Login Endpoint

## POST /users/login

### Description
This endpoint is used to log in a user. It requires the user's email and password.

### Request Body
The request body should be a JSON object with the following fields:
- `email`: A string representing the user's email (must be a valid email).
- `password`: A string representing the user's password (minimum 6 characters).

### Example Request
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Responses

#### Success
- **Status Code**: 200 OK
- **Response Body**:
  ```json
  {
    "message": "User Logged in successfully",
    "token": "jwt_token_here",
    "user": {
      "_id": "user_id_here",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com",
      // ...other user fields...
    }
  }
  ```

#### Validation Errors
- **Status Code**: 400 Bad Request
- **Response Body**:
  ```json
  {
    "errors": [
      {
        "msg": "Error message here",
        "param": "field_name",
        "location": "body"
      }
    ]
  }
  ```

#### Invalid Credentials
- **Status Code**: 401 Unauthorized
- **Response Body**:
  ```json
  {
    "message": "Invalid email or password"
  }
  ```

### Notes
- The `password` field is compared with the hashed password stored in the database.
- A JWT token is generated and returned upon successful login.
