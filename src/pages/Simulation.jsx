import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  calculateMonthlyPayment, 
  calculateTotalCost, 
  calculateAPR,
  generateAmortizationTable,
  validateSimulation 
} from '../services/creditCalculations'
import { createSimulation } from '../services/api'



function Simulation() {
  const navigate = useNavigate()
  
  const [creditTypes, setCreditTypes] = useState([])
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [formData, setFormData] = useState({
    creditTypeId: '',
    jobId: '',
    amount: '',
    months: '',
    annualRate: '',
    fees: '',
    insuranceRate: ''
  })

  const [results, setResults] = useState(null)
  const [errors, setErrors] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const creditTypesResponse = await fetch('http://localhost:3001/creditTypes')
        const creditTypesData = await creditTypesResponse.json()
        setCreditTypes(creditTypesData)

        const jobsResponse = await fetch('http://localhost:3001/jobs')
        const jobsData = await jobsResponse.json()
        setJobs(jobsData)

        setLoading(false)
      } catch (error) {
        console.error('Erreur lors du chargement:', error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    if (formData.creditTypeId) {
      const selectedType = creditTypes.find(t => t.id === formData.creditTypeId)
      if (selectedType) {
        setFormData(prev => ({
          ...prev,
          annualRate: selectedType.defaultAnnualRate || '',
          fees: selectedType.defaultFees || '',
          insuranceRate: selectedType.defaultInsuranceRate || ''
        }))
      }
    }
  }, [formData.creditTypeId, creditTypes])

 
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev, 
      [name]: value 
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault() 
    setErrors([])
    
    const amount = parseFloat(formData.amount)
    const months = parseInt(formData.months)
    const annualRate = parseFloat(formData.annualRate)
    const fees = parseFloat(formData.fees) || 0
    const insuranceRate = parseFloat(formData.insuranceRate) || 0

    const selectedCreditType = creditTypes.find(t => t.id === formData.creditTypeId)
    
    if (selectedCreditType) {
      const validation = validateSimulation(
        { amount, months, annualRate },
        selectedCreditType
      )
      
      if (!validation.isValid) {
        setErrors(validation.errors)
        return
      }
    }

    try {
      const monthlyPayment = calculateMonthlyPayment(amount, annualRate, months)
      
      const totalCost = calculateTotalCost(monthlyPayment, months, fees, amount, insuranceRate)
      
      const apr = calculateAPR(amount, totalCost, months)
      
      const amortization = generateAmortizationTable(amount, monthlyPayment, annualRate, months)

      const roundedMonthlyPayment = Math.round(monthlyPayment * 100) / 100
      const roundedTotalCost = Math.round(totalCost * 100) / 100
      const roundedApr = Math.round(apr * 100) / 100

      setResults({
        monthlyPayment: roundedMonthlyPayment,
        totalCost: roundedTotalCost,
        apr: roundedApr,
        amortization
      })

      setSaving(true)
      const savedSimulation = await createSimulation({
        creditTypeId: formData.creditTypeId,
        amount,
        months,
        annualRate,
        fees,
        insuranceRate,
        monthlyPayment: roundedMonthlyPayment,
        totalCost: roundedTotalCost,
        apr: roundedApr,
        amortization
      })

      setSaving(false)
      sessionStorage.setItem('lastSimulationId', savedSimulation.id)
      
    } catch (error) {
      console.error('Erreur lors du calcul:', error)
      setErrors(['Erreur lors du calcul de la simulation'])
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="container">Chargement...</div>
  }

  return (
    <div className="container max-w-5xl mx-auto py-20 px-6 animate-fadeIn">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full mb-8 shadow-sm">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Calculateur</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-900 tracking-tight">
          Simulation de crédit
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">Renseignez les informations ci-dessous pour obtenir votre estimation personnalisée</p>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-gradient-to-br from-white via-blue-50/20 to-white rounded-3xl shadow-2xl border border-gray-200/60 p-12 md:p-14 space-y-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Type de crédit *
          </label>
          <select
            name="creditTypeId"
            value={formData.creditTypeId}
            onChange={handleChange}
            required
            className="w-full p-4 border border-gray-300 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="">Sélectionnez un type</option>
            {creditTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2">
            Métier *
          </label>
          <select
            name="jobId"
            value={formData.jobId}
            onChange={handleChange}
            required
            className="w-full p-4 border border-gray-300 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="">Sélectionnez un métier</option>
            {jobs.map(job => (
              <option key={job.id} value={job.id}>
                {job.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2">
            Montant (MAD) *
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="0"
            className="w-full p-4 border border-gray-300 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
        <div>
          <label className="block mb-2">
            Durée (mois) *
          </label>
          <input
            type="number"
            name="months"
            value={formData.months}
            onChange={handleChange}
            required
            min="1"
            className="w-full p-4 border border-gray-300 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
        <div>
          <label className="block mb-2">
            Taux annuel (%) *
          </label>
          <input
            type="number"
            name="annualRate"
            value={formData.annualRate}
            onChange={handleChange}
            required
            min="0"
            step="0.1"
            className="w-full p-4 border border-gray-300 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
        <div>
          <label className="block mb-2">
            Frais fixes (MAD)
          </label>
          <input
            type="number"
            name="fees"
            value={formData.fees}
            onChange={handleChange}
            min="0"
            step="10"
            className="w-full p-4 border border-gray-300 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
        <div>
          <label className="block mb-2">
            Taux d'assurance (%) (optionnel)
          </label>
          <input
            type="number"
            name="insuranceRate"
            value={formData.insuranceRate}
            onChange={handleChange}
            min="0"
            step="0.1"
            className="w-full p-4 border border-gray-300 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 text-white font-bold py-5 px-10 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl disabled:shadow-none transform hover:scale-[1.02] group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center">
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calcul en cours...
                </>
              ) : (
                <>
                  Calculer ma simulation
                  <svg className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
        </div>
      </form>

      {errors.length > 0 && (
        <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {results && (
        <div className="mt-16 bg-gradient-to-br from-white via-blue-50/20 to-white rounded-3xl shadow-2xl border border-gray-200/60 p-12 md:p-16 space-y-12 animate-scaleIn relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-200/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 text-center mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full mb-6 shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Résultats</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">Votre simulation</h2>
            <p className="text-lg text-gray-600">Voici le détail de votre calcul personnalisé</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="group p-10 bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-50 border-2 border-blue-200/60 rounded-3xl hover:border-blue-300 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl group-hover:bg-blue-400/30 transition-all duration-500"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-gray-600 mb-4 uppercase tracking-wider">Mensualité</p>
                <p className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">{results.monthlyPayment.toLocaleString('fr-FR')}</p>
                <p className="text-sm text-gray-500 font-semibold">MAD</p>
              </div>
            </div>
            <div className="group p-10 bg-gradient-to-br from-gray-50 via-gray-100/50 to-gray-50 border-2 border-gray-200/60 rounded-3xl hover:border-gray-300 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gray-300/20 rounded-full blur-2xl group-hover:bg-gray-400/30 transition-all duration-500"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-gray-600 mb-4 uppercase tracking-wider">Coût total</p>
                <p className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">{results.totalCost.toLocaleString('fr-FR')}</p>
                <p className="text-sm text-gray-500 font-semibold">MAD</p>
              </div>
            </div>
            <div className="group p-10 bg-gradient-to-br from-green-50 via-green-100/50 to-green-50 border-2 border-green-200/60 rounded-3xl hover:border-green-300 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-300/20 rounded-full blur-2xl group-hover:bg-green-400/30 transition-all duration-500"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-gray-600 mb-4 uppercase tracking-wider">TAEG</p>
                <p className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">{results.apr.toFixed(2)}</p>
                <p className="text-sm text-gray-500 font-semibold">%</p>
              </div>
            </div>
          </div>

          {/* Tableau d'amortissement (premiers mois) */}
          <div className="mt-10">
            <h3 className="text-xl font-bold mb-6 text-gray-900">Tableau d'amortissement</h3>
            <p className="text-sm text-gray-500 mb-4">Détail des 6 premiers mois</p>
            <div className="overflow-x-auto rounded-xl border border-gray-200/60 shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/80">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Mois</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Intérêts</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Capital</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Reste dû</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.amortization.slice(0, 6).map((row, index) => (
                    <tr key={row.month} className={`hover:bg-blue-50/30 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{row.month}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.interest.toLocaleString('fr-FR')} <span className="text-gray-500">MAD</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.principal.toLocaleString('fr-FR')} <span className="text-gray-500">MAD</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.remaining.toLocaleString('fr-FR')} <span className="text-gray-500 font-normal">MAD</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bouton pour continuer vers la demande */}
          <div className="pt-8 relative z-10">
            <button
              onClick={() => {
                const simId = sessionStorage.getItem('lastSimulationId')
                if (simId) {
                  navigate(`/application/${simId}`)
                }
              }}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-5 px-10 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center group transform hover:scale-[1.02] relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Soumettre ma demande
                <svg className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-emerald-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Simulation

