import { Alert, Button, TextInput } from 'flowbite-react'
import React, { useState,useRef, useEffect} from 'react'
import { useSelector } from 'react-redux'
import {getStorage,ref,uploadBytesResumable, getDownloadURL} from 'firebase/storage'
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart,updateSuccess,updateFailure } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';


export default function DashProfile() {
    const {currentUser} = useSelector(state=>state.user);
    const [imageFile,setImagefile] = useState(null);
    const [imageFileUrl,setImagefileUrl] = useState(null);
    const [imageFileloadProgress,setImageFileUploadProgress] = useState(null);
    const [ImageFileUploadError,setImageFileUploadError] = useState(null);
    const [imageFileUploading,setImageFileUploading] = useState(false)
    const [updateUserSucess,setUpdateUserSucess] = useState(null);
    const [updateUserFailure,setUpdateUserFailure] = useState(null);
    const [formData,setFormData] = useState({})
    const filePickerRef=useRef();
    const dispatch =useDispatch();

    const handleImageChange =(e)=>{
       const file =e.target.files[0];
       if(file){
        setImagefile(file);
        setImagefileUrl(URL.createObjectURL(file));
       }

    };
    useEffect (()=>{
        if(imageFile){
            uploadImage();
        }
    },[imageFile]);
    const uploadImage = async () =>{
        setImageFileUploadError(null);
        setImageFileUploading(true);
       const storage = getStorage(app);
       const fileName = new Date().getTime() + imageFile.name;
       const storageRef = ref(storage,fileName);
       const uploadTask = uploadBytesResumable(storageRef,imageFile);
       uploadTask.on(
        'state_changed',
        (snapshot) =>{
            const progress = 
            (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
            setImageFileUploadProgress(progress.toFixed(0));
        },
        (error) =>{
            setImageFileUploadError('Could not upload image(File must be less than 2MB)');
            setImageFileUploadProgress(null);
            setImagefile(null);
            setImagefileUrl(null);
            setImageFileUploading(false);

        },
        ()=>{
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>{
            setImagefileUrl(downloadURL);
            setFormData({ ...formData,profilePicture: downloadURL });
            setImageFileUploading(false);
           
        }
        )
        }
       )


    }
    const handleChange = (e) =>{
        setFormData({...formData,[e.target.id]:e.target.value})
    };
    
    const handleSubmit = async (e) =>{
        e.preventDefault();
        setUpdateUserFailure(null)
        setUpdateUserSucess(null)
        if(Object.keys(formData).length===0){
            setUpdateUserFailure('No changes made')

            return;
        }
        if(imageFileUploading){
            setUpdateUserFailure('Please wait for image to upload');

            return;
        }
        try{
            dispatch(updateStart());
            const res =await fetch (`/api/user/update/${currentUser._id}`,
        {
            method:'PUT',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(formData),

          }
        );
        const data = await res.json();
        if(!res.ok){
            dispatch(updateFailure(data.message))
            setUpdateUserFailure(data.message)
        }else{
            dispatch(updateSuccess(data));
            setUpdateUserSucess("User's profile updated sucessfully")
        }
        }
        catch(error){
            dispatch(updateFailure(error.message))
            setUpdateUserFailure(error.message)
        }
        
    }
   
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'>
            profile
        </h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden/>
            <div className='relative w-32 h-32 self-center cursor-pointer shadow-md' onClick={()=>
            filePickerRef.current.click()}>
                {imageFileloadProgress && (
                    <CircularProgressbar value={imageFileloadProgress || 0} text={`${imageFileloadProgress}%`}
                    strokeWidth={5}
                    styles={{
                        root:{
                            width:'100%',
                            height:'100%',
                            position:'absolute',
                            top:0,
                            left:0,

                        },
                        path:{
                             stroke: `rgba(62, 152, 199, ${imageFileloadProgress / 100
                  })`,
                        }
                    }}
                    />
                )}

            <img src={imageFileUrl||currentUser.profilePicture} alt='user' className={`rounded-full
           w-full h-full border-8 object-cover border-[lightgray] 
           ${imageFileloadProgress && imageFileloadProgress<100 && 'opacity-60'}`}
            />
            </div>
           {ImageFileUploadError && <Alert color='failure'>
                    {ImageFileUploadError}
            </Alert>}
            <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChange}/>
            <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email} onChange={handleChange}/>
            <TextInput type='password' id='password' placeholder='password' defaultValue={'********'} onChange={handleChange}/>
            <Button type='submit' gradientDuoTone='purpleToBlue' outline>
                Update
            </Button>
        </form>
        <div className='text-red-500 flex justify-between mt-5'>
            <span className='cursor-pointer'>
                Delete Account
            </span>
             <span className='cursor-pointer'>
                Sign Out
            </span>
        </div>
        {updateUserSucess && (<Alert color='success' className='mt-5'>
            {updateUserSucess}
            </Alert>
        )}
        {updateUserFailure && (
            <Alert color='failure' className='mt-5'>
                {updateUserFailure}
            </Alert>
        )}
    </div>
  )
}
