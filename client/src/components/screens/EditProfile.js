import React, { useEffect, useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import {UserContext} from '../../App'
import M from 'materialize-css'
import { SmallLoader, BigLoader } from '../preloader'

function EditProfile() {
    const history = useHistory()
    const {state,dispatch} = useContext(UserContext)
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [imgUrl, setImgUrl] = useState("");
    const [image, setImage] = useState("")
    const [uploadUrl, setUploadUrl] = useState("");
    const [Loading, setLoading] = useState(false)
    useEffect(() => {
        if(state){
            setUsername(state.name)
            setEmail(state.email)
            setImgUrl(state.profilePic)
        }
    }, [state])
    const updateProfile = (url) =>{
        fetch(`/editProfile`,{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization" :"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                username,
                email,
                profilePic:url
            })
        }).then(res=>res.json())
        .then(data => {
            localStorage.setItem("user",JSON.stringify(data))
            dispatch({type:"USER",payload:data})
            if(data.error){
                M.toast({html:data.error, classes:'#ff5252 red accent-2'}) 
            }else{
                M.toast({html:"Profile updated Successfully", classes:'#69f0ae green accent-2'})
                history.push('/profile')
                setLoading(false)
            }
        })
        .catch(err => {
            console.log(err)
        })
    }
    const postData = () => {
        setLoading(true)
        if(image){const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","insta-clone")
        data.append("cloud_name","dhhb3z0nt")
        M.toast({html:"wait posting......<br />Don't perform any activities"})
        fetch("	https://api.cloudinary.com/v1_1/dhhb3z0nt/image/upload",{
            method:"post",
            body:data
        })
        .then(res => res.json())
        .then(data=>{
            setUploadUrl(data.url)
            updateProfile(data.url)
        })
        .catch(err=>{
            console.log(err)
        })}
        if(!image){
            fetch(`/editProfile`,{
                method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization" :"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    username,
                    email,
                    profilePic:state.profilePic
                })
            }).then(res=>res.json())
            .then(data => {
                localStorage.setItem("user",JSON.stringify(data))
                dispatch({type:"USER",payload:data})
                if(data.error){
                    M.toast({html:data.error, classes:'#ff5252 red accent-2'}) 
                }else{
                    M.toast({html:"Profile updated Successfully", classes:'#69f0ae green accent-2'})
                    history.push('/profile')
                    setLoading(false)
                }
            })
            .catch(err => {
                console.log(err)
            })
        }
    }
    const deleteDP = () => {
        setLoading(true)
        fetch(`/deleteDP`,{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization" :"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(data => {
            localStorage.setItem("user",JSON.stringify(data))
            dispatch({type:"USER",payload:data})
            if(data.error){
                M.toast({html:data.error, classes:'#ff5252 red accent-2'}) 
            }else{
                M.toast({html:"Profile updated Successfully", classes:'#69f0ae green accent-2'})
                history.push('/profile')
                setLoading(false)
            }
        })
        .catch(err => {
            console.log(err)
        })
    }
    return (
        <div className='myCard'>
            {state?
                <div className='card auth-card input-field'>
                    {Loading? 
                        <div style={{
                            alignItems:"center",
                            display:"flex",
                            flexDirection:"column",
                            margin:"20px"
                          }}> <h2 style={{margin:"100px 0 100px 0"}}>loading.....!</h2> <BigLoader /> </div>:
                        <>
                        <h4 className='brand-logo'>Edit Profile</h4>
                        <div className='profile__image'>
                            <img style={{width:'160px', height:'160px',borderRadius:'80px'}}
                                src={imgUrl}
                                alt='profile pic'
                                />
                        </div>
                        <button className="btn #64b5f6 blue darken-2" onClick={() => deleteDP()}>delete profile picture</button>
                        <hr />
                        <h6><strong>Update Details here..</strong></h6>
                        <input
                        type='text'
                        placeholder='Username' 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                        type='text'
                        placeholder='Email' 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                        <div className="file-field input-field">
                            <div className="btn  #64b5f6 blue darken-2">
                                <span>profile pic</span>
                                <input type="file" onChange={e => setImage(e.target.files[0])} />
                            </div>
                            <div className="file-path-wrapper">
                                <input className="file-path validate" type="text" placeholder="Upload one or more files" />
                            </div>
                        </div>
                        <button className='btn waves-effect waves-light #64b5f6 blue darken-2' onClick={() => postData()}>
                            Update profile
                        </button>
                        </>
                    }
                </div>:
                <div style={{
                    alignItems:"center",
                    display:"flex",
                    flexDirection:"column"
                  }}> <h2 style={{margin:"100px 0 100px 0"}}>loading.....!</h2> <BigLoader /> </div>
            }
        </div>
    )
}

export default EditProfile


{/* <div class="file-field input-field">
                    <div class="btn  #64b5f6 blue darken-2">
                        <span>profile pic</span>
                        <input type="file" />
                    </div>
                    <div class="file-path-wrapper">
                        <input class="file-path validate" type="text" placeholder="Upload one or more files" />
                    </div>
                </div>
                <button className='btn waves-effect waves-light #64b5f6 blue darken-2'>
                    Update profile
                </button> */}