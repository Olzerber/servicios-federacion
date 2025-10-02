import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import './Header.css'; // Usaremos los estilos combinados y ajustados

const Header = () => {
    // Usamos el contexto para obtener el estado global y las funciones
    const { user, userProfile, loadingAuth, handleLogout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [menuOpen, setMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const isAuthFlow = location.pathname.includes('/acceder') || location.pathname.includes('/registro') || location.pathname.includes('/elegir-rol') || location.pathname === '/completar-perfil';

    // No renderizar el Header en rutas de flujo de registro
    if (loadingAuth || isAuthFlow) {
        return null;
    }

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
        setIsDropdownOpen(false); // Cierra el dropdown si abres el menú mobile
    };
    const closeMenu = () => setMenuOpen(false);
    const handleDropdownToggle = () => setIsDropdownOpen(!isDropdownOpen);


    // Función auxiliar para obtener el primer nombre
    const getFirstName = (displayName) => {
        return displayName ? displayName.split(' ')[0] : 'Usuario';
    };

    // La información que se mostrará en el Header
    // Usamos el fullName de Firestore, si existe, o el de Google/Email.
    const fullName = userProfile?.fullName || user?.displayName || user?.email; 
    const displayName = getFirstName(fullName);
    const photoURL = user?.photoURL;
    const dashboardPath = userProfile?.role === 'client' ? '/dashboard/cliente' : '/dashboard/profesional';


    const navLinks = (
        <>
            {/* El enlace de Inicio SIEMPRE va a la raíz (/). La guardia de App.jsx decidirá si lo redirige al dashboard. */}
            <Link to="/" className="nav-link" onClick={closeMenu}>Inicio</Link> 
            <Link to="/servicios" className="nav-link" onClick={closeMenu}>Servicios</Link>
            <Link to="/nosotros" className="nav-link" onClick={closeMenu}>Nosotros</Link>
        </>
    );
    
    // Contenido del menú de autenticación (Desktop y Mobile)
    const AuthContent = (
        <>
            {user ? (
                // Usuario logueado: Dropdown de perfil
                <div className="profile-dropdown-container">
                    <button className="profile-trigger" onClick={handleDropdownToggle} aria-expanded={isDropdownOpen}>
                        <span className="user-name-short">{displayName}</span>
                        {photoURL ? (
                            <img src={photoURL} alt={displayName} className="profile-avatar" />
                        ) : (
                            <AccountCircleRoundedIcon className="profile-avatar-icon" />
                        )}
                        <ExpandMoreRoundedIcon className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                        <div className="dropdown-menu card">
                            <p className="menu-greeting">Hola, **{fullName}**</p>
                            <Link to={dashboardPath} className="menu-item" onClick={handleDropdownToggle}>
                                <DashboardRoundedIcon /> Mi Panel
                            </Link>
                            <button onClick={handleLogout} className="menu-item logout-btn">
                                <ExitToAppRoundedIcon /> Cerrar Sesión
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                // Usuario NO logueado: Botones de Acceder y Registrarse
                <div className="auth-buttons-group">
                    <button onClick={() => navigate('/acceder')} className="btn btn-secondary desktop-only">
                        <LoginRoundedIcon style={{ fontSize: 20 }}/> Iniciar Sesión
                    </button>
                    <button 
                        onClick={() => navigate('/elegir-rol')} 
                        className="btn btn-primary"
                    >
                        <PersonAddRoundedIcon style={{ fontSize: 20 }}/> Registrarse
                    </button>
                </div>
            )}
        </>
    );


    return (
        <header className="main-header">
            <div className="header-content container">
                {/* Logo ahora usa Link para navegación limpia */}
                <Link to="/" className="logo"> 
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span className="logo-text">ServiFederación</span> {/* Nombre actualizado */}
                </Link>

                {/* Desktop Nav */}
                <nav className="nav desktop-nav">
                    {navLinks}
                    <div className="user-section">
                        {AuthContent}
                    </div>
                </nav>

                {/* Mobile Toggle */}
                <div className="mobile-only">
                    <button className="menu-toggle" onClick={toggleMenu} aria-label="Abrir menú">
                        {menuOpen ? <CloseOutlinedIcon /> : <MenuRoundedIcon />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="mobile-menu">
                    <nav className="mobile-nav">
                        {navLinks}
                        <div className="mobile-auth">
                            {user ? (
                                <>
                                    <p className="menu-greeting-mobile">Hola, **{fullName}**</p>
                                    <Link to={dashboardPath} className="btn btn-secondary w-full" onClick={closeMenu}>
                                        <DashboardRoundedIcon /> Mi Panel
                                    </Link>
                                    <button onClick={handleLogout} className="btn btn-primary w-full">
                                        <ExitToAppRoundedIcon /> Cerrar Sesión
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => { navigate('/acceder'); closeMenu(); }} className="btn btn-secondary w-full">
                                        <LoginRoundedIcon /> Iniciar Sesión
                                    </button>
                                    <button 
                                        onClick={() => { navigate('/elegir-rol'); closeMenu(); }} 
                                        className="btn btn-primary w-full"
                                    >
                                        <PersonAddRoundedIcon /> Registrarse
                                    </button>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}

export default Header;