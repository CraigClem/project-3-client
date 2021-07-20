# Project 3 - PEEK Social Media. 

## Brief

This was our third project during the General Assembely Bootcamp where we were placed into groups of three and given the task to create a MERN fullstack App in one week which used:
 * An Express API to serve our data from our Mongo database
 * Consume our API with a seperate front-end built with React
 * Be a complete product with CRUD functionality for at least a couple of models

## Technologies

### Back-end
  * Express
  * MongoDB
  * Node.js
### Front-end 
  * CSS3 
  * SASS
  * HTML5
  * JavaScript(ES6)
  * React.js
  * Google Fonts
  * Bulma 
### Dependencies
  * Axios
  * bcrypt
  * JSONWebToken 
  * Mongoose-unique-validator 
  * npm 
  * react-router-dom 
### Development Tools 
  * Git + GitHub
  * Heroku 
  * Netlify 
  * VS Code

### Contributers
  * Bradley Bernard 
  * Dan Fullerton

## Approach

As a group we started to discuss a number of ideas that we felt would be challenging however also help consolidate the concepts and fundementals we had recenlty learned in lesson. After considering various ideas we set out our approach to create a basic social media appliation where users could sign up, create a profile and make posts, which could be edited, commented on and liked. We then started to work on our wireframe for the front-end layout and design.


## Backend

With the front-end wireframe complete we began to work on setting up the back-end. 

* ### Models

We created three Schemas for the app; one for the User, Posts and Comments (comments is embedded within the post model) which we used to define the Object fields and Data types required for a valid Object. To manage the relationships between data along with interacting with our MongoDB database we used Mongoose for our Object Data Model.

```js
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, required: false },
  summary: { type: String },
  peekcoin: { type: Number },
})

```

```js
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  image: { type: String },
  userlikes: { type: [String], required: false },
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  comments: [commentSchema],
})
```

```js 
const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
})
```

Once the inital schemas had been setup we then used Mongoose; Bycrpt, Unique validator and Hidden to secure the users details by encrypting, salting and hidding their password.

```js

userSchema.pre('save', function encryptPassword(next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync())
  }
  next()
})

userSchema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compareSync(password, this.password)
}

userSchema
  .virtual('passwordConfirmation')
  .set(function setPasswordConfirmation(passwordConfirmation) {
    this._passwordConfirmation = passwordConfirmation
  })

userSchema
  .pre('validate', function checkPassword(next) {
    if (this.isModified('password') && (this.password !== this._passwordConfirmation)) {
      this.invalidate('passwordConfirmation', 'should match password')
    }
    next()
  })

userSchema.plugin(mongooseUniqueValidator)
userSchema.plugin(mongooseHidden({ defaultHidden: { password: true, email: true, _id: false } }))

export default mongoose.model('User', userSchema)

```

## Routes and Controllers 

Once our Schema's had been setup we began working on the end points for our API to support CRUD functionality with Express and defining the required secure routes from our middleware.

* GET, POST, PUT, DELETE requests

```js
const router = express.Router()

// * Post

router.route('/posts')
  .get(postController.index)
  .post(secureRoute, postController.createPost)

router.route('/posts/:postId')
  .get(postController.show)
  .put(secureRoute, postController.updatePost)
  .post(secureRoute, postController.likePost)
  .delete(secureRoute, postController.removePost)

// * Comments

router.route('/posts/:postId/comments')
  .post(secureRoute, commentController.createComment)

router.route('/posts/:postId/comments/:commentId')
  .put(secureRoute, commentController.updateComment)
  .post(secureRoute, commentController.likeComment)
  .delete(secureRoute, commentController.removeComment)

// * User Profiles

router.route('/profile')
  .get(userController.indexProfiles)

router.route('/profile/:profileId')
  .put(secureRoute, userController.updateProfile)
  .get(userController.showProfile)

// * Auth

router.route('/login')
  .post(userController.login)

router.route('/register')
  .post(userController.register)
```

Below shows the controller for creating a post which is an async function that takes three arguments (request, response and next). The code is wrapped in a try catch block and the error responses are defined within the errorHandler file from our middleware folder. 

```js
async function createPost(req, res, next) {
  console.log('Create Post Start...')
  req.body.user = req.currentUser
  try {
    const newPost = await Post.create(req.body)
    res.status(201).json(newPost)
  } catch (e) {
    next(e)
  }
}
```

ErrorHandler.js examples implemented to help identify the differnet types of errors the back-end might encounter when requests are being made. 

```js
if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid parameter given' })
  }

  if (err.name === 'NotFound') {
    return res.status(404).json({ message: 'Not Found' })
  }

  if (err.name === 'NotValid') {
    return res.status(400).json({ message: 'There was a problem.' })
  }

  if (err.name === 'ValidationError') {
    const errors = {}

```

With the back-end end setup, we beagn to work on the front-end using React as our JavaScript library.

## Front-end 




 


