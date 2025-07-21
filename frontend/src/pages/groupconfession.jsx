import {useState,useEffect} from "react"
import { useNavigate } from "react-router-dom"

function Confessions(){
    const [confessions,setConfessions] = useState([])
    const [post,setPost] = useState('')
    const navigate = useNavigate()
    const taketoreports = (confessionId) => {
        localStorage.setItem("confessionId",JSON.stringify(confessionId))
        navigate('/Report')
    }
    const username = JSON.parse(localStorage.getItem("username"))
    const groupcode = JSON.parse(localStorage.getItem("groupcode"))
    const taketogroups = async() => {
        try {
            const response = await fetch('http://localhost:8000/back',{
                method : 'POST',
                headers : {
                    'content-type' : 'application/json'
                },
                body : JSON.stringify({username,groupcode})
            })
            const data = await response.json()
            if(!response.ok){
                throw new Error("error in going back to groups page")
            }
            localStorage.setItem("createdgroups",JSON.stringify(data.createdGroups))
            localStorage.setItem("joinedgroups",JSON.stringify(data.joinedGroups))
            navigate('/UserGroups')
        } catch (error) {
            console.log("error in going back",error)
        }
    }
    const handlepostconfession = async() => {
        try {
            const response = await fetch('http://localhost:8000/confession',{
                method : 'POST',
                headers : {
                    'content-type' : 'application/json'
                },
                body : JSON.stringify({username,groupcode,post})
            })
            if(!response.ok){
                throw new Error("error in posting message")
            }
        } catch (error) {
            console.log("error in saving confession",error)
        }
    }
    useEffect( () => {
        const fetchAndUpdate = async () => {
            const groupcode = JSON.parse(localStorage.getItem("groupcode"));
            try {
                const response = await fetch('http://localhost:8000/group',{
                    method : 'POST',
                    headers : {
                        'content-type' : "application/json"
                    },
                    body : JSON.stringify({groupcode})
                })
                const data = await response.json()
                if(!response.ok){
                    throw new Error('confessions not found')
                }
                setConfessions(prev => {
                    if(JSON.stringify(data.confessions)!=JSON.stringify(prev)){
                        return data.confessions
                    }
                    return prev
                })
            } catch (error) {
                console.log("error in fetching the group")
            }
        }
        fetchAndUpdate()
        const interval = setInterval(fetchAndUpdate,2000)
        return () => clearInterval(interval)
    },[])
    return (
        <>
            <div>
                <button onClick={taketogroups}>BACK</button>
            </div>
            <div>
                <input type="text" value={post} placeholder="add a message..." onChange={(e) => setPost(e.target.value)}/>
                <button onClick={handlepostconfession}>POST</button>
            </div>
            <div className="groups-wrapper">
                {confessions.map(confession => (
                    <div className="group-card" key={confession.confessionId}>
                        <h1>{confession.text}</h1>
                        <h2 className="group-subtitle">{new Date(confession.createdAt).toLocaleString()}</h2>
                        <button onClick={() => taketoreports(confession.confessionId)}>report</button>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Confessions