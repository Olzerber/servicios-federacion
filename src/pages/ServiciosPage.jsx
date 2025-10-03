import React, { useState, useEffect, useContext } from 'react';
import './ServiciosPage.css';
import ProfessionalCards from '../components/ProfessionalCards';
import { getProfessionalProfiles } from '../firestore'; 
import { AuthContext } from '../App';

const ServiciosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const CATEGORIES = [
    { value: 'carpinteria', label: 'Carpintería' },
    { value: 'electricidad', label: 'Electricidad' },
    { value: 'plomeria', label: 'Plomería' },
    { value: 'jardineria', label: 'Jardinería' },
    { value: 'nineria', label: 'Niñera/Cuidado' },
    { value: 'albanileria', label: 'Albañilería' },
    { value: 'informatica', label: 'Informática/Reparación PC' },
  ];

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setLoading(true);
        const data = await getProfessionalProfiles(user?.uid); 
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
  }, [user?.uid]);

  const filteredProfessionals = professionals.filter(pro => {
    // Filtrado por categoría
    const categoryMatch = selectedCategory 
      ? pro.categories && pro.categories.includes(selectedCategory)
      : true;
    
    // Filtrado por búsqueda
    const term = searchTerm.toLowerCase().trim();
    const termMatch = !term || 
                      (pro.fullName && pro.fullName.toLowerCase().includes(term)) ||
                      (pro.categories && pro.categories.some(cat => cat.toLowerCase().includes(term)));
                      
    return categoryMatch && termMatch;
  });
  
  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div className="container">
      <div className="card" style={{ padding: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-2xl)', marginTop: 'var(--spacing-3xl)' }}>
        <h2 style={{fontSize: 'var(--text-2xl)', color: 'var(--text-primary)', marginBottom: 'var(--spacing-lg)'}}>
          Encontrá el profesional que necesitás
        </h2>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 'var(--spacing-md)', maxWidth: '800px', margin: '0 auto', marginBottom: 'var(--spacing-lg)' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <span className="material-icons-round" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              search
            </span>
            <input
              type="text"
              placeholder="¿Qué servicio buscás hoy? (Ej: Plomero)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

      {loading && <p style={{textAlign: 'center', fontSize: 'var(--text-lg)'}}>Cargando lista de profesionales...</p>}
      {error && <p style={{textAlign: 'center', color: 'red', fontSize: 'var(--text-lg)'}}>{error}</p>}
      
      {!loading && (
        <ProfessionalCards professionals={filteredProfessionals} showTitle={false}/>
      )}
    </div>
  );
};

export default ServiciosPage;