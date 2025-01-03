# User Registration Endpoint

## POST /users/register

### Description
This endpoint is used to register a new user. It requires the user's first name, last name, email, and password.

### Request Body
The request body should be a JSON object with the following fields:
- `fullname`: An object containing:
  - `firstname`: A string representing the user's first name (minimum 3 characters).
  - `lastname`: A string representing the user's last name (optional, minimum 3 characters if provided).
- `email`: A string representing the user's email (must be a valid email).
- `password`: A string representing the user's password (minimum 6 characters).

### Example Request
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Responses

#### Success
- **Status Code**: 201 Created
- **Response Body**:
  ```json
  {
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

#### Missing Fields
- **Status Code**: 400 Bad Request
- **Response Body**:
  ```json
  {
    "message": "All fields are required"
  }
  ```

### Notes
- The `password` field is hashed before storing in the database.
- A JWT token is generated and returned upon successful registration.

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

# User Profile Endpoint

## GET /users/profile

### Description
This endpoint is used to retrieve the profile of the logged-in user. It requires a valid JWT token.

### Request Headers
- `Authorization`: A string containing the JWT token in the format `Bearer <token>`.

### Responses

#### Success
- **Status Code**: 200 OK
- **Response Body**:
  ```json
  {
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

#### Unauthorized
- **Status Code**: 401 Unauthorized
- **Response Body**:
  ```json
  {
    "message": "Unauthorized"
  }
  ```

### Notes
- The JWT token is verified before retrieving the user profile.

# User Logout Endpoint

## POST /users/logout

### Description
This endpoint is used to log out a user. It requires a valid JWT token.

### Request Headers
- `Authorization`: A string containing the JWT token in the format `Bearer <token>`.

### Responses

#### Success
- **Status Code**: 200 OK
- **Response Body**:
  ```json
  {
    "message": "User logged out successfully"
  }
  ```

#### Unauthorized
- **Status Code**: 401 Unauthorized
- **Response Body**:
  ```json
  {
    "message": "Unauthorized"
  }
  ```

### Notes
- The JWT token is invalidated upon successful logout.

# Captain Registration Endpoint

## POST /captains/register

### Description
This endpoint is used to register a new captain. It requires the captain's first name, last name, email, password, and vehicle details.

### Request Body
The request body should be a JSON object with the following fields:
```json
{
  "fullname": {
    "firstname": "Jane", // must be at least 3 characters
    "lastname": "Doe" // must be at least 3 characters
  },
  "email": "jane.doe@example.com", // must be a valid email
  "password": "password123", // must be at least 6 characters
  "vehicle": {
    "color": "red", // must be at least 3 characters
    "plate": "ABC123", // must be at least 3 characters
    "capacity": 4, // must be at least 1
    "vehicleType": "car" // must be one of 'car', 'motorcycle', 'auto'
  }
}
```

### Example Request
```json
{
  "fullname": {
    "firstname": "Jane",
    "lastname": "Doe"
  },
  "email": "jane.doe@example.com",
  "password": "password123",
  "vehicle": {
    "color": "red",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

### Responses

#### Success
- **Status Code**: 201 Created
- **Response Body**:
  ```json
  {
    "token": "jwt_token_here",
    "captain": {
      "_id": "captain_id_here",
      "fullname": {
        "firstname": "Jane",
        "lastname": "Doe"
      },
      "email": "jane.doe@example.com",
      "vehicle": {
        "color": "red",
        "plate": "ABC123",
        "capacity": 4,
        "vehicleType": "car"
      }
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

#### Missing Fields
- **Status Code**: 400 Bad Request
- **Response Body**:
  ```json
  {
    "message": "All fields are required"
  }
  ```

#### Captain Already Exists
- **Status Code**: 400 Bad Request
- **Response Body**:
  ```json
  {
    "message": "Captain already exists"
  }
  ```

### Notes
- The `password` field is hashed before storing in the database.
- A JWT token is generated and returned upon successful registration.

# Captain Login Endpoint

## POST /captains/login

### Description
This endpoint is used to log in a captain. It requires the captain's email and password.

### Request Body
The request body should be a JSON object with the following fields:
```json
{
  "email": "jane.doe@example.com", // must be a valid email
  "password": "password123" // must be at least 6 characters
}
```

### Example Request
```json
{
  "email": "jane.doe@example.com",
  "password": "password123"
}
```

### Responses

#### Success
- **Status Code**: 200 OK
- **Response Body**:
  ```json
  {
    "message": "Captain logged in successfully",
    "token": "jwt_token_here",
    "captain": {
      "_id": "captain_id_here",
      "fullname": {
        "firstname": "Jane",
        "lastname": "Doe"
      },
      "email": "jane.doe@example.com",
      "vehicle": {
        "color": "red",
        "plate": "ABC123",
        "capacity": 4,
        "vehicleType": "car"
      }
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

# Captain Profile Endpoint

## GET /captains/profile

### Description
This endpoint is used to retrieve the profile of the logged-in captain. It requires a valid JWT token.

### Request Headers
- `Authorization`: A string containing the JWT token in the format `Bearer <token>`.

### Responses

#### Success
- **Status Code**: 200 OK
- **Response Body**:
  ```json
  {
    "captain": {
      "_id": "captain_id_here",
      "fullname": {
        "firstname": "Jane",
        "lastname": "Doe"
      },
      "email": "jane.doe@example.com",
      "vehicle": {
        "color": "red",
        "plate": "ABC123",
        "capacity": 4,
        "vehicleType": "car"
      }
    }
  }
  ```

#### Unauthorized
- **Status Code**: 401 Unauthorized
- **Response Body**:
  ```json
  {
    "message": "Unauthorized"
  }
  ```

### Notes
- The JWT token is verified before retrieving the captain profile.

# Captain Logout Endpoint

## POST /captains/logout

### Description
This endpoint is used to log out a captain. It requires a valid JWT token.

### Request Headers
- `Authorization`: A string containing the JWT token in the format `Bearer <token>`.

### Responses

#### Success
- **Status Code**: 200 OK
- **Response Body**:
  ```json
  {
    "message": "Captain logged out successfully"
  }
  ```

#### Unauthorized
- **Status Code**: 401 Unauthorized
- **Response Body**:
  ```json
  {
    "message": "Unauthorized"
  }
  ```

### Notes
- The JWT token is invalidated upon successful logout.
