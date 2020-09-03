import React,{ useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'

function Reset() {
    const history = useHistory()
    const [email, setEmail] = useState("")
    const PostData = () => {
        if(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            fetch("/auth/reset-password",{
                method:"post",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    email
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
                placeholder='Email' 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
                <button className='btn waves-effect waves-light #64b5f6 blue darken-2' onClick={() => PostData()}>
                    reset password
                </button>
            </div>
        </div>
    )
}

export default Reset
