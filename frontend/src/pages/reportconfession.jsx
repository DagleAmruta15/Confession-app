import { useState } from "react"
import { useNavigate } from "react-router-dom"
function Report(){
    const [reportmsg,setReportmsg] = useState('')
    const navigate = useNavigate()
    const confessionId = JSON.parse(localStorage.getItem("confessionId"))
    const groupcode = JSON.parse(localStorage.getItem("groupcode"))
    const handleReport = async() => {
          try {
            const response = await fetch('http://localhost:8000/report',{
                method : 'POST',
                headers : {
                    'content-type' : 'application/json'
                },
                body : JSON.stringify({
                    confessionId : confessionId,
                    groupcode : groupcode,
                    report : reportmsg
                })
            })
            if(!response.ok){
                throw new Error("error saving report")
            }
            navigate('/Confessions')
          } catch (error) {
            console.log("error in reporting the confession")
          }
    }
    return(
        <>
            <div className="container">
                <input type="text" placeholder="write a proper reason for reporting this confession.." value={reportmsg} onChange={(e) => setReportmsg(e.target.value)}/>
                <button onClick={handleReport}>Report</button>
            </div>
        </>
    )
}
export default Report