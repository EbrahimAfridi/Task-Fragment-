import React from "react";

interface AppToastProps {
    position: { vertical: string; horizontal: string };
    message: string;
    severity: string;
}

const AppToast: React.FC<AppToastProps> = ({ position, message, severity }) => {
    return (
        <div className={`app-toast ${severity}`} style={{ position: 'fixed', ...position }}>
            <p>{message}</p>
        </div>
    );
};

export default AppToast;
