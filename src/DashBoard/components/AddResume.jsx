import React, { useState } from 'react'
import { Loader2, PlusSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { v4 as uuidv4 } from 'uuid'
import { useUser } from '@clerk/clerk-react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useNavigate } from 'react-router-dom'

function AddResume() {
    const [openDialog, setOpenDialog] = useState(false)
    const [resumeTitle, setResumeTitle] = useState('')
    const { user } = useUser()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const onCreate = async () => {
        setLoading(true);
    
        const uuid = uuidv4();
        const data = {
            title: resumeTitle,
            resumeId: uuid,
            userEmail: user?.primaryEmailAddress?.emailAddress,
            userName: user?.fullName,
            resumeInfo: {} // Empty object for resume details
        };
    
        // Get existing resumes from local storage
        const storedResumes = localStorage.getItem('resumes');
        const resumesArray = storedResumes ? JSON.parse(storedResumes) : [];
    
        // Add new resume data to the array
        resumesArray.push(data);
    
        // Save the updated array back to local storage
        localStorage.setItem('resumes', JSON.stringify(resumesArray));
    
        // Navigate to the edit page for the new resume
        navigate('/dashboard/resume/' + uuid + "/edit");
        setLoading(false);
    };
    

    return (
        <div>
            <div
                className='p-14 py-24 border items-center flex justify-center bg-secondary rounded-lg h-[280px] hover:scale-105 transition-all hover:shadow-md cursor-pointer border-dashed'
                onClick={() => setOpenDialog(true)}
            >
                <PlusSquare />
            </div>

            <Dialog open={openDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Resume</DialogTitle>

                        <DialogDescription>
                            <p>Add a title for your new resume</p>
                            <Input
                                className="my-2"
                                placeholder="Ex. AI Engineer Resume"
                                onChange={(e) => setResumeTitle(e.target.value)}
                            />
                        </DialogDescription>

                        <div className='flex justify-end gap-5'>
                            <Button onClick={() => setOpenDialog(false)} variant="ghost">Cancel</Button>
                            <Button disabled={!resumeTitle || loading} onClick={onCreate}>
                                {loading ? <Loader2 className='animate-spin' /> : 'Create'}
                            </Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddResume
