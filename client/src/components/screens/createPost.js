import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import M from 'materialize-css'
import { BigLoader } from '../preloader'

function CreatePost() {
    const history = useHistory()
    const [title, setTitle] = useState("")
    const [caption, setCaption] = useState("")
    const [image, setImage] = useState("")
    const [imgurl, setImgurl] = useState("")
    const [Loading, setLoading] = useState(false)
    const postData = () => {
        setLoading(true)
        const data = new FormData()
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
            setImgurl(data.url)
        })
        .catch(err=>{
            console.log(err)
            setLoading(false)
        })
    }
    useEffect(() => {
        if(imgurl){
            fetch("/createpost",{
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization" :"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    title,
                    body:caption,
                    pic:imgurl
                })
            }).then(res=>res.json())
            .then(data => {
                // console.log(data)
                if(data.error){
                    M.toast({html:data.error, classes:'#ff5252 red accent-2'})
                    setLoading(false) 
                }else{
                    M.toast({html:"created a post Successfully", classes:'#69f0ae green accent-2'})
                    history.push('/')
                }
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
        }
        }, [imgurl])
    return (
        <>
        {Loading ? 
        <div style={{
            alignItems:"center",
            display:"flex",
            flexDirection:"column"
          }}> <h2 style={{margin:"100px 0 100px 0"}}>loading.....!</h2> <BigLoader /> </div>:
        <div className='card input-filed' style={{
            margin:"30px auto",
            maxWidth:"600px",
            padding:"20px",
            textAlign:"center"
        }} >
           <input 
                type='text' 
                placeholder='title'
                value={title}
                onChange={e => setTitle(e.target.value)}
             /> 
           <input 
                type='text' 
                placeholder='body'
                value={caption}
                onChange={e => setCaption(e.target.value)}
            /> 
            <div className="file-field input-field">
                <div className="btn waves-effect waves-light #64b5f6 blue darken-2">
                    <span>File</span>
                    <input type="file" onChange={e => setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className='btn waves-effect waves-light #64b5f6 blue darken-2'
                onClick={() => postData()}
            >
                Create Post
            </button>
        </div>}
    </>
    )
}

export default CreatePost
