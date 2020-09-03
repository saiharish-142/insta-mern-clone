import React, { useEffect, createContext, useReducer, useContext } from 'react';
import './App.css';
import { BrowserRouter, Route, useHistory } from 'react-router-dom'
import Navbar from './components/Navbar';
import Home from './components/screens/Home';
import Profile from './components/screens/Profile';
import Login from './components/screens/Login';
import SignUp from './components/screens/SignUp';
import CreatePost from './components/screens/createPost';
import { reducer, InitialState} from './reducer/reducer'
import UserProfile from './components/screens/UserProfile';
import FollowPost from './components/screens/FollowPost';
import EditProfile from './components/screens/EditProfile';
import Reset from './components/screens/ResetPass';
import ResetPass from './components/screens/Newpassword';

export const UserContext = createContext()

const Routing = () =>{
  const history = useHistory()
  const {state,dispatch} = useContext(UserContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
    }else{
      if(!history.location.pathname.startsWith('/reset'))
          history.push('/login')
    }
  }, [])
  return(
    <>
        {state ? <><Route path='/' exact component={Home} />
        <Route path='/followposts' exact component={FollowPost} />
        <div className='App__profile'>
          <Route path='/profile' exact component={Profile} />
          <Route path='/profile/:userid' component={UserProfile} />
        </div>
        <Route path='/editProfile' component={EditProfile} />
        <Route path='/createpost' component={CreatePost} />
        </>:<>
        <Route path='/login' component={Login} />
        <Route path='/reset' exact  component={Reset} />
        <Route path='/reset/:token' component={ResetPass} />
        <Route path='/signup' component={SignUp} /></>}
    </>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, InitialState)
  return (
    <div className="App">
      <UserContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
