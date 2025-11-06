
const API_BASE_URL = 'http://localhost:3001'

async function fetchData(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`)
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Erreur lors de la récupération de ${endpoint}:`, error)
    throw error
  }
}


async function postData(endpoint, data) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Erreur lors de l'envoi vers ${endpoint}:`, error)
    throw error
  }
}


export async function patchData(endpoint, data) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de ${endpoint}:`, error)
    throw error
  }
}

export async function getCreditTypes() {
  return fetchData('/creditTypes')
}


export async function getJobs() {
  return fetchData('/jobs')
}

export async function getEmploymentTypes() {
  return fetchData('/employmentTypes')
}


export async function getSimulations() {
  return fetchData('/simulations')
}

export async function getSimulation(id) {
  return fetchData(`/simulations/${id}`)
}

export async function createSimulation(simulationData) {
  return postData('/simulations', {
    ...simulationData,
    createdAt: new Date().toISOString()
  })
}

export async function getApplications() {
  return fetchData('/applications')
}

export async function getApplication(id) {
  return fetchData(`/applications/${id}`)
}

export async function createApplication(applicationData) {
  return postData('/applications', {
    ...applicationData,
    status: 'pending',
    priority: false,
    notes: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
}

export async function updateApplicationStatus(id, status) {
  return patchData(`/applications/${id}`, {
    status,
    updatedAt: new Date().toISOString()
  })
}

export async function addNoteToApplication(id, note) {
  const application = await getApplication(id)
  const updatedNotes = [...application.notes, {
    text: note,
    createdAt: new Date().toISOString()
  }]
  return patchData(`/applications/${id}`, {
    notes: updatedNotes,
    updatedAt: new Date().toISOString()
  })
}


export async function getNotifications() {
  return fetchData('/notifications')
}

export async function getUnreadNotifications() {
  const notifications = await getNotifications()
  return notifications.filter(n => !n.seen)
}

export async function markNotificationAsRead(id) {
  return patchData(`/notifications/${id}`, {
    seen: true
  })
}

export async function createNotification(notificationData) {
  return postData('/notifications', {
    ...notificationData,
    seen: false,
    createdAt: new Date().toISOString()
  })
}


export async function loginAdmin(email, password) {
  const admins = await fetchData('/admins')
  const admin = admins.find(a => a.email === email && a.password === password)
  
  if (admin) {
    return { success: true, admin }
  }
  
  return { success: false, error: 'Email ou mot de passe incorrect' }
}

