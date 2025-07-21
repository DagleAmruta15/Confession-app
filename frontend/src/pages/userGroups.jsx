import { useState , useEffect } from "react"
import { useNavigate } from "react-router-dom"

function UserGroups() {
    const [groups,setGroups] = useState([])
    const navigate = useNavigate()
    const taketoConfessions = (groupcode) => {
        localStorage.setItem("groupcode",JSON.stringify(groupcode))
        navigate("/Confessions")
    }
    const taketojoingroup = () => {
        navigate('/JoinGroup')
    }
    const taketocreategroup = () => {
        navigate('/CreateGroup')
    }
    const handleLogout = () => {
        navigate('/')
    }
    useEffect ( () => {
        const fetchAndUpdate = async () => {
            const createdGroups = JSON.parse(localStorage.getItem("createdgroups")) || []
            const joinedGroups = JSON.parse(localStorage.getItem("joinedgroups")) || []
            const newgroups = []
            for(const group of createdGroups){
                try {
                    const response = await fetch('http://localhost:8000/unread',{
                    method : 'POST',
                    headers : {
                    'content-type' : 'application/json'
                    },
                    body : JSON.stringify({
                        timestamp : group.last_visited,
                        groupcode : group.groupcode
                    })
                })
                const data = await response.json()
                if(!response.ok) {
                throw new Error("messages did not found")
                }
                newgroups.push({
                    groupname : group.groupname,
                    groupcode : group.groupcode,
                    unreadmsgs : data.unreadCount,
                    description : "You created this group"
                })
                } catch (error) {
                    console.log("found error in finding unread messages")
                }
            }
            for(const group of joinedGroups){
                try {
                    const response = await fetch('http://localhost:8000/unread',{
                    method : 'POST',
                    headers : {
                    'content-type' : 'application/json'
                    },
                    body : JSON.stringify({
                        timestamp : group.last_visited,
                        groupcode : group.groupcode
                    })
                })
                const data = await response.json()
                if(!response.ok) {
                throw new Error("messages did not found")
                }
                newgroups.push({
                    groupname : group.groupname,
                    groupcode : group.groupcode,
                    unreadmsgs : data.unreadCount,
                    description : "You belong to this group"
                })
                } catch (error) {
                    console.log("found error in finding unread messages")
                }
            }
            newgroups.sort((a, b) => b.unreadmsgs - a.unreadmsgs);
            setGroups(prev => {
                if(JSON.stringify(newgroups)!=JSON.stringify(prev)){
                    return newgroups
                }
                return prev
            })
        }
        fetchAndUpdate()
        const interval = setInterval(fetchAndUpdate,2000)
        return () => clearInterval(interval)
    },[])
    return(
        <>
            <div className="heading">
                <h1>My Groups</h1>
            </div>
            <div className="input-container">
                <button onClick={handleLogout}>Logout</button>
            </div>
            <div className="input-container">
                <button onClick={taketocreategroup}>Create</button>
                <button onClick={taketojoingroup}>Join</button>
            </div>
            <div className="groups-wrapper">
                {groups.map(group => (
                    <div className="group-card" key={group.groupcode} onClick={() => taketoConfessions(group.groupcode)}>
                        <h1 className="group-title">{group.groupname}</h1>
                        <h2 className="group-subtitle">{group.description}</h2>
                        <h3>unread messages : {group.unreadmsgs}</h3>
                    </div>
                ))}
            </div>
        </>
    )
}

export default UserGroups