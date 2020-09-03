import React, { useEffect, useState, useContext } from 'react'
import {UserContext} from '../../App'
import { Link } from 'react-router-dom'
import { BigLoader } from '../preloader'

function Profile() {
    const [myPosts, setMyPosts] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [Loading, setLoading] = useState(true)
    useEffect(() => {
        fetch('/mypost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result =>{
            setMyPosts(result.mypost)
            setLoading(false)
        })
    }, [])
    return (
        <>
        {Loading?
            <div style={{
                alignItems:"center",
                display:"flex",
                flexDirection:"column"
              }}> <h2 style={{margin:"100px 0 100px 0"}}>loading.....!</h2> <BigLoader /> </div>:
            <div className='profile'>
                <Link to="/editProfile" style={{color:"black"}}><i style={{padding:"10px"}} className="material-icons right ">edit</i></Link>
                <div className='profile__top'>
                    <div className='profile__head'>
                    <div className='profile__image'>
                        <img style={{width:'160px', height:'160px',borderRadius:'80px'}}
                            src={state? state.profilePic : "loading..."}
                            alt='profile pic'
                            />
                    </div>
                    <div className='profile__headDescription'>
                        <h4>{state? state.name: "loading..."}</h4>
                        <h6>{state? state.email: "loading..."}</h6>
                        <div style={{display:"flex",width:'60%',justifyContent:"space-around"}}>
                            <p style={{textAlign:"center",padding:'10px'}}>{myPosts.length} posts</p>
                            <p style={{textAlign:"center",padding:'10px'}}>{state ? state.followers.length : 'loading..'} followers</p>
                            <p style={{textAlign:"center",padding:'10px'}}>{state ? state.following.length : 'loading..'} following</p>
                        </div>
                    </div>
                    </div>
                </div>
                <div className='profile__gallery'>
                    {myPosts.map((post,key) => {
                    return <img key={key}
                        className='Profile__galleryimg'
                        src={post.photo}
                        alt='post'
                        />
                    })}
                </div>
            </div>
        }
        </>
    )
}

export default Profile
