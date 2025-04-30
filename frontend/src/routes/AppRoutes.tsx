import { BrowserRouter, Routes, Route, Router, Navigate } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import Products from '@/pages/Products';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
        </Routes>
    )
}

export default AppRoutes;