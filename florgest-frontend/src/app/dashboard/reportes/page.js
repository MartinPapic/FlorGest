"use client";
import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export default function ReportesPage() {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  
  // Data Procesada
  const [datosVentasMes, setDatosVentasMes] = useState([]);
  const [topProductos, setTopProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resVentas, resProd] = await Promise.all([
          fetch('http://localhost:8080/api/ventas'),
          fetch('http://localhost:8080/api/productos')
        ]);
        const dataVentas = await resVentas.json();
        const dataProd = await resProd.json();
        
        setVentas(dataVentas);
        setProductos(dataProd);
        procesarDatos(dataVentas, dataProd);
      } catch (err) {
        console.error("Error cargando reportes", err);
      }
      setLoading(false);
    };
    
    fetchData();
  }, []);

  const procesarDatos = (todasVentas, todosProductos, inicio = '', fin = '') => {
    let ventasFiltradas = todasVentas;
    
    if (inicio && fin) {
      const start = new Date(inicio);
      const end = new Date(fin);
      end.setHours(23, 59, 59); // Fin del día
      
      ventasFiltradas = todasVentas.filter(v => {
        const d = new Date(v.fecha);
        return d >= start && d <= end;
      });
    }

    // 1. Calcular Ventas por Mes
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const ventasPorMesObj = {};
    
    ventasFiltradas.forEach(v => {
      const fecha = new Date(v.fecha);
      const mesKey = `${meses[fecha.getMonth()]} ${fecha.getFullYear()}`;
      ventasPorMesObj[mesKey] = (ventasPorMesObj[mesKey] || 0) + v.total;
    });

    const dataGrafico = Object.keys(ventasPorMesObj).map(mes => ({
      mes,
      total: ventasPorMesObj[mes]
    }));
    setDatosVentasMes(dataGrafico);

    // 2. Calcular Top Productos
    const prodVendidos = {};
    ventasFiltradas.forEach(v => {
      prodVendidos[v.productoId] = (prodVendidos[v.productoId] || 0) + v.cantidad;
    });

    const ranking = Object.keys(prodVendidos).map(id => {
      const p = todosProductos.find(prod => prod.id === parseInt(id));
      return {
        id,
        nombre: p ? p.nombre : `Producto ${id}`,
        cantidad: prodVendidos[id]
      };
    }).sort((a, b) => b.cantidad - a.cantidad).slice(0, 5); // Top 5

    setTopProductos(ranking);
  };

  const handleFiltrar = (e) => {
    e.preventDefault();
    if (fechaInicio && fechaFin) {
      procesarDatos(ventas, productos, fechaInicio, fechaFin);
    } else {
      procesarDatos(ventas, productos); // Reset
    }
  };

  const handleImprimir = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <h3 className="text-2xl font-bold text-gray-800">Reportes de Negocio</h3>
        
        <form onSubmit={handleFiltrar} className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Desde:</label>
            <input 
              type="date" 
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Hasta:</label>
            <input 
              type="date" 
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded transition-colors">
            Filtrar
          </button>
        </form>
      </div>

      {/* Título solo visible en impresión */}
      <h2 className="hidden print:block text-3xl font-bold text-center mb-8">Reporte Oficial de Ventas - FlorGest</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Gráfico Ventas */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 print:shadow-none print:border-gray-400">
          <h4 className="text-lg font-semibold text-gray-700 mb-6">Evolución Mensual de Ventas</h4>
          <div className="h-64">
            {loading ? (
              <div className="h-full flex items-center justify-center text-gray-400">Cargando...</div>
            ) : datosVentasMes.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datosVentasMes}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} 
                         tickFormatter={(val) => `$${val/1000}k`} />
                  <Tooltip 
                    formatter={(value) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value)}
                    cursor={{fill: '#f3f4f6'}}
                  />
                  <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">No hay ventas registradas</div>
            )}
          </div>
        </div>

        {/* Tabla Top Productos */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 print:shadow-none print:border-gray-400">
          <h4 className="text-lg font-semibold text-gray-700 mb-6">Productos más vendidos</h4>
          
          {loading ? (
             <div className="h-full flex items-center justify-center text-gray-400 pb-12">Cargando...</div>
          ) : topProductos.length === 0 ? (
             <div className="h-full flex items-center justify-center text-gray-400 pb-12">No hay ventas registradas</div>
          ) : (
            <ul className="space-y-4">
              {topProductos.map((prod, idx) => (
                <li key={prod.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 ${
                      idx === 0 ? 'bg-yellow-100 text-yellow-600' :
                      idx === 1 ? 'bg-gray-200 text-gray-600' :
                      idx === 2 ? 'bg-orange-100 text-orange-600' :
                      'bg-blue-50 text-blue-600'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="font-medium text-gray-800">{prod.nombre}</span>
                  </div>
                  <span className="text-gray-600 font-medium">{prod.cantidad} unid. vendidas</span>
                </li>
              ))}
            </ul>
          )}

          <button onClick={handleImprimir} className="print:hidden mt-6 w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors border border-gray-200 flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            Exportar a PDF / Imprimir
          </button>
        </div>
      </div>
    </div>
  );
}
