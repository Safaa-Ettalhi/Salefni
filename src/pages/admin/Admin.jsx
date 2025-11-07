import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getApplications, getCreditTypes } from '../../services/api'
import Login from './Login'

function Admin() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [applications, setApplications] = useState([])
  const [creditTypes, setCreditTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const [apps, types] = await Promise.all([
          getApplications(),
          getCreditTypes()
        ])
        setApplications(apps)
        setCreditTypes(types)
        setLoading(false)
      } catch (error) {
        console.error('Erreur:', error)
        setLoading(false)
      }
    }

    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated])


  if (!isAuthenticated) {
    return <Login />
  }


  const filteredApplications = applications.filter(app => {
    if (filter !== 'all' && app.status !== filter) {
      return false
    }

    if (search) {
      const searchLower = search.toLowerCase()
      return (
        app.fullName.toLowerCase().includes(searchLower) ||
        app.email.toLowerCase().includes(searchLower)
      )
    }

    return true
  })

  const getCreditTypeName = (creditTypeId) => {
    const type = creditTypes.find(t => t.id === creditTypeId)
    return type?.label || creditTypeId
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

  if (loading) {
    return <div className="container">Chargement...</div>
  }

  return (
    <div className="container max-w-7xl mx-auto py-12 px-6">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 rounded-full mb-4">
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Administration</span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              Demandes de crédit
            </h1>
            <p className="text-gray-600">{filteredApplications.length} demande{filteredApplications.length > 1 ? 's' : ''} trouvée{filteredApplications.length > 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200/60 p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Filtrer par statut</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-2 border rounded text-black"
            >
              <option value="all">Toutes</option>
              <option value="pending">En attente</option>
              <option value="in_progress">En cours</option>
              <option value="accepted">Acceptées</option>
              <option value="rejected">Refusées</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">Rechercher</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nom ou email..."
              className="w-full p-2 border rounded text-black"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200/60 overflow-hidden">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg font-medium">Aucune demande trouvée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">{app.fullName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{app.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{getCreditTypeName(app.creditTypeId)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}>
                        {getStatusLabel(app.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(app.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/admin/applications/${app.id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-md hover:shadow-lg"
                      >
                        Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
