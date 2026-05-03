"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  { id: 1, title: 'Basic Info', icon: '📝' },
  { id: 2, title: 'Details', icon: '💰' },
  { id: 3, title: 'Description', icon: '📄' },
  { id: 4, title: 'Skills', icon: '⚡' },
];

export default function JobPostForm({ onSubmit, onCancel, initialData = null }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialData || {
    title: '',
    company: '',
    location: '',
    jobType: 'full-time',
    experienceLevel: 'entry',
    salary: { min: 0, max: 0, currency: 'PKR' },
    description: '',
    requirements: [''],
    skills: [''],
    applicationDeadline: '',
    status: 'draft',
  });

  const [errors, setErrors] = useState({});

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.title) newErrors.title = 'Title is required';
      if (!formData.company) newErrors.company = 'Company is required';
      if (!formData.location) newErrors.location = 'Location is required';
    } else if (step === 3) {
      if (!formData.description) newErrors.description = 'Description is required';
      if (formData.requirements.some(r => !r.trim())) newErrors.requirements = 'All requirements must be filled';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayField = (field, index) => {
    if (formData[field].length > 1) {
      const newArray = formData[field].filter((_, i) => i !== index);
      setFormData({ ...formData, [field]: newArray });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault(); 
      if (currentStep < steps.length) {
        nextStep();
      }
      // Submission on Enter is now disabled to prevent accidental drafts
    }
  };

  const handleFinalSubmit = () => {
    if (validateStep(currentStep)) {
      const cleanedData = {
        ...formData,
        requirements: formData.requirements.filter(r => r.trim() !== ''),
        skills: formData.skills.filter(s => s.trim() !== ''),
      };
      onSubmit(cleanedData);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Standard form submit is now disabled to prevent accidental triggers
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-xl">
      {/* Progress Bar */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-slate-700 -translate-y-1/2 z-0"></div>
          <motion.div 
            className="absolute top-1/2 left-0 h-0.5 bg-indigo-600 -translate-y-1/2 z-0"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></motion.div>
          
          {steps.map((step) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
                  currentStep >= step.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                    : 'bg-white dark:bg-slate-800 text-gray-400 border border-gray-200 dark:border-slate-700'
                }`}
              >
                {currentStep > step.id ? '✓' : step.icon}
              </div>
              <span className={`text-[10px] lg:text-xs mt-2 font-medium ${
                currentStep >= step.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'
              }`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="p-6">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div 
              key="step1"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Basic Information</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title *</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border ${errors.title ? 'border-red-500' : 'border-gray-200 dark:border-slate-700'} bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none`}
                  placeholder="e.g. Senior Frontend Developer"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company *</label>
                <input 
                  type="text" 
                  value={formData.company} 
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border ${errors.company ? 'border-red-500' : 'border-gray-200 dark:border-slate-700'} bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none`}
                  placeholder="e.g. Google"
                />
                {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location *</label>
                  <input 
                    type="text" 
                    value={formData.location} 
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border ${errors.location ? 'border-red-500' : 'border-gray-200 dark:border-slate-700'} bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none`}
                    placeholder="e.g. Remote, Lahore"
                  />
                  {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Type</label>
                  <select 
                    value={formData.jobType} 
                    onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div 
              key="step2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Job Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Experience Level</label>
                  <select 
                    value={formData.experienceLevel} 
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                    <option value="lead">Lead / Manager</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deadline</label>
                  <input 
                    type="date" 
                    value={formData.applicationDeadline} 
                    onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-3">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Salary Range</label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1">Min</label>
                    <input 
                      type="number" 
                      value={formData.salary.min} 
                      onChange={(e) => setFormData({ ...formData, salary: { ...formData.salary, min: parseInt(e.target.value) } })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1">Max</label>
                    <input 
                      type="number" 
                      value={formData.salary.max} 
                      onChange={(e) => setFormData({ ...formData, salary: { ...formData.salary, max: parseInt(e.target.value) } })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1">Currency</label>
                    <select 
                      value={formData.salary.currency} 
                      onChange={(e) => setFormData({ ...formData, salary: { ...formData.salary, currency: e.target.value } })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option>PKR</option>
                      <option>USD</option>
                      <option>EUR</option>
                      <option>GBP</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div 
              key="step3"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Description & Requirements</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Description *</label>
                <textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className={`w-full px-4 py-2.5 rounded-xl border ${errors.description ? 'border-red-500' : 'border-gray-200 dark:border-slate-700'} bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none`}
                  placeholder="Tell us about the role..."
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Key Requirements</label>
                  <button type="button" onClick={() => addArrayField('requirements')} className="text-xs text-indigo-600 hover:text-indigo-700 font-bold">+ Add More</button>
                </div>
                <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2">
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="flex gap-2">
                      <input 
                        type="text" 
                        value={req} 
                        onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                        placeholder={`Requirement #${index + 1}`}
                      />
                      <button type="button" onClick={() => removeArrayField('requirements', index)} className="text-red-500 hover:text-red-600 p-2">✕</button>
                    </div>
                  ))}
                </div>
                {errors.requirements && <p className="text-red-500 text-xs mt-1">{errors.requirements}</p>}
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div 
              key="step4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Skills & Finalize</h2>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Required Skills</label>
                  <button type="button" onClick={() => addArrayField('skills')} className="text-xs text-indigo-600 hover:text-indigo-700 font-bold">+ Add Skill</button>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-lg px-2 py-1">
                      <input 
                        type="text" 
                        value={skill} 
                        onChange={(e) => handleArrayChange('skills', index, e.target.value)}
                        className="bg-transparent border-none outline-none text-xs text-indigo-700 dark:text-indigo-300 w-20"
                        placeholder="Skill..."
                      />
                      <button type="button" onClick={() => removeArrayField('skills', index)} className="text-indigo-400 hover:text-indigo-600">✕</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 border border-dashed border-gray-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/30">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Set initial status for the job:</p>
                <div className="flex gap-4">
                  {['draft', 'active'].map((status) => (
                    <label key={status} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="status" 
                        value={status} 
                        checked={formData.status === status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-4 h-4 text-indigo-600"
                      />
                      <span className="text-sm capitalize font-medium text-gray-700 dark:text-gray-300">{status}</span>
                    </label>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-8 mt-6 border-t border-gray-100 dark:border-slate-800">
          <button 
            type="button" 
            onClick={currentStep === 1 ? onCancel : prevStep}
            className="px-6 py-2.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
          >
            {currentStep === 1 ? 'Cancel' : 'Previous'}
          </button>
          
          <div className="flex gap-3">
            {currentStep < steps.length ? (
              <button 
                type="button" 
                onClick={nextStep}
                className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
              >
                Next Step
              </button>
            ) : (
              <button 
                type="button"
                onClick={handleFinalSubmit}
                className="px-8 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
              >
                🚀 Post Job
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
