import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { LoaderCircle } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

function PersonalDetail({ enabledNext }) {
    const params = useParams();
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log("---", resumeInfo);
    }, []);

    const handleInputChange = (e) => {
        enabledNext(false);
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
        setResumeInfo({
            ...resumeInfo,
            [name]: value
        });
    }

    const onSave = (e) => {
        e.preventDefault();
        setLoading(true);

        // Combine form data with existing resume info
        const updatedData = { ...resumeInfo, ...formData };

        // Save the combined data to localStorage
        setTimeout(() => {  // Simulating a delay for the loading animation
            localStorage.setItem('resumeData', JSON.stringify(updatedData));

            // Print the saved data to the console
            console.log('Saved Data:', updatedData);

            enabledNext(true);
            setLoading(false);
            toast.success("Details saved successfully!");  // Display success pop-up
        }, 1500);  // Simulate a 1.5 seconds delay for the saving process
    }

    return (
        <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
            <h2 className='font-bold text-lg'>Personal Detail</h2>
            <p>Get Started with the basic information</p>

            <form onSubmit={onSave}>
                <div className='grid grid-cols-2 mt-5 gap-3'>
                    <div>
                        <label className='text-sm'>First Name</label>
                        <Input name="firstName" defaultValue={resumeInfo?.firstName} required onChange={handleInputChange} />
                    </div>
                    <div>
                        <label className='text-sm'>Last Name</label>
                        <Input name="lastName" required onChange={handleInputChange}
                            defaultValue={resumeInfo?.lastName} />
                    </div>
                    <div className='col-span-2'>
                        <label className='text-sm'>Job Title</label>
                        <Input name="jobTitle" required
                            defaultValue={resumeInfo?.jobTitle}
                            onChange={handleInputChange} />
                    </div>
                    <div className='col-span-2'>
                        <label className='text-sm'>Address</label>
                        <Input name="address" required
                            defaultValue={resumeInfo?.address}
                            onChange={handleInputChange} />
                    </div>
                    <div>
                        <label className='text-sm'>Phone</label>
                        <Input name="phone" required
                            defaultValue={resumeInfo?.phone}
                            onChange={handleInputChange} />
                    </div>
                    <div>
                        <label className='text-sm'>Email</label>
                        <Input name="email" required
                            defaultValue={resumeInfo?.email}
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
    )
}

export default PersonalDetail;
