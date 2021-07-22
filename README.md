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

### Approach

At the begining of the project the Team and I began white boarding the layout of user interface. With a fairly well known social media application already out in the world we had a pretty clear idea/goal in mind from the get go which helped with keeping the final products aesthetics clear. Below are screen shots from our whiteboarding session. As we were working in a group of three, we were also introduced to the concept of branching/version control so we all created our own feature branches, and then at the end of the day would pull, push and merge out work. We purposley tried to avoid working on the same components at the same time to help prevent the number of conflicts that my occur. 

### UserCard

We split the various components required for the project between the group and I began to work on the UserCard whilst Bradley and Dan worked on the Login/Authentication and Posts. To begin with I started by creating a useEffect async function to **getSingleUser**. getSingleUser is a function we created in our Lib folder in a file called api.js which handles all of our API endpoint functions for readbality and ease.

```js
export function getSingleUser(profileId) {
  return axios.get(`${baseUrl}/profile/${profileId}`)
}
```

I then passed **userId** as an argument to **getSingleUser** to display a single users profile and in conjunction with **{ useParams }** display the users page. 

```js
  React.useEffect(() => {
    const getData = async () => {
      try {
        const response = await getSingleUser(userId)
        setFormdata(response.data)
      } catch (err) {
        console.log(err)
      }
    }
    getData()
  }, [userId, setFormdata, setFormErrors])

```

The useEffect function is then called everytime wither the userId, setFormData or setFormErrors change as specified in the dependency array.

### UserCard Edit

Using the custom hook we created **useForm** I then created a edit option so that the user could update thier profile image, username and about section. 

```js 
export function useForm(initialFormdata) {
  const [formdata, setFormdata] = React.useState(initialFormdata)
  const [formErrors, setFormErrors] = React.useState(initialFormdata)

  const handleChange = event => {
    setFormdata({ ...formdata, [event.target.name]: event.target.value })
    setFormErrors({ ...formErrors, [event.target.name]: '' })
  }

  return {
    formdata,
    formErrors,
    handleChange,
    setFormErrors,
    setFormdata,
  }
}
```
Using a ternanay expression I then checked to see if the user was authenticated and then owner of the profile to conditionally render the edit button. If the user was authenticated and the profile owner they would then see the edit button. If they were a guest user then, the button would not be displayed and editing would not be accesssible. 

to check if the user is the author I used the **isAuthor** function which we created in our Lib folder in our auth.js file.

```js
export function isAuthor(userId) {
  const payload = getPayload()
  if (!isAuthenticated()) return false
  return payload.userId === userId
}
```

```js
{isAuthor(userId) ?
        <button className="button is-warning" onClick={handleClick}>Edit Profile</button>
        :
        <div />
      }
      <div className={popup}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Create a new post!</p>
            <button onClick={handleClose} className="delete" aria-label="close"></button>
          </header>
          <section className="modal-card-body">
            <div className="field">
              <label className="label" htmlFor>Profile Name</label>
              <div className="control">
                <input
                  className={`input ${formErrors.username ? 'is-danger' : ''}`}
                  type="text"
                  placeholder="Your Profile Name"
                  name="username"
                  onChange={handleChange}
                  value={formdata.username}
                />
```

### Editing the UserCard

To allow the user to edit their profile, I created a **HandleSubmit** function which is an async function that uses our **editUser** function with the userId and formata props as arguments. This is then wrapped in a try catch block to handle errors too. 

```js
const { formdata, setFormdata, formErrors, setFormErrors, handleChange } = useForm({
    username: '',
    image: '',
    summary: '',
  })
```

```js
const handleSubmit = async event => {
    event.preventDefault()
    try {
      await editUser(userId, formdata)
      location.reload()
    } catch (err) {
      setFormErrors(err.response.data.errors)
      console.log(formErrors)
    }
  }
```

### Modal Edit Pop-Up

```js
const [popup, setPopup] = React.useState('modal')
```

If all the conditions were met and the user was the owner of the profile then when the edit button was clicked, a pop up would appear for the user to edit. This is achieved by setting state and creating two functions to handle the click of the button which then in turn changes the className of the div:

```js
 const handleClick = () => { 
    setPopup('modal is-active')
  }
```
```js
 const handleClose = () => {  
    setPopup('modal')
  }
```

```js
<div className={popup}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Create a new post!</p>
            <button onClick={handleClose} className="delete" aria-label="close"></button>
          </header>
          <section className="modal-card-body">
            <div className="field">
              <label className="label" htmlFor>Profile Name</label>
              <div className="control">
                <input
                  className={`input ${formErrors.username ? 'is-danger' : ''}`}
                  type="text"
                  placeholder="Your Profile Name"
                  name="username"
                  onChange={handleChange}
                  value={formdata.username}
                />

```

### Challenges

There were a number of challeges with this project however I felt that one of the main challenges for me personally was understanding the relationship between parent and child components so that props could be passed down successfully and re-used elsewhere. This is still a concept that I feel requires more reading and preactice to be able to confidently implement on future projects. Version control and working on branches also was a challenge and making a decision to use VS Codes integrated Git functionality or the command line was an iteresting process. I used the command line in the end.

### Wins

Working with a great team and being able to contribute to full-stack project in just over a week was the win I am most proud of; having the opportunity to practice and implement all the skills we had newly learned, bouncing our ideas and questions off one another to colletively provide solutions to achieve our end goal. I'm looking forward starting a new full stack project and consolidating my knowledge of the technologies used on this project futher.












 


