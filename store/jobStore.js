import { create } from 'zustand';
import api from '../services/api';

const useJobStore = create((set, get) => ({
  jobs: [],
  loading: false,
  error: null,
  analytics: null,

  fetchAllJobs: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const { status = 'active', search, jobType, experienceLevel } = filters;
      let url = `/jobs?status=${status}`;
      if (search) url += `&search=${search}`;
      if (jobType) url += `&jobType=${jobType}`;
      if (experienceLevel) url += `&experienceLevel=${experienceLevel}`;
      
      const response = await api.get(url);
      set({ jobs: response.data.data.jobs, loading: false });
    } catch (error) {
      set({ error: error.message || 'Failed to fetch jobs', loading: false });
    }
  },

  fetchJobById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/jobs/${id}`);
      return { success: true, job: response.data.data.job };
    } catch (error) {
      set({ error: error.message || 'Failed to fetch job details', loading: false });
      return { success: false, error: error.message };
    } finally {
      set({ loading: false });
    }
  },

  applyToJob: async (id, applicationData) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('fullName', applicationData.fullName);
      formData.append('email', applicationData.email);
      formData.append('phone', applicationData.phone);
      formData.append('coverLetter', applicationData.coverLetter);
      formData.append('resume', applicationData.resume);

      const response = await api.post(`/jobs/${id}/apply`, formData);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Apply Error:', error.response?.data || error.message);
      return { success: false, error: error.response?.data?.message || error.message };
    } finally {
      set({ loading: false });
    }
  },

  fetchMyJobs: async (status) => {
    set({ loading: true, error: null });
    try {
      const url = status 
        ? `/jobs/recruiter/my-jobs?status=${status}` 
        : '/jobs/recruiter/my-jobs';
      const response = await api.get(url);
      set({ jobs: response.data.data.jobs, loading: false });
    } catch (error) {
      set({ error: error.message || 'Failed to fetch jobs', loading: false });
    }
  },

  fetchAnalytics: async () => {
    try {
      const response = await api.get('/jobs/recruiter/analytics/overview');
      set({ analytics: response.data.data });
    } catch (error) {
      console.error('Failed to fetch analytics:', error.response?.data || error.message || error);
      set({ error: error.message || 'Failed to fetch analytics' });
    }
  },

  createJob: async (jobData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/jobs', jobData);
      const newJob = response.data.data.job;
      set((state) => ({
        jobs: [newJob, ...state.jobs],
        loading: false
      }));
      return { success: true, job: newJob };
    } catch (error) {
      set({ error: error.message || 'Failed to create job', loading: false });
      return { success: false, error: error.message };
    }
  },

  updateJob: async (id, jobData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/jobs/${id}`, jobData);
      const updatedJob = response.data.data.job;
      set((state) => ({
        jobs: state.jobs.map((j) => (j._id === id ? updatedJob : j)),
        loading: false
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.message || 'Failed to update job', loading: false });
      return { success: false, error: error.message };
    }
  },

  deleteJob: async (id) => {
    // Optimistic update
    const previousJobs = get().jobs;
    set((state) => ({
      jobs: state.jobs.filter((j) => j._id !== id)
    }));

    try {
      await api.delete(`/jobs/${id}`);
      return { success: true };
    } catch (error) {
      // Revert on error
      set({ jobs: previousJobs, error: error.message || 'Failed to delete job' });
      return { success: false, error: error.message };
    }
  },

  updateApplicationStatus: async (jobId, applicationId, statusData) => {
    try {
      const response = await api.put(`/jobs/${jobId}/applications/${applicationId}`, statusData);
      const updatedApplication = response.data.data.application;
      
      set((state) => ({
        jobs: state.jobs.map((job) => {
          if (job._id === jobId) {
            return {
              ...job,
              applications: job.applications.map((app) => 
                app._id === applicationId ? { ...app, ...updatedApplication } : app
              )
            };
          }
          return job;
        })
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // ─── Bookmark / Saved Jobs ───
  savedJobIds: [],

  fetchSavedJobs: async () => {
    try {
      const res = await api.get('/jobs/saved');
      const savedIds = res.data.data.jobs.map(j => j._id);
      set({ savedJobIds: savedIds });
      return res.data.data.jobs;
    } catch (error) {
      console.error('Failed to fetch saved jobs:', error);
      return [];
    }
  },

  saveJob: async (jobId) => {
    try {
      await api.post(`/jobs/${jobId}/save`);
      set((state) => ({ savedJobIds: [...state.savedJobIds, jobId] }));
      return { success: true, message: 'Job saved successfully!' };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to save job' };
    }
  },

  unsaveJob: async (jobId) => {
    try {
      await api.delete(`/jobs/${jobId}/save`);
      set((state) => ({
        savedJobIds: state.savedJobIds.filter(id => id !== jobId)
      }));
      return { success: true, message: 'Job removed from saved' };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to unsave job' };
    }
  },

  isJobSaved: (jobId) => {
    return get().savedJobIds.includes(jobId);
  },

  clearError: () => set({ error: null }),
}));

export default useJobStore;
