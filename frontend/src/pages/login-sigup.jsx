import '../styles/style.css'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function LoginPage(){
  const [username , setUsername] = useState("")
  const [password , setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = async() => {
    try {
        const response = await fetch('http://localhost:8000/login',{
            method : 'POST',
            headers : {
                'content-type' : 'application/json'
            },
            body : JSON.stringify({username,password})
        })
        const data = await response.json()
        if(!response.ok) {
            throw new Error(data.message || "login failed")
        }
        if(data.isAdmin){
            localStorage.setItem('reports',JSON.stringify(data.reports))
            navigate('/Admin')
        }
        else{
            localStorage.setItem('username',JSON.stringify(username))
            localStorage.setItem('createdgroups',JSON.stringify(data.createdgroups))
            localStorage.setItem('joinedgroups',JSON.stringify(data.joinedgroups))
            navigate('/UserGroups')
        }
    } catch (error) {
        console.log("login error:", error.message);
    }
  }
 
  const handlesignup = async() => {
    try {
        const response = await fetch('http://localhost:8000/signup',{
            method : 'POST',
            headers : {
                'content-type' : 'application/json'
            },
            body : JSON.stringify({username,password})
        })
        const data = await response.json()
        if(!response.ok) {
            throw new Error(data.message || "signup failed")
        }
        localStorage.setItem('username',JSON.stringify(username))
        localStorage.setItem('createdgroups',JSON.stringify(data.createdgroups))
        localStorage.setItem('joinedgroups',JSON.stringify(data.joinedgroups))
        navigate('/UserGroups')
    } catch (error) {
        console.log("signup error:", error.message);
    }
  }

  return (
    <>
    <div className='heading'>
      <h1>Confession</h1>
    </div>
    <div className="container">
        <div className="input-container">
            <input type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
        </div>
        <div className="input-container">
            <input type="text" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <div className="input-container">
            <button onClick={handleLogin}>Login</button>
            <button onClick={handlesignup}>Signup</button>
        </div>
    </div>
    </>
  )
}

export default LoginPage