import axios from 'axios'
import { getToken } from './auth'
import { baseUrl } from '../config.js'

// const baseUrl = '/api'

function headers() {
  return {
    headers: { Authorization: `Bearer ${getToken()}` },
  }
}

//* Post Requests

// .posts

export function getAllPosts() {
  return axios.get(`${baseUrl}/posts`)
}

export function createPost(formdata) {
  return axios.post(`${baseUrl}/posts`, formdata, headers())
}

// .posts.postId

export function getSinglePost(postId) {
  return axios.get(`${baseUrl}/posts/${postId}`)
}

export function editPost(postId, formdata) {
  return axios.put(`${baseUrl}/posts/${postId}`, formdata, headers())
}

export function likePost(postId) {
  return axios.post(`${baseUrl}/posts/${postId}`, null, headers())
}

export function deletePost(postId) {
  return axios.delete(`${baseUrl}/posts/${postId}`, headers())
}



//* Comment Requests

// .posts.postId.comments

export function createComment(postId, formdata) {
  return axios.post(`${baseUrl}/posts/${postId}/comments`, formdata, headers())
}

// .posts.postId.comments.commentId

export function editComment(postId, commentId, formdata) {
  return axios.put(`${baseUrl}/posts/${postId}/comments/${commentId}`, formdata, headers())
}

export function likeComment(postId, commentId) {
  return axios.post(`${baseUrl}/posts/${postId}/comments/${commentId}`, null, headers())
}

export function deleteComment(postId, commentId) {
  return axios.delete(`${baseUrl}/posts/${postId}/comments/${commentId}`, headers())
}

//* User Profile Requests

// .profile

export function getAllUsers() {
  return axios.get(`${baseUrl}/profile`)
}

// .profile.profileId

export function getSingleUser(profileId) {
  return axios.get(`${baseUrl}/profile/${profileId}`)
}

export function editUser(profileId, formdata) {
  return axios.put(`${baseUrl}/profile/${profileId}`, formdata, headers())
}

//* Auth Requests

// .login

export function loginUser(formdata) {
  return axios.post(`${baseUrl}/login`, formdata)
}

// .register

export function registerUser(formdata) {
  return axios.post(`${baseUrl}/register`, formdata)
}




// ! Stretch goals

// export function createFollower(userId, formdata) {
//   return axios.post(`${baseUrl}/profile/${userId}`, formdata, headers())
// }