import React,{ useState } from 'react'
import { Link, useHistory,useParams } from 'react-router-dom'
import M from 'materialize-css'

function ResetPass() {
    const history = useHistory()
    const [password, setPassword] = useState("")
    const {token} = useParams()
    const PostData = () => {
            fetch("/auth/new-password",{
                method:"post",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    password,
                    token
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
    }
    return (
        <div className='myCard'>
            <div className='card auth-card input-field'>
                <h2 className='brand-logo'>Instagram</h2>
                <input
                type='password'
                placeholder='Enter New password' 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
                <button className='btn waves-effect waves-light #64b5f6 blue darken-2' onClick={() => PostData()}>
                    Reset password
                </button>
            </div>
        </div>
    )
}

export default ResetPass
