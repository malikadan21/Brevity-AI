import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { LoaderCircle } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

function PersonalDetail({ enabledNext }) {
    const { resumeId } = useParams();
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const [formData, setFormData] = useState(resumeInfo || {});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Load existing data from localStorage if it exists
        const storedResumes = JSON.parse(localStorage.getItem('resumes')) || [];
        const existingResume = storedResumes.find(resume => resume.resumeId === resumeId);

        if (existingResume) {
            setFormData(existingResume);
            setResumeInfo(existingResume);
        }
    }, [resumeId, setResumeInfo]);

    const handleInputChange = (e) => {
        enabledNext(false);
        const { name, value } = e.target;

        const updatedFormData = {
            ...formData,
            [name]: value
        };

        setFormData(updatedFormData);
        setResumeInfo(updatedFormData);
    };

    const onSave = (e) => {
        e.preventDefault();
        setLoading(true);

        // Combine form data with existing resume info
        const updatedData = { ...resumeInfo, ...formData, resumeId };

        setTimeout(() => {  // Simulate a delay for the loading animation
            // Get all resumes from localStorage
            const storedResumes = JSON.parse(localStorage.getItem('resumes')) || [];
            
            // Check if the resume already exists and update it
            const updatedResumes = storedResumes.map(resume =>
                resume.resumeId === resumeId ? updatedData : resume
            );

            // If it's a new resume, add it to the array
            if (!storedResumes.some(resume => resume.resumeId === resumeId)) {
                updatedResumes.push(updatedData);
            }

            // Save the updated resumes array back to localStorage
            localStorage.setItem('resumes', JSON.stringify(updatedResumes));

            // Print the saved data to the console
            console.log('Saved Data:', updatedData);

            enabledNext(true);
            setLoading(false);
            toast.success("Details saved successfully!");  // Display success pop-up
        }, 1500);  // Simulate a 1.5 seconds delay for the saving process
    };

    return (
        <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
            <h2 className='font-bold text-lg'>Personal Detail</h2>
            <p>Get Started with the basic information</p>

            <form onSubmit={onSave}>
                <div className='grid grid-cols-2 mt-5 gap-3'>
                    <div>
                        <label className='text-sm'>First Name</label>
                        <Input name="firstName" defaultValue={formData?.firstName} required onChange={handleInputChange} />
                    </div>
                    <div>
                        <label className='text-sm'>Last Name</label>
                        <Input name="lastName" required onChange={handleInputChange}
                            defaultValue={formData?.lastName} />
                    </div>
                    <div className='col-span-2'>
                        <label className='text-sm'>Job Title</label>
                        <Input name="jobTitle" required
                            defaultValue={formData?.jobTitle}
                            onChange={handleInputChange} />
                    </div>
                    <div className='col-span-2'>
                        <label className='text-sm'>Address</label>
                        <Input name="address" required
                            defaultValue={formData?.address}
                            onChange={handleInputChange} />
                    </div>
                    <div>
                        <label className='text-sm'>Phone</label>
                        <Input name="phone" required
                            defaultValue={formData?.phone}
                            onChange={handleInputChange} />
                    </div>
                    <div>
                        <label className='text-sm'>Email</label>
                        <Input name="email" required
                            defaultValue={formData?.email}
                            onChange={handleInputChange} />
                    </div>
                </div>
                <div className='mt-3 flex justify-end'>
                    <Button type="submit" disabled={loading}>
                        {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default PersonalDetail;
