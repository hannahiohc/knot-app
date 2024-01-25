import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';
// import Home from "../routes/home";

export default function ProtectedRoute({
    children, 
} : {
    children: React.ReactNode;
}) {
    const user = auth.currentUser;
    if (user === null) {
        return <Navigate to="/login" />
    } else {
        return children;
        // return <Home />
    }
};

// children: anything inside the component