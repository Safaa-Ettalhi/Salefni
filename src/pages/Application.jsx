import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSimulation, getCreditTypes, getJobs, getEmploymentTypes, createApplication, createNotification } from '../services/api'



function Application() {
  const { simulationId } = useParams()
  const navigate = useNavigate()

  const [simulation, setSimulation] = useState(null)
  const [creditTypes, setCreditTypes] = useState([])
  const [jobs, setJobs] = useState([])
  const [employmentTypes, setEmploymentTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    monthlyIncome: '',
    employmentTypeId: '',
    jobId: '',
    comment: ''
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    const loadData = async () => {
      try {
        const sim = await getSimulation(simulationId)
        setSimulation(sim)
        const types = await getCreditTypes()
        setCreditTypes(types)
        const jobsData = await getJobs()
        setJobs(jobsData)

        const empTypes = await getEmploymentTypes()
        setEmploymentTypes(empTypes)

        setLoading(false)
      } catch (error) {
        console.error('Erreur lors du chargement:', error)
        setLoading(false)
      }
    }

    loadData()
  }, [simulationId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Le nom est requis'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis'
    }

    if (!formData.monthlyIncome || parseFloat(formData.monthlyIncome) <= 0) {
      newErrors.monthlyIncome = 'Le revenu mensuel est requis'
    }

    if (!formData.employmentTypeId) {
      newErrors.employmentTypeId = 'Le type d\'emploi est requis'
    }

    if (!formData.jobId) {
      newErrors.jobId = 'Le métier est requis'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setSubmitting(true)

    try {
      const application = await createApplication({
        simulationId: parseInt(simulationId),
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        creditTypeId: simulation.creditTypeId,
        employmentTypeId: formData.employmentTypeId,
        jobId: formData.jobId,
        monthlyIncome: parseFloat(formData.monthlyIncome),
        comment: formData.comment
      })

      await createNotification({
        type: 'NEW_APPLICATION',
        applicationId: application.id,
        title: 'Nouvelle demande de crédit'
      })

      setSuccess(true)
      setSubmitting(false)
      setTimeout(() => {
        navigate('/')
      }, 3000)

    } catch (error) {
      console.error('Erreur lors de la soumission:', error)
      setErrors({ submit: 'Erreur lors de l\'envoi de la demande. Veuillez réessayer.' })
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="container">Chargement...</div>
  }

  if (!simulation) {
    return (
      <div className="container">
        <p className="text-red-500">Simulation introuvable</p>
      </div>
    )
  }

  const creditType = creditTypes.find(t => t.id === simulation.creditTypeId)

  if (success) {
    return (
      <div className="container max-w-2xl mx-auto py-20 px-6">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200/60 text-center py-20 px-8">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 rounded-full mb-6">
            <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">Demande envoyée</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Merci pour votre demande
          </h2>
          <p className="text-lg text-gray-600 mb-2 max-w-lg mx-auto leading-relaxed">
            Votre demande de crédit a été transmise avec succès. Notre équipe l'examinera et vous contactera dans les plus brefs délais.
          </p>
          <p className="text-sm text-gray-500 mt-8">
            Redirection automatique en cours...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-16 px-6">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 rounded-full mb-6">
          <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">Demande de crédit</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 tracking-tight">
          Complétez votre demande
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Quelques informations supplémentaires pour finaliser votre dossier</p>
      </div>

      {/* Récapitulatif de la simulation */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 border border-blue-200/60 rounded-2xl p-8 mb-10">
        <h2 className="text-lg font-bold mb-6 text-gray-900">Récapitulatif de votre simulation</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600">Type de crédit</p>
            <p className="font-bold">{creditType?.label || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Montant</p>
            <p className="font-bold">{simulation.amount.toLocaleString('fr-FR')} MAD</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Durée</p>
            <p className="font-bold">{simulation.months} mois</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Mensualité</p>
            <p className="font-bold">{simulation.monthlyPayment.toLocaleString('fr-FR')} MAD</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl border border-gray-200/60 p-10 md:p-12 space-y-8">
        <div className="mb-2">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Vos coordonnées</h2>
          <p className="text-sm text-gray-600">Ces informations nous permettront de vous contacter</p>
        </div>

        <div>
          <label className="block mb-2">
            Nom complet *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full p-2 border rounded text-black ${errors.fullName ? 'border-red-500' : ''}`}
            required
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label className="block mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-2 border rounded text-black ${errors.email ? 'border-red-500' : ''}`}
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block mb-2">
            Téléphone *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full p-2 border rounded text-black ${errors.phone ? 'border-red-500' : ''}`}
            required
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block mb-2">
            Revenu mensuel (MAD) *
          </label>
          <input
            type="number"
            name="monthlyIncome"
            value={formData.monthlyIncome}
            onChange={handleChange}
            min="0"
            step="100"
            className={`w-full p-2 border rounded text-black ${errors.monthlyIncome ? 'border-red-500' : ''}`}
            required
          />
          {errors.monthlyIncome && (
            <p className="text-red-500 text-sm mt-1">{errors.monthlyIncome}</p>
          )}
        </div>

        <div>
          <label className="block mb-2">
            Situation professionnelle *
          </label>
          <select
            name="employmentTypeId"
            value={formData.employmentTypeId}
            onChange={handleChange}
            className={`w-full p-2 border rounded text-black ${errors.employmentTypeId ? 'border-red-500' : ''}`}
            required
          >
            <option value="">Sélectionnez</option>
            {employmentTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.employmentTypeId && (
            <p className="text-red-500 text-sm mt-1">{errors.employmentTypeId}</p>
          )}
        </div>

        <div>
          <label className="block mb-2">
            Métier *
          </label>
          <select
            name="jobId"
            value={formData.jobId}
            onChange={handleChange}
            className={`w-full p-2 border rounded text-black ${errors.jobId ? 'border-red-500' : ''}`}
            required
          >
            <option value="">Sélectionnez</option>
            {jobs.map(job => (
              <option key={job.id} value={job.id}>
                {job.label}
              </option>
            ))}
          </select>
          {errors.jobId && (
            <p className="text-red-500 text-sm mt-1">{errors.jobId}</p>
          )}
        </div>

        <div>
          <label className="block mb-2">
            Commentaire (optionnel)
          </label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 border rounded text-black"
            placeholder="Précisez l'usage prévu du crédit..."
          />
        </div>
        {errors.submit && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.submit}
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
          >
            {submitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Envoi en cours...
              </span>
            ) : (
              'Envoyer ma demande'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Application
