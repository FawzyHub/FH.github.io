import Login from './pages/Login'
import Menu from './pages/Menu'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

export default function () {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/" element={<Navigate to="/menu" replace />} />
            </Routes>
        </BrowserRouter>
    )
}
