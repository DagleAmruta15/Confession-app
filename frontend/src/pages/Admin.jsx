import { useState, useEffect } from 'react';
import '../styles/style.css';

function Admin() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const adminReports = JSON.parse(localStorage.getItem("reports"));
    setReports(adminReports || []);
  }, []);

  const handleDelete = (groupToDelete) => {
    const updatedReports = reports.filter(group => group !== groupToDelete);
    setReports(updatedReports);
    localStorage.setItem("reports", JSON.stringify(updatedReports)); 
  };

  const HandleDeleteBackend = async(confessionId,groupcode) => {
    try {
        const response = await fetch('http://localhost:8000/delete',{
            method : 'POST',
            headers : {
                'content-type' : 'application/json'
            },
            body : JSON.stringify({ confessionId, groupcode })
        })
        if(!response.ok) {
            throw new Error(data.message || "login failed")
        }
    } catch (error) {
        console.log("deleting error:", error.message);
    }
  }

  const HandleDeleteAndBanBackend = async(confessionId,username,groupcode) => {
    try {
        const response = await fetch('http://localhost:8000/deleteAndBan',{
            method : 'POST',
            headers : {
                'content-type' : 'application/json'
            },
            body : JSON.stringify({ confessionId,username,groupcode })
        })
        if(!response.ok) {
            throw new Error(data.message || "login failed")
        }
    } catch (error) {
        console.log("deleting error:", error.message);
    }
  }

  return (
    <>
      <div className="groups-wrapper">
        {reports.map(report => (
          <div className="group-card" key={report.confessionId}>
            <h1>Text : {report.text}</h1>
            <h2 className="group-subtitle">Report : {report.report}</h2>
            <button onClick={() => {
                handleDelete(report)
                HandleDeleteBackend(report.confessionId,report.groupcode)
                }}>Delete</button>
            <button onClick={() => {
                handleDelete(report)
                HandleDeleteAndBanBackend(report.confessionId,report.username,report.groupcode)
                }}>Delete and Ban User</button>
          </div>
        ))}
      </div>
    </>
  );
}

export default Admin;


// import { useState } from 'react'
// import '../styles/style.css'

// function Admin() {
//   const [reports, setReports] = useState([
//     "group1",
//     "group2",
//     "group3",
//     "group4"
//   ]);

//   const handleDelete = (groupToDelete) => {
//     setReports(prev => prev.filter(group => group !== groupToDelete));
//   };

//   return (
//     <>
//       <h1>Welcome Admin</h1>
//       <h2>Reports:</h2>
//       {reports.length === 0 ? (
//         <p>No reports available.</p>
//       ) : (
//         <ul>
//           {reports.map(group => (
//             <li key={group}>
//               {group}
//               {" "}
//               <button onClick={() => handleDelete(group)}>
//                 Delete
//               </button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </>
//   );
// }

// export default Admin;
