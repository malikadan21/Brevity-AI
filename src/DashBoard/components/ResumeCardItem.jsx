import { Loader2Icon, MoreVertical, Notebook } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner'

function ResumeCardItem({ resume, refreshData }) {
  const navigation = useNavigate()
  const [openAlert, setOpenAlert] = useState(false)
  const [loading, setLoading] = useState(false)

  const onDelete = () => {
    setLoading(true)

    // Get resumes from local storage
    const storedResumes = localStorage.getItem('resumes')
    let resumesArray = storedResumes ? JSON.parse(storedResumes) : []

    // Filter out the resume to be deleted
    const updatedResumes = resumesArray.filter(r => r.resumeId !== resume.resumeId)

    // Save the updated list back to local storage
    localStorage.setItem('resumes', JSON.stringify(updatedResumes))

    // Display success message and refresh data
    setTimeout(() => {
      toast('Resume Deleted!')
      refreshData() // Call the function to refresh the list after deletion
      setLoading(false)
      setOpenAlert(false)
    }, 1000)
  }

  return (
    <div className=''>
      <Link to={'/dashboard/resume/' + resume.resumeId + "/edit"}>
        <div className='p-14  bg-gradient-to-b from-pink-100 via-purple-200 to-blue-200 h-[280px] rounded-t-lg border-t-4'
          style={{
            borderColor: resume?.themeColor
          }}>
          <div className='flex items-center justify-center h-[180px] '>
            <img src="/cv.png" width={80} height={80} />
          </div>
        </div>
      </Link>
      <div className='border p-3 flex justify-between text-white rounded-b-lg shadow-lg'
        style={{
          background: resume?.themeColor
        }}>
        <h2 className='text-sm text-black'>{resume.title}</h2>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical className='h-4 w-4 cursor-pointer text-black' />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => navigation('/dashboard/resume/' + resume.resumeId + "/edit")}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigation('/my-resume/' + resume.resumeId + "/view")}>View</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigation('/my-resume/' + resume.resumeId + "/view")}>Download</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenAlert(true)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={openAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your resume.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpenAlert(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} disabled={loading}>
                {loading ? <Loader2Icon className='animate-spin' /> : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </div>
  )
}

export default ResumeCardItem
