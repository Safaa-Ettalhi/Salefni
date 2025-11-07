import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getApplication, getSimulation, getCreditTypes, updateApplicationStatus, addNoteToApplication } from '../../services/api'
import Login from './Login'


function AdminApplicationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()

  const [application, setApplication] = useState(null)
  const [simulation, setSimulation] = useState(null)
  const [creditTypes, setCreditTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [newStatus, setNewStatus] = useState('')
  const [newNote, setNewNote] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [app, types] = await Promise.all([
          getApplication(id),
          getCreditTypes()
        ])
        
        setApplication(app)
        setCreditTypes(types)

        if (app.simulationId) {
          try {
            const sim = await getSimulation(app.simulationId)
            setSimulation(sim)
          } catch (error) {
            console.error('Simulation non trouvée:', error)
          }
        }

        setNewStatus(app.status)
        setLoading(false)
      } catch (error) {
        console.error('Erreur:', error)
        setLoading(false)
      }
    }

    if (isAuthenticated) {
      loadData()
    }
  }, [id, isAuthenticated])

  if (!isAuthenticated) {
    return <Login />
  }

  const handleStatusChange = async () => {
    if (newStatus === application.status) {
      return
    }

    setSaving(true)
    try {
      const updated = await updateApplicationStatus(id, newStatus)
      setApplication(updated)
      alert('Statut mis à jour avec succès !')
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la mise à jour')
    } finally {
      setSaving(false)
    }
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      return
    }

    setSaving(true)
    try {
      const updated = await addNoteToApplication(id, newNote)
      setApplication(updated)
      setNewNote('')
      alert('Note ajoutée avec succès !')
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de l\'ajout de la note')
    } finally {
      setSaving(false)
    }
  }

  const handleTogglePriority = async () => {
    setSaving(true)
    try {
      const response = await fetch(`http://localhost:3001/applications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priority: !application.priority,
          updatedAt: new Date().toISOString()
        }),
      })
      const updated = await response.json()
      setApplication(updated)
      alert('Priorité mise à jour !')
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la mise à jour')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="container">Chargement...</div>
  }

  if (!application) {
    return (
      <div className="container">
        <p className="text-red-500">Demande introuvable</p>
      </div>
    )
  }

  const creditType = creditTypes.find(t => t.id === application.creditTypeId)

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'En attente'
      case 'in_progress': return 'En cours'
      case 'accepted': return 'Acceptée'
      case 'rejected': return 'Refusée'
      default: return status
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="container max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/admin')}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Retour à la liste
        </button>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Déconnexion
        </button>
      </div>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 rounded-full mb-4">
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Détail</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 tracking-tight">
          Demande #{id}
        </h1>
        <p className="text-gray-600">Détails complets de la demande de crédit</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/60 p-8">
            <h2 className="text-xl font-bold mb-6 text-gray-900">Informations du demandeur</h2>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Nom</span>
                <span className="text-sm font-semibold text-gray-900">{application.fullName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Email</span>
                <span className="text-sm text-gray-900">{application.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Téléphone</span>
                <span className="text-sm text-gray-900">{application.phone}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Revenu mensuel</span>
                <span className="text-sm font-semibold text-gray-900">{application.monthlyIncome.toLocaleString('fr-FR')} MAD</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Type d'emploi</span>
                <span className="text-sm text-gray-900">{application.employmentTypeId}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm font-medium text-gray-600">Métier</span>
                <span className="text-sm text-gray-900">{application.jobId}</span>
              </div>
              {application.comment && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Commentaire</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{application.comment}</p>
                </div>
              )}
            </div>
          </div>

          {simulation && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/60 p-8">
              <h2 className="text-xl font-bold mb-6 text-gray-900">Récapitulatif de la simulation</h2>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Type</span>
                  <span className="text-sm font-semibold text-gray-900">{creditType?.label || application.creditTypeId}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Montant</span>
                  <span className="text-sm font-semibold text-gray-900">{simulation.amount.toLocaleString('fr-FR')} MAD</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Durée</span>
                  <span className="text-sm text-gray-900">{simulation.months} mois</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Taux annuel</span>
                  <span className="text-sm text-gray-900">{simulation.annualRate}%</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Mensualité</span>
                  <span className="text-sm font-semibold text-gray-900">{simulation.monthlyPayment.toLocaleString('fr-FR')} MAD</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Coût total</span>
                  <span className="text-sm font-semibold text-gray-900">{simulation.totalCost.toLocaleString('fr-FR')} MAD</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm font-medium text-gray-600">TAEG</span>
                  <span className="text-sm font-semibold text-gray-900">{simulation.apr.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/60 p-8">
            <h2 className="text-xl font-bold mb-6 text-gray-900">Dates</h2>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Créée le</span>
                <span className="text-sm text-gray-900">{formatDate(application.createdAt)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm font-medium text-gray-600">Modifiée le</span>
                <span className="text-sm text-gray-900">{formatDate(application.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/60 p-8">
            <h2 className="text-xl font-bold mb-6 text-gray-900">Statut actuel</h2>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(application.status)}`}>
                  {getStatusLabel(application.status)}
                </span>
                {application.priority && (
                  <span className="px-3 py-1.5 bg-red-500 text-white rounded-full text-xs font-semibold">
                    Prioritaire
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Changer le statut</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={saving}
                >
                  <option value="pending">En attente</option>
                  <option value="in_progress">En cours</option>
                  <option value="accepted">Acceptée</option>
                  <option value="rejected">Refusée</option>
                </select>
              </div>
              <button
                onClick={handleStatusChange}
                disabled={saving || newStatus === application.status}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none"
              >
                {saving ? 'Enregistrement...' : 'Mettre à jour le statut'}
              </button>
            </div>
            <button
              onClick={handleTogglePriority}
              disabled={saving}
              className={`w-full mt-6 font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                application.priority
                  ? 'bg-gray-600 hover:bg-gray-700 text-white'
                  : 'bg-yellow-500 hover:bg-yellow-600 text-white'
              }`}
            >
              {application.priority ? 'Retirer la priorité' : 'Marquer comme prioritaire'}
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/60 p-8">
            <h2 className="text-xl font-bold mb-6 text-gray-900">Notes internes</h2>

            <div className="mb-6">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Ajouter une note interne..."
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                disabled={saving}
              />
              <button
                onClick={handleAddNote}
                disabled={saving || !newNote.trim()}
                className="w-full mt-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none"
              >
                {saving ? 'Ajout...' : 'Ajouter la note'}
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Notes existantes</h3>
              {application.notes && application.notes.length > 0 ? (
                application.notes.map((note, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-900 leading-relaxed">{note.text}</p>
                    {note.createdAt && (
                      <p className="text-xs text-gray-500 mt-2 font-medium">
                        {formatDate(note.createdAt)}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">Aucune note</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminApplicationDetail
