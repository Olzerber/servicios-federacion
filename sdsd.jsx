import React, { useState, useEffect, useCallback } from 'react';

// --- Importaciones y Configuración de Firebase ---
import {
initializeApp
} from 'firebase/app';
import {
getAuth,
signInWithCustomToken,
signInAnonymously,
onAuthStateChanged,
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
GoogleAuthProvider,
signInWithPopup,
signOut
} from 'firebase/auth';
import {
getFirestore,
doc,
setDoc,
getDoc
} from 'firebase/firestore';

// Globales proporcionadas por el entorno
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined'
? JSON.parse(__firebase_config)
: {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined'
? __initial_auth_token
: null;

// Inicializar servicios
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Funciones de Firestore
const getProfileDocRef = (userId) =>
doc(db, artifacts/${appId}/users/${userId}/profile/data);

// Guarda o actualiza el perfil del usuario
const saveUserProfile = async (userId, data) => {
try {
await setDoc(getProfileDocRef(userId), data, { merge: true });
return true;
} catch (error) {
console.error("Error saving user profile:", error);
throw new Error("Error al guardar el perfil en la base de datos.");
}
};

// Obtiene el perfil del usuario
const getUserProfile = async (userId) => {
const docSnap = await getDoc(getProfileDocRef(userId));
if (docSnap.exists()) {
return docSnap.data();
}
return null;
};

// --- Componente de Notificación Simple ---
const Notification = ({ message, type, onClose }) => {
if (!message) return null;


const baseStyle = "fixed bottom-5 right-5 p-4 rounded-lg shadow-xl z-50 text-white font-semibold transition-transform duration-300";
let colorStyle = "";

switch (type) {
    case 'error':
        colorStyle = "bg-red-600";
        break;
    case 'success':
        colorStyle = "bg-green-600";
        break;
    default:
        colorStyle = "bg-blue-500";
}

return (
    <div className={`${baseStyle} ${colorStyle}`}>
        {message}
        <button onClick={onClose} className="ml-4 font-bold">×</button>
    </div>
);
};

// --- Componente Principal de la Aplicación (App) ---
const App = () => {
const [currentView, setCurrentView] = useState('loading'); // 'loading', 'home', 'login', 'register', 'profile-step-1', 'dashboard'
const [currentUser, setCurrentUser] = useState(null);
const [notification, setNotification] = useState({ message: '', type: '' });


// Estado del formulario de autenticación
const [authMode, setAuthMode] = useState('login'); // 'login' o 'signup'
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [authLoading, setAuthLoading] = useState(false);

// Estado del formulario de perfil (Compartido entre Cliente y Profesional)
const [selectedRole, setSelectedRole] = useState(null); // 'client' o 'professional'
const [fullName, setFullName] = useState('');
const [phone, setPhone] = useState('');
const [category, setCategory] = useState('');
const [profileStep, setProfileStep] = useState('select-role'); // 'select-role', 'client-form', 'professional-form'


// Función para mostrar notificaciones
const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 4000);
};

// 1. Manejo de Autenticación Inicial y Redirección
useEffect(() => {
    const handleInitialAuth = async () => {
        try {
            if (initialAuthToken) {
                await signInWithCustomToken(auth, initialAuthToken);
            } else {
                // Intento de inicio de sesión anónimo si no hay token de Canvas
                await signInAnonymously(auth);
            }
        } catch (error) {
            console.warn("Error en la autenticación inicial, procediendo a la vista 'home'.", error);
        }
    };

    // Escucha el cambio de estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
            setCurrentUser(user);
            
            // Intentar cargar el perfil
            const profile = await getUserProfile(user.uid);

            // Si no tiene perfil completo o no existe, ir a completar perfil
            if (!profile || !profile.isProfileComplete) {
                setCurrentView('profile-step-1');
                // Establecer fullName si viene de Google
                if (user.displayName && !fullName) {
                    setFullName(user.displayName);
                }
            } else {
                // Si el perfil está completo, ir al dashboard (simulado)
                setCurrentView('dashboard');
                showNotification(`Bienvenido de vuelta, ${profile.role === 'client' ? 'Cliente' : 'Profesional'}!`, 'success');
            }
        } else {
            // Si no hay usuario, vamos a la pantalla de inicio
            setCurrentUser(null);
            setCurrentView('home');
        }
    });

    if (currentView === 'loading') {
        handleInitialAuth();
    }

    return () => unsubscribe();
}, [initialAuthToken]);


// --- Handlers de Autenticación (Login, Registro) ---

const handleAuthAction = async (e) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
        if (authMode === 'signup') {
            // REGISTRO
            await createUserWithEmailAndPassword(auth, email, password);
            // La función onAuthStateChanged se encargará de llevar al usuario a 'profile-step-1'
            showNotification('¡Registro exitoso! Por favor, completa tu perfil.', 'success');
        } else {
            // LOGIN
            await signInWithEmailAndPassword(auth, email, password);
            showNotification('Inicio de sesión exitoso.', 'success');
        }
        setEmail('');
        setPassword('');
        setCurrentView('loading');
    } catch (error) {
        let errorMessage = 'Error de autenticación.';
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'Ese correo ya está registrado.';
        } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            errorMessage = 'Credenciales inválidas.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
        }
        showNotification(errorMessage, 'error');
        console.error(error.code, error.message);
    } finally {
        setAuthLoading(false);
    }
};

const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    try {
        await signInWithPopup(auth, googleProvider);
        // La función onAuthStateChanged se encargará de la redirección
        showNotification('Inicio de sesión con Google exitoso.', 'success');
        setCurrentView('loading');
    } catch (error) {
        showNotification('Error al iniciar sesión con Google.', 'error');
        console.error("Google Auth Error:", error);
    } finally {
        setAuthLoading(false);
    }
};

const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setCurrentView('home');
    showNotification('Sesión cerrada correctamente.', 'info');
};

// --- Handlers de Perfil ---

const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setProfileStep(role === 'client' ? 'client-form' : 'professional-form');
};

const handleSubmitProfile = async (e) => {
    e.preventDefault();
    if (!currentUser || !selectedRole) {
        return showNotification("Error de autenticación. Por favor, inicia sesión de nuevo.", 'error');
    }

    const profileData = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        role: selectedRole,
        isProfileComplete: true, 
    };

    if (selectedRole === 'professional') {
        if (!category) {
            return showNotification("Por favor, selecciona una categoría.", 'error');
        }
        profileData.category = category;
    }

    try {
        await saveUserProfile(currentUser.uid, profileData);
        showNotification('¡Perfil completado! Bienvenido.', 'success');
        setCurrentView('dashboard'); // Redirigir al dashboard simulado
    } catch (error) {
        showNotification(error.message || 'Error al guardar el perfil.', 'error');
    }
};

// --- Vistas ---

const renderHome = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-2xl space-y-6 text-center">
            <h1 className="text-3xl font-extrabold text-indigo-700">Servicios Federación</h1>
            <p className="text-gray-600">Encuentra o ofrece servicios profesionales.</p>
            <button
                onClick={() => { setCurrentView('login'); setAuthMode('login'); }}
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 transform hover:scale-[1.02]"
            >
                Iniciar Sesión
            </button>
            <button
                onClick={() => { setCurrentView('login'); setAuthMode('signup'); }}
                className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-150 transform hover:scale-[1.02]"
            >
                Registrarse (Crear Cuenta)
            </button>
        </div>
    </div>
);

const renderAuthModal = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b pb-3 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    {authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </h2>
                <button onClick={() => setCurrentView('home')} className="text-gray-500 hover:text-gray-800 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            {/* Botón de Google */}
            <button
                onClick={handleGoogleSignIn}
                disabled={authLoading}
                className="w-full flex items-center justify-center py-3 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition duration-150 font-medium text-gray-700 disabled:opacity-70"
            >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M44.5 24A20.5 20.5 0 0 0 24 3.5 20.5 20.5 0 0 0 3.5 24 20.5 20.5 0 0 0 24 44.5a19.4 19.4 0 0 0 13.9-5.9l-4.5-4.5a14.5 14.5 0 0 1-9.4 3.9 14.5 14.5 0 0 1-14.5-14.5A14.5 14.5 0 0 1 24 9.5a13.5 13.5 0 0 1 9.4 3.8l4.5-4.5A19.5 19.5 0 0 0 24 3.5a20.5 20.5 0 0 0 0 41 20.5 20.5 0 0 0 20.5-20.5z" fill="#4285F4"/><path d="M24 9.5a14.5 14.5 0 0 1 14.5 14.5A14.5 14.5 0 0 1 24 38.5a14.5 14.5 0 0 1-14.5-14.5A14.5 14.5 0 0 1 24 9.5z" fill="#F4B400"/></svg>
                {authMode === 'login' ? 'Continuar con Google' : 'Registrarse con Google'}
            </button>

            <div className="flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-500 text-sm">o con correo</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <form onSubmit={handleAuthAction} className="space-y-4">
                <input
                    type="email"
                    placeholder="Correo Electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña (mín. 6 caracteres)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    minLength={6}
                />
                <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 disabled:bg-indigo-400"
                >
                    {authLoading ? (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Procesando...
                        </div>
                    ) : (
                        authMode === 'login' ? 'Iniciar Sesión' : 'Registrarse'
                    )}
                </button>
            </form>

            <div className="text-center text-sm mt-4">
                {authMode === 'login' ? (
                    <p className="text-gray-600">
                        ¿No tienes cuenta?{' '}
                        <button onClick={() => setAuthMode('signup')} className="text-indigo-600 hover:text-indigo-800 font-semibold">
                            Regístrate aquí
                        </button>
                    </p>
                ) : (
                    <p className="text-gray-600">
                        ¿Ya tienes cuenta?{' '}
                        <button onClick={() => setAuthMode('login')} className="text-indigo-600 hover:text-indigo-800 font-semibold">
                            Inicia Sesión
                        </button>
                    </p>
                )}
            </div>
        </div>
    </div>
);

// --- VISTA: Completar Perfil (Role Selection / Forms) ---

const renderProfileCompletion = () => {
    const baseContainer = "min-h-screen bg-gray-50 flex items-start justify-center p-4 sm:p-8";
    const baseCard = "w-full max-w-2xl bg-white rounded-xl shadow-2xl p-6 sm:p-10 space-y-6";

    // VISTA 1: SELECCIÓN DE ROL
    const renderRoleSelectionStep = () => (
        <div className={baseCard}>
            <header className="text-center">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Bienvenido/a a Servicios Federación
                </h1>
                <p className="mt-2 text-md text-gray-600">
                    Para empezar, dinos: ¿Cómo quieres usar la plataforma?
                </p>
                {/* Botón de Logout para salir del flujo de registro si el usuario se equivocó */}
                <button 
                    onClick={handleLogout} 
                    className="mt-2 text-sm text-red-500 hover:text-red-700 transition"
                >
                    Cerrar Sesión
                </button>
            </header>
            
            <div className="flex flex-col md:flex-row gap-6 mt-8">
                {/* Tarjeta Cliente */}
                <button 
                    onClick={() => handleRoleSelection('client')}
                    className="flex-1 p-6 border-2 border-blue-400 rounded-xl transition duration-300 hover:shadow-lg hover:bg-blue-50/50 hover:scale-[1.01] flex flex-col items-center space-y-4 text-center"
                >
                    {/* Icono de Cliente (Mano de Ayuda) */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17 2 2-2 2-2-2 2-2z"/><path d="m13 17 2 2-2 2-2-2 2-2z"/><path d="M12 2a4 4 0 0 0-4 4v7h8V6a4 4 0 0 0-4-4z"/><path d="M5 21v-4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4"/></svg>

                    <h3 className="text-xl font-bold text-gray-800">Soy Cliente</h3>
                    <p className="text-gray-600 flex-grow">Quiero encontrar profesionales verificados, solicitar presupuestos y contratar servicios.</p>
                    <span className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg text-sm shadow-md">Elegir Cliente →</span>
                </button>
                
                {/* Tarjeta Profesional */}
                <button 
                    onClick={() => handleRoleSelection('professional')}
                    className="flex-1 p-6 border-2 border-green-500 rounded-xl transition duration-300 hover:shadow-lg hover:bg-green-50/50 hover:scale-[1.01] flex flex-col items-center space-y-4 text-center"
                >
                    {/* Icono de Profesional (Herramientas) */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.7-3.7a1 1 0 0 0 0-1.4l-1.6-1.6a1 1 0 0 0-1.4 0z"/><path d="M21 21l-3-3"/><path d="M5 13a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4V9a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4z"/></svg>

                    <h3 className="text-xl font-bold text-gray-800">Soy Profesional</h3>
                    <p className="text-gray-600 flex-grow">Quiero ofrecer mis servicios, dar visibilidad a mi trabajo y hacer crecer mi negocio.</p>
                    <span className="py-2 px-4 bg-green-500 text-white font-semibold rounded-lg text-sm shadow-md">Elegir Profesional →</span>
                </button>
            </div>
        </div>
    );

    // VISTA 2: FORMULARIO BASE (CLIENTE Y PROFESIONAL)
    const renderFormStep = (role) => (
        <div className={baseCard}>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Completar Datos de {role === 'client' ? 'Cliente' : 'Profesional'}
            </h2>
            <p className="text-gray-600 mb-6">
                {role === 'client' 
                    ? 'Necesitamos tu nombre real y teléfono para verificar tu identidad al solicitar servicios.'
                    : '¡Bienvenido! Completa estos datos para crear tu perfil público.'
                }
            </p>

            <form onSubmit={handleSubmitProfile} className="space-y-4">
                <label className="block text-gray-700 font-medium">Nombre y Apellido Reales:</label>
                <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej: Juan Pérez"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />
                
                <label className="block text-gray-700 font-medium">Número de Teléfono (WhatsApp):</label>
                <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej: 3456123456"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />

                {/* Campo específico para Profesionales */}
                {role === 'professional' && (
                    <>
                        <label className="block text-gray-700 font-medium">Categoría Principal de Servicio:</label>
                        <select 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)} 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                            required
                        >
                            <option value="" disabled>Selecciona un servicio...</option>
                            <option value="carpinteria">Carpintería</option>
                            <option value="electricidad">Electricidad</option>
                            <option value="plomeria">Plomería</option>
                            <option value="jardineria">Jardinería</option>
                            <option value="nineria">Niñera/Cuidado</option>
                            <option value="albanileria">Albañilería</option>
                            <option value="informatica">Informática/Reparación PC</option>
                        </select>
                    </>
                )}

                <div className="flex justify-between pt-4">
                    <button 
                        type="button" 
                        onClick={() => setProfileStep('select-role')} 
                        className="flex items-center text-gray-600 hover:text-gray-800 font-medium transition"
                    >
                        <span className="mr-1">←</span> Volver a Roles
                    </button>
                    <button 
                        type="submit" 
                        className="py-2 px-6 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 transform hover:scale-[1.02]"
                    >
                        {role === 'client' ? 'Guardar y Entrar' : 'Crear Perfil Profesional'}
                    </button>
                </div>
            </form>
        </div>
    );

    return (
        <div className={baseContainer}>
            {profileStep === 'select-role' && renderRoleSelectionStep()}
            {profileStep === 'client-form' && renderFormStep('client')}
            {profileStep === 'professional-form' && renderFormStep('professional')}
        </div>
    );
};

// --- VISTA: Dashboard (Simulación de página principal) ---

const renderDashboard = () => (
    <div className="min-h-screen bg-indigo-50 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-6 sm:p-8 space-y-6">
            <header className="flex justify-between items-center border-b pb-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-indigo-700">Dashboard</h1>
                    <p className="text-lg text-gray-600">
                        Estás logueado como: <span className="font-semibold text-indigo-600">{currentUser?.email}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                        Rol: <span className="font-medium text-gray-700">{selectedRole}</span>
                    </p>
                </div>
                <button
                    onClick={handleLogout}
                    className="py-2 px-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
                >
                    Cerrar Sesión
                </button>
            </header>

            <div className="text-center p-10 bg-indigo-100 rounded-lg border-2 border-dashed border-indigo-300">
                <p className="text-xl text-indigo-800 font-medium">
                    ¡Felicidades! Tu perfil ha sido completado.
                </p>
                <p className="mt-2 text-indigo-600">
                    Aquí iría la vista principal de tu aplicación, mostrando contenido específico para tu rol.
                </p>
            </div>
        </div>
    </div>
);

// --- Lógica de renderizado principal ---

const renderView = () => {
    if (currentView === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="ml-3 text-lg font-medium text-indigo-600">Cargando aplicación...</span>
            </div>
        );
    }

    switch (currentView) {
        case 'home':
            return renderHome();
        case 'login':
            return renderAuthModal();
        case 'register':
            return renderAuthModal(); // Utiliza el mismo modal, cambiando el modo
        case 'profile-step-1':
            return renderProfileCompletion();
        case 'dashboard':
            return renderDashboard();
        default:
            return renderHome();
    }
};

// La función `useEffect` necesita una forma de obtener el rol del perfil para el dashboard
// Hago una llamada única para cargar el rol al entrar al dashboard
useEffect(() => {
    if (currentView === 'dashboard' && currentUser && !selectedRole) {
        getUserProfile(currentUser.uid).then(profile => {
            if (profile) setSelectedRole(profile.role);
        }).catch(e => console.error("Error al cargar el rol:", e));
    }
}, [currentView, currentUser, selectedRole]);


return (
    <>
        {renderView()}
        <Notification 
            message={notification.message} 
            type={notification.type} 
            onClose={() => setNotification({ message: '', type: '' })} 
        />
    </>
);
};

export default App;