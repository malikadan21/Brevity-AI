import React, { useEffect, useState } from 'react'
import AddResume from './components/AddResume'
import { useUser } from '@clerk/clerk-react'
import ResumeCardItem from './components/ResumeCardItem'

function DashBoard() {
  const { user } = useUser()
  const [resumeList, setResumeList] = useState([])

  useEffect(() => {
    if (user) {
      getResumesList()
    }
  }, [user])

  const getResumesList = () => {
    // Get resumes from local storage
    const storedResumes = localStorage.getItem('resumes');
    let resumesArray = storedResumes ? JSON.parse(storedResumes) : [];

    // Filter resumes by the current user's email
    const userResumes = resumesArray.filter(resume => resume.userEmail === user?.primaryEmailAddress?.emailAddress);
    setResumeList(userResumes);
};


  return (
    <div className='p-10 md:px-20 lg:px-32'>
      <h2 className='font-bold text-3xl'>My Resume</h2>
      <p>Start Creating AI resume to your next Job Role</p>
      <div className='mt-10'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
          <AddResume />
          {resumeList.length > 0 ? (
            resumeList.map((resume, index) => (
              <ResumeCardItem resume={resume} key={index} />
            ))
          ) : (
            <p className='col-span-full'>No resumes found. Create one to get started!</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashBoard
