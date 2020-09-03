import React, { useEffect, useState, useContext } from 'react'
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'
import { SmallLoader, BigLoader } from '../preloader'

function UserProfile() {
    const [userProfile, setUserProfile] = useState(null)
    const [loading, setloading] = useState(false)
    const [userPosts, setuserPosts] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const {userid} = useParams()
    // console.log(userid)
    useEffect(() => {
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result =>{
            // console.log(result)
            setuserPosts(result.posts)
            setUserProfile(result.user)
        })
    }, [])
    const followHandle =(handle) =>{
        setloading(true)
        if(handle===followUser){
            followUser()
        }
        if(handle===unfollowUser){
            unfollowUser()
        }
    }
    const followUser = () => {
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data => {
            // console.log(data.user)
            localStorage.setItem("user",JSON.stringify(data.user))
            dispatch({type:"USER",payload:data.user})
            setUserProfile(data.result)
            setloading(false)
        }).catch(err=>console.log(err))
    }

    const unfollowUser = () => {
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data => {
            // console.log(data.result,data.user)
            localStorage.setItem("user",JSON.stringify(data.user))
            dispatch({type:"USER",payload:data.user})
            setUserProfile(data.result)
            setloading(false)
        }).catch(err=>console.log(err))
    }

    return (
        <>
        {userProfile?
            <div className='profile'>
                <div className='profile__top'>
                    <div className='profile__head'>
                    <div className='profile__image'>
                        <img style={{width:'160px', height:'160px',borderRadius:'80px'}}
                            src='https://images.unsplash.com/flagged/photo-1577351285836-19ff13f8e615?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
                            alt='profile pic'
                            />
                    </div>
                    <div className='profile__headDescription'>
                        <h4>{userProfile? userProfile.name: "loading..."}</h4>
                        <h6>{userProfile? userProfile.email: "loading..."}</h6>
                        <div style={{display:"flex",width:'60%',justifyContent:"space-around"}}>
                            <p style={{textAlign:"center",padding:'10px'}}>{userPosts.length} posts</p>
                            <p style={{textAlign:"center",padding:'10px'}}>{userProfile.followers.length} followers</p>
                            <p style={{textAlign:"center",padding:'10px'}}>{userProfile.following.length} following</p>
                        </div>
                        {loading?
                            <button className='btn #ffffff white'>
                              <SmallLoader />
                            </button>: <>
                            {userProfile.followers.includes(state._id) ?
                            <button className='btn waves-effect waves-light #ffffff white'
                            style={{color:"black",zIndex:0}}
                            onClick={()=> followHandle(unfollowUser)}
                            >
                                following
                            </button>:
                            <button className='btn waves-effect waves-light #64b5f6 blue darken-2'
                            style={{zIndex:0}}
                            onClick={()=> followHandle(followUser)}
                            >
                                Follow
                            </button>}
                        </>}
                        
                    </div>
                    </div>
                </div>
                <div className='profile__gallery'>
                    {userPosts.map((post,key) => {
                    return <img key={key}
                        className='Profile__galleryimg'
                        src={post.photo}
                        alt='post'
                        />
                    })}
                </div>
            </div>
        :<div style={{
          alignItems:"center",
          display:"flex",
          flexDirection:"column"
        }}> <h2 style={{margin:"100px 0 100px 0"}}>loading.....!</h2> <BigLoader /> </div>}
        </>
    )
}

export default UserProfile
