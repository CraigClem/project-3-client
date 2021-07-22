import React from 'react'
import { useParams } from 'react-router-dom'
import { isAuthor } from '../../lib/auth'
import { getSingleUser, editUser } from '../../lib/api'
import { useForm } from '../../hooks/useForm'


function UserCard() {

  const { userId } = useParams()
  const [popup, setPopup] = React.useState('modal')
  const { formdata, setFormdata, formErrors, setFormErrors, handleChange } = useForm({
    username: '',
    image: '',
    summary: '',
  })
  // const history = useHistory()
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

  const handleClick = () => { 
    setPopup('modal is-active')
  }

  const handleClose = () => {  
    setPopup('modal')
  }

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


  if (!formdata) return null
  return (
    <div className="user-card">
      <div className="card-image">
        <figure className="image-container">
          <img className="profile-image is-rounded" src={formdata.image} alt={formdata.username} />
        </figure>
      </div>
      <div className="content">
        <p className="username">{formdata.username}</p>
        <p className="summary">{formdata.summary}</p>
        <p className="peekcoins">Peek Coins : {formdata.peekcoin}</p>
      </div>
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

              </div>
              {formErrors.username && (
                <small className="help is-danger">Username is required</small>
              )}
            </div>

            <div className="field">
              <label className="label"> Profile Picture </label>
              <div className="control">
                <input
                  className={`input ${formErrors.image ? 'is-danger' : ''}`}
                  type="text"
                  placeholder="Image Url..."
                  name="image"
                  onChange={handleChange}
                  value={formdata.image}
                />
              </div>

            </div>

            <div className="field">
              <label className="label">Summary</label>
              <div className="control">
                <textarea
                  className={`input ${formErrors.summary ? 'is-danger' : ''}`}
                  type="text"
                  placeholder="About you..."
                  name="summary"
                  onChange={handleChange}
                  value={formdata.summary}
                />
              </div>
            </div>

            <button
              onClick={handleClose}
              className="button is-danger"
              aria-label="close" >Cancel</button>
            <button className="button"
              type="submit"
              onClick={handleSubmit}
            > Update Profile</button>
          </section>
        </div>
      </div>
    </div>


  )
}

export default UserCard