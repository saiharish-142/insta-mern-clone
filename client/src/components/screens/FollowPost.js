import React, { useState, useEffect, useContext } from 'react'
import {UserContext} from '../../App'
import { Link } from 'react-router-dom'
import { BigLoader } from '../preloader'

function FollowPost() {
    const {state,dispatch} = useContext(UserContext)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [comment, setComment] = useState("")
    const [postIdLoad, setPostIdLoad] = useState("")
    useEffect(() => {
        fetch('/getSubpost',{
            headers:{
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result => {
            setData(result.posts)
            setLoading(false)
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
            setData(newData)
            setPostIdLoad("")
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
            setData(newData)
            setPostIdLoad("")
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
            // console.log(result)
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

    return (
        <>
        {loading?
            <div style={{
                alignItems:"center",
                display:"flex",
                flexDirection:"column"
              }}> <h2 style={{margin:"100px 0 100px 0"}}>loading.....!</h2> <BigLoader /> </div>:
            <div className='home'>
            {data.map((post) => {
                return <div key={post._id} className='card home-card'>
                            <h5><Link className='link' to={post.postedBy._id !== state._id?`/profile/${post.postedBy._id}`: '/profile'}>{post.postedBy.name}</Link></h5>
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
                        </div>
                    })}
                    {data.length===0 && <div style={{display:"flex",justifyContent:"center"}}><h3>No Following Posts</h3></div>}
                </div>
        }
        </>
    )
}

export default FollowPost
