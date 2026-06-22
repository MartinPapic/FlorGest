"use client";
import { useState, useEffect } from 'react';

export default function Compras() {
  const [productos, setProductos] = useState([]);
  const [proveedor, setProveedor] = useState('');
  const [productoId, setProductoId] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [total, setTotal] = useState('');
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    fetch('http://localhost:8080/api/productos')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error(err));
  }, []);

  const handleRegistrarCompra = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/compras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proveedor,
          productoId: parseInt(productoId),
          cantidad: parseInt(cantidad),
          total: parseFloat(total)
        })
      });

      if (response.ok) {
        setMensaje({ tipo: 'exito', texto: 'Compra registrada exitosamente. El stock ha sido actualizado.' });
        setProveedor('');
        setProductoId('');
        setCantidad('');
        setTotal('');
      } else {
        const errorData = await response.json();
        setMensaje({ tipo: 'error', texto: errorData.error || 'Error al registrar la compra' });
      }
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'No se pudo conectar con el servidor' });
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800">Registrar Compra (Ingreso de Stock)</h3>
      
      {mensaje.texto && (
        <div className={`p-4 rounded-lg text-sm font-medium ${mensaje.tipo === 'exito' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {mensaje.texto}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm max-w-2xl">
        <form onSubmit={handleRegistrarCompra} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
            <input 
              type="text" 
              value={proveedor} 
              onChange={(e) => setProveedor(e.target.value)} 
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej. Florería Mayorista San Juan"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Producto a Abastecer</label>
            <select 
              value={productoId} 
              onChange={(e) => setProductoId(e.target.value)} 
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccione un producto</option>
              {productos.map(p => (
                <option key={p.id} value={p.id}>{p.nombre} (Stock actual: {p.stock})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad Comprada</label>
              <input 
                type="number" 
                min="1"
                value={cantidad} 
                onChange={(e) => setCantidad(e.target.value)} 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Pagado (CLP)</label>
              <input 
                type="number" 
                step="0.01"
                min="0"
                value={total} 
                onChange={(e) => setTotal(e.target.value)} 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors mt-4"
          >
            Registrar e Ingresar a Inventario
          </button>
        </form>
      </div>
    </div>
  );
}
