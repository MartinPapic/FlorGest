"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [alertas, setAlertas] = useState([]);
  const [mostrarAlertas, setMostrarAlertas] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
    } else {
      setUser(JSON.parse(userStr));
    }

    // Verificar stock bajo para alertas
    fetch('http://localhost:8080/api/productos')
      .then(res => res.json())
      .then(data => {
        const bajos = data.filter(p => p.stock <= 5);
        setAlertas(bajos);
      })
      .catch(err => console.error("Error cargando alertas", err));
  }, [router]);

  const getLinkClasses = (path) => {
    const isActive = pathname === path;
    return `flex items-center px-3 py-2.5 rounded-lg font-medium transition-colors ${
      isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
    }`;
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Cargando...</div>;

  const isAdmin = user.rol === 'ADMIN';

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col print:hidden">
        <Link href="/" className="h-16 flex items-center px-6 border-b border-gray-100 hover:bg-gray-50 transition-colors">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-lg mr-3">
            🌸
          </div>
          <span className="text-xl font-bold text-gray-800">FlorGest</span>
        </Link>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          <Link href="/dashboard" className={getLinkClasses('/dashboard')}>
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            Dashboard
          </Link>
          <Link href="/dashboard/productos" className={getLinkClasses('/dashboard/productos')}>
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            Productos
          </Link>
          <Link href="/dashboard/ventas" className={getLinkClasses('/dashboard/ventas')}>
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            Pedidos
          </Link>
          
          {isAdmin && (
            <>
              <Link href="/dashboard/compras" className={getLinkClasses('/dashboard/compras')}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                Compras
              </Link>
              <Link href="/dashboard/reportes" className={getLinkClasses('/dashboard/reportes')}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                Reportes
              </Link>
            </>
          )}
        </nav>
        
        <div className="p-4 border-t border-gray-100">
          <Link href="/login" onClick={handleLogout} className="flex items-center px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Cerrar Sesión
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 relative">
          <h2 className="text-xl font-semibold text-gray-800">Panel de Control</h2>
          <div className="flex items-center space-x-6">
            
            {/* Campana de Notificaciones */}
            <div className="relative">
              <button onClick={() => setMostrarAlertas(!mostrarAlertas)} className="text-gray-500 hover:text-blue-600 transition relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                {alertas.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                    {alertas.length}
                  </span>
                )}
              </button>
              
              {/* Dropdown de Alertas */}
              {mostrarAlertas && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 font-semibold text-gray-700 text-sm">
                    Alertas de Stock
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {alertas.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">Todo en orden ✅</div>
                    ) : (
                      alertas.map(a => (
                        <div key={a.id} className="px-4 py-3 border-b border-gray-100 hover:bg-red-50 transition text-sm">
                          <p className="font-medium text-red-700">⚠️ {a.nombre}</p>
                          <p className="text-gray-600 mt-1">Quedan sólo {a.stock} unidades.</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">{user.nombre}</p>
              <p className="text-xs text-gray-500">{user.rol}</p>
            </div>
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              {user.nombre.charAt(0)}
            </div>
          </div>
        </header>
        
        {/* Content Area */}
        <div className="p-8 flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
