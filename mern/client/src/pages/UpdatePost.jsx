import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {getDownloadURL, getStorage, uploadBytesResumable,ref} from 'firebase/storage'
import {app} from '../firebase'
import   {CircularProgressbar} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate,useParams } from 'react-router-dom';
import {useSelector} from 'react-redux'


export default function UpdatePost() {
  const [file,setFile] = useState(null);
  const [imageUploadProgress,setImageUploadProgress] = useState(null);
  const [imageUploadProgressFailure,setImageUploadFailure] = useState(null);
  const [formData,setFormData] = useState({});
  const [publishError,setPublishError] = useState(null);
  const navigate = useNavigate();
  const {postId}=useParams();
  const {currentUser}= useSelector((state)=>state.user)

  useEffect(() =>{
    try{
        const fetchPost = async ()=>{
            const res=await fetch(`/api/post/getposts?postId=${postId}`);
            const data=await res.json();
            
<<<<<<< HEAD
=======
            
>>>>>>> d2c6f2f79b7fa69cc9136d1260fc91ab80838533
            if(!res.ok){
                console.log(data.message);
                setPublishError(data.message)
                return;
            }
            if(res.ok && data.posts && data.posts.length > 0){
                setPublishError(null);
                setFormData(data.posts[0]);
                
            }
            
        }
        fetchPost();

    }
    catch(error){
        console.log(error.message)
    }
},[postId]);

 
  const handleUploadImage = async()=>{
    try{
      if(!file){
        setImageUploadFailure('Please select an image')
        return ;
      }
      setImageUploadFailure(null);
      const storage=getStorage(app);
      const fileName = new Date().getTime()+'-'+file.name;
      const storageRef = ref(storage,fileName);
      const uploadTask = uploadBytesResumable(storageRef,file);
      uploadTask.on(
        'state_changed',
        (snapshot) =>{
          const progress = 
          (snapshot.bytesTransferred/snapshot.totalBytes) *100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) =>{
          setImageUploadFailure('Image upload fial')
          setImageUploadProgress(null);
        },
        ()=>{
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
        {
          setImageUploadProgress(null);
          setImageUploadFailure(null);
          setFormData({...formData,image:downloadURL});
        });

      }
      )

    }
    catch(error){
      console.log(error);
      setImageUploadFailure("Image upload Failed")
      setImageUploadProgress(null);
      console.log(error);
    }

  };
  const handleSubmit = async (e) =>{
    e.preventDefault();
    try{
      const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`,{
        method:'PUT',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(formData),
      });
      const data = await res.json();
      if(!res.ok){
        setPublishError(data.message);
        return;
      }
     
      if(res.ok){
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    }
    catch(error){
      setPublishError('something went wrong')
    }
  };
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl font-semibold'>
        Update a Post
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput type='text' placeholder='Title' required id='title'
          className='flex-1'
          onChange={(e) =>
            setFormData({
              ...formData,title:e.target.value
            })
          }  value={formData.title}
          />
          <Select
          onChange={(e) =>
            setFormData({
              ...formData,category:e.target.value
            })
          }value={formData.category}>
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="react.js">React.js</option>
            <option value="next.js">Next.js</option>
            <option value="node.js">node.js</option>
            <option value="dart">Dart</option>
          </Select>

        </div>
        <div className='flex gap-4 items-center justify-between border-4
        border-teal-500 border-dotted p-3'
        >
          <FileInput type="file" accept='image/*' onChange={(e) => setFile(e.target.files[0])}/>
          <Button type='button' gradientDuoTone='purpleToBlue' size='sm' outline onClick={handleUploadImage} disabled={imageUploadProgress}>
           {
            imageUploadProgress  ? (<div>
              <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress||0}%`}/>
            </div>):('Upload image')
           }
          </Button>
        </div>
        {imageUploadProgressFailure &&(
          <Alert color='failure'>
            {imageUploadProgressFailure}
          </Alert>
        )}
        {formData.image && (
          <img
          src={formData.image}
          alt='upload'
          className='w-full h-72 object-cover'
          />
        )
        } 
        <ReactQuill theme='snow'placeholder='Write something...' className='h-72 mb-12' required
        onChange={(value) =>{
          setFormData({...formData,content:value})
        }}
        />
        <Button type='submit' gradientDuoTone='purpleToPink' >
          Update
        </Button>
        {publishError && <Alert color='failure'>{
          publishError
        }</Alert>}
      </form>
    </div>
  )
}
