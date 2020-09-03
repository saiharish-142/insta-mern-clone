import React, { useContext, useRef, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'

function Navbar() {
    const [search, setSearch] = useState('')
    const [users, setUsers] = useState([])
    const searchModal = useRef(null)
    const history = useHistory()
    const {state,dispatch} = useContext(UserContext)
    useEffect(() => {
        M.Modal.init(searchModal.current)
    }, [])
    const renderList = () => {
        if(state){
            return [
                <li key="1"><i data-target="modal1" style={{color:"black",cursor:"pointer"}} className="large material-icons modal-trigger">search</i></li>,
                <li key="2"><Link className='font__black' to="/followposts">Follow posts</Link></li>,
                <li key="3"><Link className='font__black' to="/profile">
                    <i id="mobile" className="material-icons">person</i> <div id="window">Profile</div>
                    </Link></li>,
                <li key="4"><Link className='font__black' to="/createpost">
                    <i id="mobile" className="material-icons">file_upload</i> <div id="window">Create Post</div>
                    </Link></li>,
                <li key="5">
                    <button className='btn #ff5252 red accent-2' 
                    onClick={()=>{
                        localStorage.clear()
                        dispatch({type:"CLEAR"})
                        history.push('/login')
                    }}>
                        <i style={{marginTop:"-10px"}} id="mobile" className="material-icons">exit_to_app</i> <div id="window">log out</div>
                    </button>
                </li>
            ]
        }else{
            return [
                <li key="6"><Link className='font__black' to="/login">Login</Link></li>,
                <li key="7"><Link className='font__black' to="/signup">SignUp</Link></li>
            ]
        }
    }

    const fetchUsers = (query) => {
        setSearch(query)
        fetch('/search-user',{
            method:"post",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                query
            })
        }).then(res => res.json())
        .then(results => {
            console.log(results)
            setUsers(results.user)
        })
    }
    return (
        <nav className="navBar">
            <div className="nav-wrapper white">
                <Link to={state?"/":"/login"} id='font__black' className="brand-logo left">Instagram</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
            <div id="modal1" className="modal" ref={searchModal} style={{color:"black",zIndex:1}}>
                <div className="modal-content">
                    <input
                    type='text'
                    placeholder='search'
                    value={search}
                    onChange={(e)=>fetchUsers(e.target.value)}
                    />
                 {state &&<ul className="collection" style={{display:"flex",flexDirection:"column"}}>
                    {users.map(item => {
                        return <Link style={{padding:0}} key={item._id} to={item._id !== state._id?`/profile/${item._id}`: '/profile'} 
                                onClick={()=>M.Modal.getInstance(searchModal.current).close()}
                                >
                                 <li style={{color:"black",width:"100%",margin:0}} className='collection-item'>{item.name} <br/>{item.email}</li>
                            </Link>
                    })}
                </ul>}
                </div>
                <div className="modal-footer">
                <button className="modal-close waves-effect waves-green btn-flat" onClick={() => setSearch('')}>close</button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
