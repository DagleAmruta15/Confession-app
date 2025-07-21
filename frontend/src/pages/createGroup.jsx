import '../styles/style.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CreateGroup () {
    const [groupname,setGroupname] = useState('')
    const [groupcode,setGroupcode] = useState('')
    const navigate = useNavigate()
     const username = JSON.parse(localStorage.getItem("username"))
     const handleCreateGroup = async() => {
        try {
            const response = await fetch('http://localhost:8000/creategroup',{
                method : 'POST',
                headers : {
                    'content-type' : 'application/json'
                },
                body : JSON.stringify({username,groupname,groupcode})
            })
            const data = await response.json()
            if(!response.ok){
                throw new Error("joining group failed")
            }
            localStorage.setItem("createdgroups",JSON.stringify(data.createdGroups))
            navigate('/UserGroups')
        } catch (error) {
            console.log('creategroup error',error)
        }
    }
    return(
        <>
            <div className='heading'>
                <h1>Create Group</h1>
            </div>
            <div className='container'>
                <div className='input-container'>
                    <input type="text" placeholder='Group name' value={groupname} onChange={(e) => setGroupname(e.target.value)}/>
                    <input type="text" placeholder='Group Code' value={groupcode} onChange={(e) => setGroupcode(e.target.value)}/>
                </div>
                <div className='input-container'>
                    <button onClick={handleCreateGroup}>Create</button>
                </div>
            </div>
        </>
    )
}
export default CreateGroup