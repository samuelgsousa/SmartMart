import { BrowserRouter, Routes, Route, Router, Navigate } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
        </Routes>
    )
}

export default AppRoutes;