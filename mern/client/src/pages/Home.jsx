import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CallToAction from '../components/CallToAction'
import PostCard from '../components/PostCard'

export default function Home() {
  const [posts,setPosts] = useState([]);

  useEffect(()=>{
    const fetchPosts = async ()=>{
      const res = await fetch('/api/post/getPosts');
      const data = await res.json();
      setPosts(data.posts)
    }
    fetchPosts()
  },[])
  return (
    <div>
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xlmx-auto '>
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to{' '}
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500
            to-pink-500 rounded-lg text-white'>
                Sachith's
            </span>
            Blog
        </h1>
        <p>Here you'll find a variety of articles and tutorials on topics such as
          web development, software engineering, and programming languages.</p>
          <Link to='/search' className='text-xs sm:text-sm text-teal-500 font-bold
        hover:underline'>
          View all post
        </Link>
      </div>
      <div className='p-3 bg-amber-100 dark:bg-slate-700 px-12'>
      <CallToAction/>
      </div>

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
            {
              posts && posts.length > 0 && (
                <div className='flex flex-col gap-6'>
                  <h2 className='text-2xl font-semibold text-center'>
                    Recent Posts
                  </h2>
                  <div className='flex flex-wrap gap-4'>
                    {posts.map((post)=>(
                      <PostCard key={post._id} post={post} />
                    ))}
                  </div>
                  <Link to={'/search'} className='text-teal-500 hover:underline text-lg text-center'>
                  View all posts</Link>
                </div>
              )
            }
      </div>
      
    </div>
  )
}
