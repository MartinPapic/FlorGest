"use client";
import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

export default function Dashboard() {
  const [resumen, setResumen] = useState({
    ventasDelDia: 0,
    totalProductos: 0,
    stockBajo: 0
  });

  const [datosVentas, setDatosVentas] = useState([]);
  const [datosStock, setDatosStock] = useState([]);

  useEffect(() => {
    // 1. Cargar Resumen Básico
    fetch('http://localhost:8080/api/dashboard/resumen')
      .then(res => res.json())
      .then(data => setResumen(data))
      .catch(err => console.error(err));

    // 2. Cargar Ventas para Gráfico
    fetch('http://localhost:8080/api/ventas')
      .then(res => res.json())
      .then(ventas => {
        // Agrupar ventas por fecha (simplificado)
        const ventasPorFecha = {};
        ventas.forEach(v => {
          const fecha = new Date(v.fecha).toLocaleDateString();
          ventasPorFecha[fecha] = (ventasPorFecha[fecha] || 0) + v.total;
        });
        
        const dataFormateada = Object.keys(ventasPorFecha).map(fecha => ({
          name: fecha,
          total: ventasPorFecha[fecha]
        })).slice(-7); // Últimos 7 días con ventas
        
        setDatosVentas(dataFormateada);
      });

    // 3. Cargar Productos para Gráfico de Pastel (Stock por Categoría)
    fetch('http://localhost:8080/api/productos')
      .then(res => res.json())
      .then(productos => {
        const stockPorCat = {};
        productos.forEach(p => {
          stockPorCat[p.categoria] = (stockPorCat[p.categoria] || 0) + p.stock;
        });
        
        const dataPastel = Object.keys(stockPorCat).map(cat => ({
          name: cat,
          value: stockPorCat[cat]
        }));
        setDatosStock(dataPastel);
      });
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-gray-800">Resumen General</h3>
      
      {/* Tarjetas Superiores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm transition hover:shadow-md">
          <p className="text-sm font-medium text-blue-600 mb-2">Ventas del día</p>
          <p className="text-3xl font-bold text-blue-900">
            {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(resumen.ventasDelDia)}
          </p>
        </div>

        <div className="bg-green-50 p-6 rounded-xl border border-green-100 shadow-sm transition hover:shadow-md">
          <p className="text-sm font-medium text-green-600 mb-2">Productos en Catálogo</p>
          <p className="text-3xl font-bold text-green-900">{resumen.totalProductos}</p>
        </div>

        <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 shadow-sm transition hover:shadow-md">
          <p className="text-sm font-medium text-orange-600 mb-2">Alertas Stock Bajo</p>
          <p className="text-3xl font-bold text-orange-900">{resumen.stockBajo}</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Gráfico de Barras: Ventas */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h4 className="text-lg font-bold text-gray-800 mb-6">Evolución de Ingresos</h4>
          <div className="h-72">
            {datosVentas.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datosVentas}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
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
              <div className="h-full flex items-center justify-center text-gray-400">Sin datos de ventas</div>
            )}
          </div>
        </div>

        {/* Gráfico de Pastel: Stock */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h4 className="text-lg font-bold text-gray-800 mb-6">Distribución de Inventario</h4>
          <div className="h-72">
            {datosStock.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={datosStock}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {datosStock.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} uds.`, 'Stock']} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">Sin datos de inventario</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
