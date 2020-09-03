import React,{ useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from '../../App'

function Login() {
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const PostData = () => {
        if(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            fetch("/auth/signin",{
                method:"post",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    email,
                    password
                })
            }).then(res=>res.json())
            .then(data => {
                if(data.error){
                M.toast({html:data.error, classes:'#ff5252 red accent-2'}) 
                }else{
                    localStorage.setItem("jwt",data.token)
                    localStorage.setItem("user",JSON.stringify(data.user))
                    dispatch({type:"USER",payload:data.user})
                    M.toast({html:"Signedin Successfully", classes:'#69f0ae green accent-2'})
                    history.push('/')
                }
            })
            .catch(err => {
                console.log(err)
            })
        }else{
            M.toast({html:"Entered a invalid Email",classes:"#ff5252 red accent-2"})
        }
    }
    return (
        <div className='myCard'>
            <div className='card auth-card input-field'>
                <h2 className='brand-logo'>Instagram</h2>
                <input
                type='text'
                placeholder='Email' 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
                <input
                type='password'
                placeholder='password' 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
                <button className='btn waves-effect waves-light #64b5f6 blue darken-2' onClick={() => PostData()}>
                    Log in
                </button>
                <h6>
                    <Link to='/signup'>Don't have an account ?</Link>
                </h6>
                <h6>
                    <Link to='/reset'>forgot password ?</Link>
                </h6>
            </div>
        </div>
    )
}

export default Login
