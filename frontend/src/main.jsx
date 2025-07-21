import React from "react"
import {createRoot} from 'react-dom/client'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import CreateGroup from "./pages/createGroup.jsx"
import Confessions from "./pages/groupconfession.jsx"
import JoinGroup from "./pages/joingroup.jsx"
import LoginPage from "./pages/login-sigup.jsx"
import Report from "./pages/reportconfession.jsx"
import UserGroups from "./pages/userGroups.jsx"
import Admin from "./pages/Admin.jsx"

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
            <Routes>
                <Route path='/' element={<LoginPage/>}/>
                <Route path='/UserGroups' element={<UserGroups/>}/>
                <Route path='/CreateGroup' element={<CreateGroup/>}/>
                <Route path='/JoinGroup' element={<JoinGroup/>}/>
                <Route path='/Confessions' element={<Confessions/>}/>
                <Route path='/Report' element={<Report/>}/>
                <Route path='/Admin' element={<Admin/>}/>
            </Routes>
    </BrowserRouter>
)
