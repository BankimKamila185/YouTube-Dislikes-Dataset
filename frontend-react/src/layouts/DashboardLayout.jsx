import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    // Map route path to expected Sidebar selected state
    const getCurrentPage = () => {
        if (location.pathname.includes('/eda')) return 'eda';
        if (location.pathname.includes('/predict')) return 'predict';
        return 'overview';
    };

    const navigateToPage = (pageId) => {
        if (pageId === 'overview') navigate('/dashboard');
        else if (pageId === 'eda') navigate('/dashboard/eda');
        else if (pageId === 'predict') navigate('/dashboard/predict');
    };

    return (
        <div className="app-container">
            <Sidebar currentPage={getCurrentPage()} setCurrentPage={navigateToPage} />
            <main className="main-content" style={{ position: 'relative' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                        transition={{ duration: 0.3 }}
                    >
                        <Outlet /> {/* Renders the nested routes (Overview, EDA, Predict) */}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
