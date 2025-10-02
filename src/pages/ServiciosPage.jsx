import React, { useState, useEffect } from 'react';
import ProfessionalCards from '../components/ProfessionalCards';
import { getProfessionalProfiles } from '../firestore'; 

const ServiciosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(''); // Estado para la categoría seleccionada
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lista de categorías (debe coincidir con las opciones de CompleteProfile.jsx)
  const CATEGORIES = [
    { value: 'carpinteria', label: 'Carpintería' },
    { value: 'electricidad', label: 'Electricidad' },
    { value: 'plomeria', label: 'Plomería' },
    { value: 'jardineria', label: 'Jardinería' },
    { value: 'nineria', label: 'Niñera/Cuidado' },
    { value: 'albanileria', label: 'Albañilería' },
    { value: 'informatica', label: 'Informática/Reparación PC' },
  ];

  // Carga inicial de profesionales
  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setLoading(true);
        // Llama a la nueva función de firestore.js
        const data = await getProfessionalProfiles(); 
        setProfessionals(data);
        setError(null);
      } catch (err) {
        console.error("Error al cargar profesionales:", err);
        setError("No pudimos cargar los profesionales en este momento. Intenta más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  // Lógica de filtrado (se realiza en el frontend)
  const filteredProfessionals = professionals.filter(pro => {
    // 1. Filtrado por categoría
    const categoryMatch = selectedCategory ? pro.category === selectedCategory : true;
    
    // 2. Filtrado por término de búsqueda (nombre, categoría)
    const term = searchTerm.toLowerCase().trim();
    const termMatch = !term || 
                      (pro.fullName && pro.fullName.toLowerCase().includes(term)) ||
                      (pro.category && pro.category.toLowerCase().includes(term));
                      
    return categoryMatch && termMatch;
  });
  
  // La función de búsqueda solo evita el recargo de página si es reactivo
  const handleSearch = (e) => {
    e.preventDefault();
  };

  const SearchComponent = () => (
    <div className="card" style={{ padding: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-2xl)', marginTop: 'var(--spacing-3xl)' }}>
        <h2 style={{fontSize: 'var(--text-2xl)', color: 'var(--text-primary)', marginBottom: 'var(--spacing-lg)'}}>
            Encontrá el profesional que necesitás
        </h2>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 'var(--spacing-md)', maxWidth: '800px', margin: '0 auto', marginBottom: 'var(--spacing-lg)' }}>
            <div style={{ flex: 1, position: 'relative' }}>
                {/* Se asume que tienes un ícono de búsqueda en tus estilos */}
                <span className="material-icons-round" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    search
                </span>
                <input
                    type="text"
                    placeholder="¿Qué servicio buscás hoy? (Ej: Plomero)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    // Estilo in-line para sobreescribir el padding si es necesario
                    style={{ paddingLeft: '40px' }} 
                />
            </div>
            <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ minWidth: '150px' }}
            >
                <option value="">Todas las Categorías</option>
                {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
            </select>
            <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                Buscar
            </button>
        </form>
    </div>
  );


  return (
    <div className="container">
      {SearchComponent()}

      {loading && <p style={{textAlign: 'center', fontSize: 'var(--text-lg)'}}>Cargando lista de profesionales...</p>}
      {error && <p style={{textAlign: 'center', color: 'red', fontSize: 'var(--text-lg)'}}>{error}</p>}
      
      {!loading && (
        // El componente ProfessionalCards ahora recibe los datos filtrados
        <ProfessionalCards professionals={filteredProfessionals} showTitle={false}/>
      )}

    </div>
  );
};

export default ServiciosPage;