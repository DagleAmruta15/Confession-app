import '../styles/style.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function JoinGroup(){
    const [groupcode,setGroupcode] = useState('')
    const navigate = useNavigate()
    const username = JSON.parse(localStorage.getItem("username"))
    const handlejoinGroup = async() => {
        try {
            const response = await fetch('http://localhost:8000/joingroup',{
                method : 'POST',
                headers : {
                    'content-type' : 'application/json'
                },
                body : JSON.stringify({username,groupcode})
            })
            const data = await response.json()
            if(!response.ok){
                throw new Error("joining group failed")
            }
            localStorage.setItem("joinedgroups",JSON.stringify(data.joinedGroups))
            navigate('/UserGroups')
        } catch (error) {
            console.log('joingroup error',error)
        }
    }
    return(
        <>
            <div className='heading'>
                <h1>Join Group</h1>
            </div>
            <div className='container'>
                <div className='input-container'>
                    <input type="text" placeholder='Group Code' value={groupcode} onChange={(e) => setGroupcode(e.target.value)}/>
                </div>
                <div className='input-container'>
                    <button onClick={handlejoinGroup}>Join</button>
                </div>
            </div>
        </>
    )
}

export default JoinGroup