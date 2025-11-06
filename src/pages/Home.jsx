import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="container py-28 px-6 animate-fadeIn">
      <div className="max-w-6xl mx-auto text-center mb-32">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full mb-10 shadow-sm animate-slideUp">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Simulation en ligne</span>
        </div>
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold mb-8 text-gray-900 leading-[1.05] tracking-tight animate-slideUp">
          Simulez votre crédit
          <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite] mt-3">
            en toute transparence
          </span>
        </h1>
        <p className="text-2xl md:text-3xl text-gray-600 mb-6 font-light max-w-4xl mx-auto leading-relaxed animate-slideUp">
          Obtenez une estimation précise de votre mensualité en quelques instants
        </p>
        <div className="flex items-center justify-center gap-6 text-base text-gray-500 animate-slideUp">
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Gratuit
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Sans engagement
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Réponse immédiate
          </span>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto mb-40 animate-scaleIn">
        <div className="bg-gradient-to-br from-white via-blue-50/30 to-white rounded-3xl shadow-2xl p-14 border border-gray-200/60 hover:shadow-3xl hover:scale-[1.02] transition-all duration-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-blue-600/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10 text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 flex items-center justify-center mx-auto shadow-xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-5m-5 5h.01M19 21a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V21z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Commencez votre simulation
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Quelques informations simples suffisent pour connaître votre mensualité
            </p>
          </div>
          
          <Link 
            to="/simulation"
            className="relative z-10 inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-5 px-10 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] group"
          >
            <span className="relative z-10">Démarrer la simulation</span>
            <svg className="ml-3 w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="group bg-gradient-to-br from-white to-blue-50/30 rounded-3xl shadow-lg p-12 border border-gray-200/60 hover:shadow-2xl hover:border-blue-300 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl group-hover:bg-blue-300/30 transition-all duration-500"></div>
          <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-8 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors">Crédit Auto</h3>
          <p className="text-gray-600 leading-relaxed">
            Financement de votre véhicule avec des conditions adaptées et des taux compétitifs.
          </p>
        </div>
        <div className="group bg-gradient-to-br from-white to-green-50/30 rounded-3xl shadow-lg p-12 border border-gray-200/60 hover:shadow-2xl hover:border-green-300 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/20 rounded-full blur-3xl group-hover:bg-green-300/30 transition-all duration-500"></div>
          <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-8 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-green-600 transition-colors">Crédit Consommation</h3>
          <p className="text-gray-600 leading-relaxed">
            Réalisez vos projets personnels avec des solutions de financement flexibles.
          </p>
        </div>
        <div className="group bg-gradient-to-br from-white to-purple-50/30 rounded-3xl shadow-lg p-12 border border-gray-200/60 hover:shadow-2xl hover:border-purple-300 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/20 rounded-full blur-3xl group-hover:bg-purple-300/30 transition-all duration-500"></div>
          <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-8 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-purple-600 transition-colors">Crédit Immobilier</h3>
          <p className="text-gray-600 leading-relaxed">
            Accédez à la propriété avec un accompagnement personnalisé à chaque étape.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home

