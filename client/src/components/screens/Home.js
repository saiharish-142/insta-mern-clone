import React, { useState, useEffect, useContext } from 'react'
import {UserContext} from '../../App'
import { Link } from 'react-router-dom'
import { BigLoader } from '../preloader'

function Home() {
    const {state,dispatch} = useContext(UserContext)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [postDelLoad, setpostDelLoad] = useState("")
    const [postIdLoad, setPostIdLoad] = useState("")
    const [comment, setComment] = useState("")
    useEffect(() => {
        fetch('/allposts',{
            headers:{
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result => {
            setData(result.posts)
            setLoading(true)
            // console.log(result.posts)
        })
        .catch(err => console.log(err))
    }, [])

    const likeManaging = (likeComand,id) =>{
        setPostIdLoad(id)
        if(likeComand===likePost){
            likePost(id)
        }
        if(likeComand===unlikePost){
            unlikePost(id)
        }
    }

    const likePost = (id) => {
        fetch('/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result => {
            const newData = data.map(item => {
                if(item._id===result._id){
                    return result
                }else{
                    return item
                }
            })
            setPostIdLoad("")
            setData(newData)
        }).catch(err => console.log(err))
    }

    const unlikePost = (id) => {
        fetch('/unlike',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result => {
            const newData = data.map(item => {
            if(item._id===result._id){
                return result
            }else{
                return item
            }
        })
            setPostIdLoad("")
            setData(newData)
        }).catch(err => console.log(err))
    }

    const makeComment = (text,postId) => {
        fetch('/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                text
            })
        }).then(res=>res.json())
        .then(result => {
            const newData = data.map(item => {
                if(item._id===result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>console.log(err))
    }

    const deletePost = (id) => {
        setpostDelLoad(id)
        fetch(`/deletepost/${id}`,{
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData)
        }).catch(err=>console.log(err))
    }
    return (
        <>
            {loading ? 
                <div className='home'>
                {data.map((post) => {
                    return <div key={post._id} className='card home-card'>
                                {postDelLoad === post._id ?
                                <div style={{
                                    alignItems:"center",
                                    display:"flex",
                                    flexDirection:"column",
                                    padding:"100px 0 100px 0"
                                  }}> <h2>loading.....!</h2> <BigLoader /> </div>:
                                <>
                                    <h5 style={{display:"flex",flexDirection:"row", alignItems:"center", width:"100%"}}>
                                    <Link className='link' style={{display:"flex",flexDirection:"row",padding:"0 10px"}} to={post.postedBy._id !== state._id?`/profile/${post.postedBy._id}`: '/profile'}>
                                        <img style={{width:"40px",margin:"10px 10px 0 0" ,borderRadius:"50%"}} src={post.postedBy.profilePic} alt='' />
                                        <h5>{post.postedBy.name}</h5>
                                    </Link>
                                    {post.postedBy._id === state._id &&
                                    <i 
                                        className="material-icons right" 
                                        style={{cursor:"pointer",margin:"10px 10px 0 auto"}}
                                        onClick={()=>deletePost(post._id)}
                                    >
                                        {"delete"}
                                    </i>
                                    }
                                </h5>
                                <div className='card-image'>
                                    <img src={post.photo} alt='' />
                                </div>
                                <div className='card-content'>
                                    {postIdLoad === post._id ? 
                                        <>{post.likes.includes(state._id)?
                                        <i className="material-icons" style={{color:'red',cursor:"pointer"}}>{"favorite_border"}</i>:
                                        <i className="material-icons" style={{color:'black',cursor:"pointer"}}>{"favorite"}</i>}</>:
                                        <>{post.likes.includes(state._id)?
                                        <i className="material-icons" onClick={()=>{likeManaging(unlikePost,post._id)}} style={{color:'red',cursor:"pointer"}}>{"favorite"}</i>:
                                        <i className="material-icons" onClick={()=>{likeManaging(likePost,post._id)}} style={{color:'black',cursor:"pointer"}}>{"favorite_border"}</i>}</>
                                    }
                                    <h6>{post.likes.length} likes</h6>
                                    <h6>{post.title}</h6>
                                    <p>{post.body}</p>
                                    {post.comments.map((comment,key)=>{
                                        return(
                                            <h6 key={key}><span style={{fontWeight:"500"}}>{comment.postedBy.name} :  </span>  {comment.text}</h6>
                                        )
                                    })}
                                    <form onSubmit={(e)=>{
                                        e.preventDefault()
                                        makeComment(e.target[0].value,post._id)
                                    }}  style={{display:"flex"}}
                                    >
                                        <input type='text' value={comment} onChange={e=>setComment(e.target.value)} placeholder='comment' />
                                        <button className='btn #ffffff white'><i className="material-icons" style={{color:"#64b5f6"}} >{"send"}</i></button>
                                    </form>
                                </div>
                                </>
                                }
                            </div>
                })}
            </div>:
            <div style={{
                alignItems:"center",
                display:"flex",
                flexDirection:"column"
              }}> <h2 style={{margin:"100px 0 100px 0"}}>loading.....!</h2> <BigLoader /> </div>
            }
        </>
    )
}

export default Home
