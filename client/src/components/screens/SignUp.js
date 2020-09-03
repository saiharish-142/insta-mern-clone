import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'

function SignUp() {
    const history = useHistory()
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const PostData = () => {
        if(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            fetch("http://localhost:5000/auth/signup",{
                method:"post",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    name,
                    email,
                    password
                })
            }).then(res=>res.json())
            .then(data => {
                if(data.error){
                M.toast({html:data.error, classes:'#ff5252 red accent-2'}) 
                }else{
                    M.toast({html:data.message, classes:'#69f0ae green accent-2'})
                    history.push('/login')
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
                placeholder='Username' 
                value={name}
                onChange={(e) => setName(e.target.value)}
                />
                <input
                type='email'
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
                <button className='btn waves-effect waves-light #64b5f6 blue darken-2'
                onClick={()=> PostData()}
                >
                    Sign Up
                </button>
                <h6>
                    <Link to='/login'>Already have an account ?</Link>
                </h6>
            </div>
        </div>
    )
}

export default SignUp
