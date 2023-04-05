# Bank360 API

### The technologies used in creating this project are:
Node.js, ExpressJs, jsonwebtoken, bcryptjs, body-parser Mongoose, and MongoDB

### :rocket: How to get started
- Make sure to have Git, Node.js, testing tool (such as postman) and MongoDB Compass(optional) installed on your computer
- Clone the project by running: `git clone https://github.com/hazeem01/bank360`
- cd into the project
- then cd into the `server` folder and run `npm install`
- create a `.env` file in the server folder and update it using the content in the `.env.example` for guidance.
- run `npm start` to start the project.
- Then, test any of the available routes.
 
These are the HTTP response codes used in this project:
| Status Codes | Indication                                                                                            |
|   ---        | ---                                                                                                   |
|  `200`       | This `success` status code indicates that a request has succeeded and a resource is being fetched  |
|  `201`       | This `OK` status code indicates that a request has succeeded and a new resource is created as a result  |
|  `400`       | This `bad request error` status code indicates that the request sent to the server is incorrect       |
|  `500`       | This `internal server error` status code indicates that something has gone wrong on the web server           |

<hr>

The routes featured in this project:
| API routes(url)       | Method   | Description                                         |
| ---                   | ---      | ---                                                 |
| /api/signup   | `POST`   | SignUp a new user                 |
| /api/login   | `POST`   | SignIn an existing user                 |
| /api/logout   | `Delete`   | Signout an existing user                 |
| /api/reset   | `PATCH`   | Change a user password                 |
| /api/dashboard   | `GEt`   | Get an existing user data                 |

<hr>


👤 **Author**:

| Github  | Linkedin |
| ------------- | ------------- |
| [@hazeem01](https://github.com/Hazeem01) | [Adenekan Abdulhazeem](https://www.linkedin.com/in/abdulhazeem-adenekan) |
