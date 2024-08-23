import React, { useEffect, useState } from 'react'
import AddResume from './components/AddResume'
import { useUser } from '@clerk/clerk-react'
import ResumeCardItem from './components/ResumeCardItem';

// Also need to get the user's own resumes from the database using email (GET)
function DashBoard() {
  const {user}= useUser();
  const [resumeList,setResumeList] = useState([]);
  
  useEffect(()=>{
    user&&GetResumeList()
  },[user])

  /**
   * Used to get Users Resume List
   */

  const GetResumesList=()=>{
    //Add Api here to get data
  }

  return (
    <div className='p-10 md:px-20 lg:px-32'>
      <h2 className='font-bold text-3xl'>My Resume</h2>
      <p>Start Creating AI resume to your next Job Role</p>
      <div className='mt-10 flex justify-start'>
        <div className='w-full md:w-1/3 lg:w-1/4 gap-5'>
          <AddResume />
          {resumeList.length>0 && resumeList.map((resume,index) =>{
            <ResumeCardItem resume={resume} key={index}/>
          })}
        </div>
      </div>
    </div>
  )
}

export default DashBoard