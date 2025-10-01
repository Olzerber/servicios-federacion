import React, { useState, forwardRef, useImperativeHandle } from 'react';

// Este componente reemplaza el uso de alert() o window.alert()
// Se usa forwardRef para que el componente padre (AuthPage o CompleteProfile) pueda llamar a sus métodos.
const MessageModal = forwardRef((props, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('info'); // 'info', 'error', 'success'

    // Expone la función showModal para que el componente padre pueda llamarla
    useImperativeHandle(ref, () => ({
        show: (msg, msgType = 'info') => {
            setMessage(msg);
            setType(msgType);
            setIsVisible(true);
            setTimeout(() => {
                setIsVisible(false);
            }, 5000); // El mensaje desaparece después de 5 segundos
        },
        hide: () => {
            setIsVisible(false);
        }
    }));

    if (!isVisible) return null;

    const baseStyle = "fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white font-semibold z-50 transition-opacity duration-300";
    let colorStyle = "";

    switch (type) {
        case 'success':
            colorStyle = "bg-green-500";
            break;
        case 'error':
            colorStyle = "bg-red-600";
            break;
        case 'info':
        default:
            colorStyle = "bg-blue-500";
            break;
    }

    return (
        <div className={`${baseStyle} ${colorStyle}`}>
            <div className="flex justify-between items-center">
                <span>{message}</span>
                <button 
                    onClick={() => setIsVisible(false)} 
                    className="ml-4 text-sm font-bold opacity-75 hover:opacity-100"
                >
                    &times;
                </button>
            </div>
        </div>
    );
});

export default MessageModal;
