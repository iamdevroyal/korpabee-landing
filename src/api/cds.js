import client from './client.js'

export const cdsApi = {
  getGroups: () => client.get('/cds/groups'),
  getGroup: (id) => client.get(`/cds/groups/${id}`),
  joinGroup: (id) => client.post(`/cds/groups/${id}/join`),
  leaveGroup: (id) => client.delete(`/cds/groups/${id}/join`),

  recordAttendance: (data) => client.post('/cds/attendance', data),
  getMyAttendance: () => client.get('/cds/attendance/me'),
  getLeaderboard: (stateId) => client.get(`/cds/leaderboard/${stateId}`),

  getProjects: (params) => client.get('/cds/projects', { params }),
  createProject: (data) => client.post('/cds/projects', data),
  updateProjectStatus: (id, status) => client.put(`/cds/projects/${id}`, { status }),
}

export default cdsApi
