import Header from '@/components/custom/Header';
import { Button } from '@/components/ui/button';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import ResumePreview from '@/dashboard/resume/components/ResumePreview';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RWebShare } from 'react-web-share';

function ViewResume() {
    const [resumeInfo, setResumeInfo] = useState(null);
    const { resumeId } = useParams();

    useEffect(() => {
        GetResumeInfo();
    }, []);

    const GetResumeInfo = () => {
        // Retrieve resume data from local storage
        const storedResumeData = JSON.parse(localStorage.getItem('resumes')) || [];
        const selectedResume = storedResumeData.find(resume => resume.resumeId === resumeId);

        if (selectedResume) {
            setResumeInfo(selectedResume);
        } else {
            console.error('No matching resume data found in local storage.');
        }
    };

    const HandleDownload = () => {
        window.print(); // Initiates the browser's print dialog
    };

    return (
        <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }} >
            <div id="no-print">
                <Header />
                <div className='my-10 mx-10 md:mx-20 lg:mx-36'>
                    <h2 className='text-center text-2xl font-medium'>
                        Your AI-powered resume is polished and ready to go!
                    </h2>
                    <p className='text-center text-gray-700'>
                        Download it now and share your personalized resume link with friends and family to showcase your professional journey.
                    </p>
                    <div className='flex justify-between px-44 my-10'>
                        <Button onClick={HandleDownload}>Download</Button>
                        <RWebShare
                            data={{
                                text: "Hello Everyone, This is my resume please open the URL to see it",
                                url: `${import.meta.env.VITE_BASE_URL}/my-resume/${resumeId}/view`,
                                title: `${resumeInfo?.firstName} ${resumeInfo?.lastName}'s Resume`,
                            }}
                            onClick={() => console.log("shared successfully!")}
                        >
                            <Button>Share</Button>
                        </RWebShare>
                    </div>
                </div>
            </div>
            <div className='my-10 mx-10 md:mx-20 lg:mx-36'>
                <div id="print-area">
                    <ResumePreview />
                </div>
            </div>
        </ResumeInfoContext.Provider>
    );
}

export default ViewResume;
