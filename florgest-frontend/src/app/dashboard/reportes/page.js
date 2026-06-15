export default function ReportesPage() {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800">Reportes de Negocio</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Placeholder Gráfico Ventas */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">Ventas Mensuales</h4>
          <div className="h-64 bg-gray-50 rounded-lg flex items-end justify-between p-4 border border-gray-100">
            <div className="w-1/6 bg-blue-200 rounded-t-md h-1/4"></div>
            <div className="w-1/6 bg-blue-300 rounded-t-md h-2/4"></div>
            <div className="w-1/6 bg-blue-400 rounded-t-md h-1/3"></div>
            <div className="w-1/6 bg-blue-500 rounded-t-md h-3/4"></div>
            <div className="w-1/6 bg-blue-600 rounded-t-md h-full"></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>Ene</span><span>Feb</span><span>Mar</span><span>Abr</span><span>May</span>
          </div>
        </div>

        {/* Placeholder Tabla Top Productos */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">Productos más vendidos</h4>
          <ul className="space-y-4">
            <li className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold mr-3">1</span>
                <span className="font-medium text-gray-800">Rosa Roja</span>
              </div>
              <span className="text-gray-600">120 unid.</span>
            </li>
            <li className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center font-bold mr-3">2</span>
                <span className="font-medium text-gray-800">Girasol</span>
              </div>
              <span className="text-gray-600">85 unid.</span>
            </li>
            <li className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold mr-3">3</span>
                <span className="font-medium text-gray-800">Lirio</span>
              </div>
              <span className="text-gray-600">60 unid.</span>
            </li>
          </ul>
          <button className="mt-6 w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors border border-gray-200">
            Exportar a PDF
          </button>
        </div>
      </div>
    </div>
  );
}
