'use client';

import { useState, useEffect } from 'react';

export default function VentasPage() {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // POS Form State
  const [cliente, setCliente] = useState('Cliente Casual');
  const [productoId, setProductoId] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resVentas, resProd] = await Promise.all([
        fetch('http://localhost:8080/api/ventas'),
        fetch('http://localhost:8080/api/productos')
      ]);
      const dataVentas = await resVentas.json();
      const dataProd = await resProd.json();
      
      setProductos(dataProd);
      setVentas(dataVentas.sort((a,b) => new Date(b.fecha) - new Date(a.fecha)));
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getProductName = (id) => {
    const p = productos.find(prod => prod.id === id);
    return p ? p.nombre : `ID: ${id}`;
  };

  const handleEstadoChange = async (id, nuevoEstado) => {
    try {
      await fetch(`http://localhost:8080/api/ventas/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      fetchData();
    } catch (error) {
      console.error("Error actualizando estado", error);
    }
  };

  const handleRegistrarVentaPOS = async (e) => {
    e.preventDefault();
    if (!productoId || cantidad < 1) return;
    
    const prodSeleccionado = productos.find(p => p.id === parseInt(productoId));
    if (!prodSeleccionado) return;
    
    if (prodSeleccionado.stock < cantidad) {
      setMensaje({ tipo: 'error', texto: `Stock insuficiente. Solo quedan ${prodSeleccionado.stock} unidades de ${prodSeleccionado.nombre}.` });
      return;
    }

    const totalCalculado = prodSeleccionado.precio * cantidad;

    try {
      const res = await fetch('http://localhost:8080/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente,
          productoId: prodSeleccionado.id,
          cantidad: parseInt(cantidad),
          total: totalCalculado
        })
      });

      if (res.ok) {
        setMensaje({ tipo: 'exito', texto: 'Venta registrada exitosamente.' });
        setProductoId('');
        setCantidad(1);
        fetchData();
      } else {
        setMensaje({ tipo: 'error', texto: 'Error al registrar la venta.' });
      }
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Error de conexión con el servidor.' });
    }
  };

  const getStatusColor = (estado) => {
    switch(estado) {
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
      case 'PREPARANDO': return 'bg-blue-100 text-blue-800';
      case 'ENTREGADO': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* SECCIÓN 1: POS (PUNTO DE VENTA MANUAL) */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Punto de Venta (POS)</h3>
        {mensaje.texto && (
          <div className={`mb-4 p-4 rounded-lg text-sm font-medium ${mensaje.tipo === 'exito' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {mensaje.texto}
          </div>
        )}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleRegistrarVentaPOS} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <input 
                type="text" 
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
              <select 
                value={productoId}
                onChange={(e) => setProductoId(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona un producto...</option>
                {productos.map(p => (
                  <option key={p.id} value={p.id} disabled={p.stock === 0}>
                    {p.nombre} - {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(p.precio)} (Stock: {p.stock})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-4">
              <div className="w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cant.</label>
                <input 
                  type="number" 
                  min="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors">
                Registrar Venta
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* SECCIÓN 2: HISTORIAL DE PEDIDOS Y VENTAS */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Historial de Ventas y Pedidos</h3>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  <th className="p-4">ID Pedido</th>
                  <th className="p-4">Fecha</th>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Producto</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {loading ? (
                  <tr><td colSpan="7" className="p-4 text-center text-gray-500">Cargando pedidos...</td></tr>
                ) : ventas.length === 0 ? (
                  <tr><td colSpan="7" className="p-4 text-center text-gray-500">No hay pedidos registrados.</td></tr>
                ) : (
                  ventas.map((venta) => (
                    <tr key={venta.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-gray-900 font-medium">#{venta.id}</td>
                      <td className="p-4 text-gray-600">{new Date(venta.fecha).toLocaleString()}</td>
                      <td className="p-4 text-gray-900">{venta.cliente}</td>
                      <td className="p-4 text-gray-600">{venta.cantidad}x {getProductName(venta.productoId)}</td>
                      <td className="p-4 text-gray-900 font-bold">
                        {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(venta.total)}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(venta.estado)}`}>
                          {venta.estado}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <select 
                          className="border border-gray-300 rounded-md text-sm p-1 outline-none"
                          value={venta.estado}
                          onChange={(e) => handleEstadoChange(venta.id, e.target.value)}
                        >
                          <option value="PENDIENTE">Pendiente</option>
                          <option value="PREPARANDO">Preparando</option>
                          <option value="ENTREGADO">Entregado</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
