export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800">Resumen General</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tarjeta Ventas */}
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm">
          <p className="text-sm font-medium text-blue-600 mb-2">Ventas del día</p>
          <p className="text-3xl font-bold text-blue-900">S/ 1,250.00</p>
        </div>

        {/* Tarjeta Productos */}
        <div className="bg-green-50 p-6 rounded-xl border border-green-100 shadow-sm">
          <p className="text-sm font-medium text-green-600 mb-2">Productos</p>
          <p className="text-3xl font-bold text-green-900">120</p>
        </div>

        {/* Tarjeta Stock Bajo */}
        <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 shadow-sm">
          <p className="text-sm font-medium text-orange-600 mb-2">Stock bajo</p>
          <p className="text-3xl font-bold text-orange-900">15</p>
        </div>
      </div>
    </div>
  );
}
