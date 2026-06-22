"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);
  
  // Estado del Carrito
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Estado del Checkout (Pasarela Simulada)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({ nombre: '', tarjeta: '', vto: '', cvv: '' });

  // Refrescar productos
  const fetchProductos = () => {
    fetch('http://localhost:8080/api/productos')
      .then(res => res.json())
      .then(data => {
        setProductos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // Agregar al carrito
  const addToCart = (producto) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === producto.id);
      if (existing) {
        if (existing.cantidad >= producto.stock) return prev; // No exceder stock
        return prev.map(item => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item);
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  // Remover del carrito
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const totalCart = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  const cartItemsCount = cart.reduce((acc, item) => acc + item.cantidad, 0);

  // Procesar Pago Simulado
  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simular tiempo de validación bancaria
    await new Promise(r => setTimeout(r, 2000));

    try {
      // Registrar cada venta individualmente (idealmente esto se haría en batch en el backend, pero para el prototipo está bien)
      for (const item of cart) {
        await fetch('http://localhost:8080/api/ventas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cliente: checkoutForm.nombre,
            productoId: item.id,
            cantidad: item.cantidad,
            total: item.precio * item.cantidad
          })
        });
      }

      setPaymentSuccess(true);
      setIsProcessing(false);
      setCart([]); // Vaciar carrito
      fetchProductos(); // Actualizar stock visual
      
      // Cerrar modal después de unos segundos
      setTimeout(() => {
        setPaymentSuccess(false);
        setIsCheckoutOpen(false);
        setIsCartOpen(false);
        setCheckoutForm({ nombre: '', tarjeta: '', vto: '', cvv: '' });
      }, 3000);

    } catch (err) {
      console.error("Error al procesar pago", err);
      setIsProcessing(false);
      alert("Hubo un error procesando el pago");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-rose-200">
      {/* Navbar Premium */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-rose-200">
              🌸
            </div>
            <h1 className="text-2xl font-black tracking-tight text-neutral-800">FlorGest</h1>
          </div>
          <nav className="flex items-center gap-6">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-neutral-600 hover:text-rose-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                  {cartItemsCount}
                </span>
              )}
            </button>
            <Link 
              href="/login" 
              className="group relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 bg-neutral-900 border border-transparent rounded-full hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 shadow-md hover:shadow-xl hover:-translate-y-0.5"
            >
              Acceso Empleados
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section Elegante */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        <div className="absolute top-0 -left-40 w-96 h-96 bg-rose-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-0 -right-40 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32 lg:px-8 lg:py-40 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-neutral-900 mb-6 drop-shadow-sm">
            Arte en <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">cada pétalo.</span>
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-neutral-600 max-w-3xl mx-auto font-light leading-relaxed">
            Descubre nuestra exclusiva colección de arreglos florales diseñados para transformar tus momentos especiales en recuerdos inolvidables.
          </p>
        </div>
      </section>

      {/* Catálogo Grid */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Colección Exclusiva</h2>
            <p className="text-neutral-500 mt-2 text-lg">Seleccionadas cuidadosamente por nuestros floristas expertos.</p>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
          </div>
        ) : productos.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-neutral-100 shadow-sm text-center">
            <span className="text-6xl mb-4 block">🥀</span>
            <h3 className="text-xl font-medium text-neutral-800">Aún no hay flores disponibles</h3>
            <p className="text-neutral-500 mt-2">Vuelve más tarde para descubrir nuestras nuevas colecciones.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {productos.map(producto => (
              <div 
                key={producto.id} 
                className="group bg-white rounded-3xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-2xl transition-all duration-500 ease-out hover:-translate-y-2 flex flex-col h-full cursor-pointer relative"
                onMouseEnter={() => setHoveredId(producto.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="relative h-72 w-full overflow-hidden bg-neutral-100">
                  {producto.imageUrl ? (
                    <img 
                      src={producto.imageUrl} 
                      alt={producto.nombre} 
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl bg-rose-50">💐</div>
                  )}
                  <div className={`absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  {producto.stock === 0 && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-neutral-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                      AGOTADO
                    </div>
                  )}
                  {producto.stock > 0 && producto.stock <= 5 && (
                    <div className="absolute top-4 right-4 bg-orange-500/90 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                      ¡ÚLTIMOS {producto.stock}!
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow bg-white z-10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold tracking-wider text-rose-500 uppercase bg-rose-50 px-3 py-1 rounded-full">
                      {producto.categoria}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-800 leading-tight mb-4 group-hover:text-rose-600 transition-colors">
                    {producto.nombre}
                  </h3>
                  
                  <div className="mt-auto flex items-end justify-between">
                    <div>
                      <p className="text-sm text-neutral-500 font-medium mb-1">Precio</p>
                      <p className="text-2xl font-black text-neutral-900">
                        {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(producto.precio)}
                      </p>
                    </div>
                    <button 
                      onClick={() => addToCart(producto)}
                      disabled={producto.stock === 0}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        producto.stock === 0 
                        ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' 
                        : 'bg-neutral-900 text-white hover:bg-rose-500 hover:shadow-lg hover:shadow-rose-300 hover:scale-110 active:scale-95'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Cart Drawer Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 transition-opacity" onClick={() => setIsCartOpen(false)}></div>
      )}

      {/* Cart Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-800">Tu Carrito ({cartItemsCount})</h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 text-neutral-400 hover:text-neutral-800 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral-400">
              <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="w-20 h-20 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.nombre} className="w-full h-full object-cover"/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl bg-rose-50">💐</div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-neutral-800 line-clamp-1">{item.nombre}</h4>
                  <p className="text-rose-600 font-bold mt-1">
                    {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(item.precio)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-neutral-500">Cant: {item.cantidad}</span>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-neutral-400 hover:text-red-500 p-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 bg-neutral-50 border-t border-neutral-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-neutral-600 font-medium">Total</span>
              <span className="text-2xl font-black text-neutral-900">
                {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(totalCart)}
              </span>
            </div>
            <button 
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full bg-neutral-900 hover:bg-rose-600 text-white font-bold py-4 rounded-xl transition-colors shadow-lg"
            >
              Proceder al Pago
            </button>
          </div>
        )}
      </div>

      {/* Checkout Modal Simulador */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
            {paymentSuccess ? (
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-neutral-800 mb-2">¡Pago Exitoso!</h3>
                <p className="text-neutral-500">Tu pedido ha sido procesado y el stock ha sido actualizado.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-neutral-800">Pasarela de Pagos</h3>
                  <button onClick={() => !isProcessing && setIsCheckoutOpen(false)} className="text-neutral-400 hover:text-neutral-800">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mb-6 p-4 bg-rose-50 rounded-xl flex items-center justify-between border border-rose-100">
                  <span className="font-medium text-rose-800">Total a pagar:</span>
                  <span className="text-xl font-black text-rose-600">
                    {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(totalCart)}
                  </span>
                </div>

                <form onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Nombre en la tarjeta</label>
                    <input type="text" required value={checkoutForm.nombre} onChange={e => setCheckoutForm({...checkoutForm, nombre: e.target.value})} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all font-medium" placeholder="Juan Pérez" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Número de tarjeta</label>
                    <input type="text" required maxLength="16" value={checkoutForm.tarjeta} onChange={e => setCheckoutForm({...checkoutForm, tarjeta: e.target.value})} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all font-medium font-mono" placeholder="4111 1111 1111 1111" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Vencimiento</label>
                      <input type="text" required maxLength="5" value={checkoutForm.vto} onChange={e => setCheckoutForm({...checkoutForm, vto: e.target.value})} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all font-medium font-mono" placeholder="MM/YY" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">CVV</label>
                      <input type="text" required maxLength="4" value={checkoutForm.cvv} onChange={e => setCheckoutForm({...checkoutForm, cvv: e.target.value})} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all font-medium font-mono" placeholder="123" />
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isProcessing}
                    className="w-full mt-6 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Procesando...
                      </div>
                    ) : 'Pagar Ahora'}
                  </button>
                  <p className="text-center text-xs text-neutral-400 mt-4">Modo de prueba. No se realizarán cobros reales.</p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Footer Minimalista */}
      <footer className="bg-white border-t border-neutral-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <span className="text-xl">🌸</span>
            <span className="text-lg font-bold text-neutral-800">FlorGest</span>
          </div>
          <p className="text-neutral-500 text-sm font-medium">© 2026 FlorGest. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
