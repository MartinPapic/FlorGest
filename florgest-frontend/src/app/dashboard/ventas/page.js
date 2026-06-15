'use client';

import { useState } from 'react';

export default function VentasPage() {
  const [items] = useState([
    { id: 1, nombre: 'Rosa Roja', cantidad: 2, precio: 5.00, subtotal: 10.00 }
  ]);

  const total = items.reduce((acc, item) => acc + item.subtotal, 0);

  return (
    <div className="space-y-6 max-w-4xl">
      <h3 className="text-2xl font-bold text-gray-800">Nueva Venta</h3>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        
        {/* Formulario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">Buscar cliente...</option>
              <option value="1">Cliente Casual</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
            <div className="flex space-x-2">
              <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">Buscar producto...</option>
                <option value="1">Rosa Roja</option>
                <option value="2">Tulipán</option>
              </select>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                Agregar
              </button>
            </div>
          </div>
        </div>

        {/* Tabla de Items */}
        <div className="border border-gray-200 rounded-lg overflow-hidden mt-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500">
                <th className="p-3">Producto</th>
                <th className="p-3 text-center">Cant.</th>
                <th className="p-3 text-right">Precio</th>
                <th className="p-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="p-3 text-gray-900 font-medium">{item.nombre}</td>
                  <td className="p-3 text-center text-gray-700">{item.cantidad}</td>
                  <td className="p-3 text-right text-gray-700">S/ {item.precio.toFixed(2)}</td>
                  <td className="p-3 text-right text-gray-900 font-medium">S/ {item.subtotal.toFixed(2)}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-500">No hay productos agregados</td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-gray-50 border-t border-gray-200">
              <tr>
                <td colSpan="3" className="p-4 text-right font-bold text-gray-700 uppercase tracking-wider text-sm">Total:</td>
                <td className="p-4 text-right font-bold text-lg text-gray-900">S/ {total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Acciones */}
        <div className="flex justify-end pt-4">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
            Registrar Venta
          </button>
        </div>

      </div>
    </div>
  );
}
