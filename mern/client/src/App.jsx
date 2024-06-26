import { BrowserRouter,Routes,Route } from 'react-router-dom'

import React from 'react'
import Home from './pages/Home'
import About from './pages/About'
import SingUp from './pages/SingUp'
import Dashboard from './pages/Dashboard'
import Project from './pages/Project'
import Signin from './pages/SighIn'
import Header from './components/Header'
import Footer from './components/Footer'
import PrivateRoute from './components/privateRoute'
import OnlyAdminPrivateRoute from './components/onlyAdminPrivateRoute'
import CreatePost from './pages/createPost'
import UpdatePost from './pages/UpdatePost'
import PostPage from './pages/PostPage'
import ScrollTop from './components/ScrollTop'
import Search from './pages/Search'
import CreateAdd from './pages/CreateAdd'
<<<<<<< HEAD
import AddPage from './pages/AddPage'
import UpdateAdd from './pages/UpdateAdd'
=======
>>>>>>> d2c6f2f79b7fa69cc9136d1260fc91ab80838533

export default function App() {
  return (
    <BrowserRouter >
      <ScrollTop/>
    <Header/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<Signin/>} />
        <Route path="/sign-up" element={<SingUp/>} />
        <Route path="/search" element={<Search/>} />
        <Route element = {<PrivateRoute/>}>
        <Route path="/dashboard" element={<Dashboard/>} />
        </Route>

        <Route element = {<OnlyAdminPrivateRoute/>}>
        <Route path="/Create-post" element={<CreatePost/>} />
        <Route path="/update-post/:postId" element={<UpdatePost/>} />
        <Route path="/create-add" element={<CreateAdd/>} />
<<<<<<< HEAD
        <Route path="/update-add/:addId" element={<UpdateAdd/>} />
=======
>>>>>>> d2c6f2f79b7fa69cc9136d1260fc91ab80838533
        </Route>
        
        <Route path="/Project" element={<Project/>} />
        <Route path="/post/:postSlug" element={<PostPage/>} />
        <Route path="/add/:addSlug" element={<AddPage/>} />
        
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}
