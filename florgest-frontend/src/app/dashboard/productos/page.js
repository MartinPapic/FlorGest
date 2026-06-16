'use client';

import { useState } from 'react';

const PRODUCTOS_MOCK = [
  { id: 1, nombre: 'Rosa Roja', categoria: 'Rosas', precio: 5.00, stock: 50 },
  { id: 2, nombre: 'Tulipán', categoria: 'Tulipanes', precio: 4.50, stock: 30 },
  { id: 3, nombre: 'Girasol', categoria: 'Girasoles', precio: 6.00, stock: 25 },
  { id: 4, nombre: 'Lirio', categoria: 'Lirios', precio: 7.00, stock: 20 },
];

export default function ProductosPage() {
  const [productos] = useState(PRODUCTOS_MOCK);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-800">Catálogo de Productos</h3>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center shadow-sm">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Nuevo
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </span>
            <input 
              type="text" 
              placeholder="Buscar producto..." 
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <th className="p-4">Producto</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Precio</th>
                <th className="p-4">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {productos.map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-900 font-medium">{prod.nombre}</td>
                  <td className="p-4 text-gray-600">{prod.categoria}</td>
                  <td className="p-4 text-gray-900">S/ {prod.precio.toFixed(2)}</td>
                  <td className="p-4 text-gray-600">{prod.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
