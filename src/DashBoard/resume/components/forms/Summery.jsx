import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Brain, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AIChatSession } from './../../../../../service/AIModal';

const promptTemplate = "Job Title: {jobTitle}, Based on the job title, provide a list of summaries for 3 experience levels: Mid Level and Fresh Level in 3-4 lines in array format, with 'summary' and 'experience_level' fields in JSON format";

function Summary({ enabledNext }) {
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const [summary, setSummary] = useState(resumeInfo?.summary || '');
    const [loading, setLoading] = useState(false);
    const [aiGeneratedSummaryList, setAiGenerateSummaryList] = useState([]);
    const { resumeId } = useParams();

    useEffect(() => {
        if (summary) {
            setResumeInfo(prev => ({
                ...prev,
                summary
            }));
        }
    }, [summary, setResumeInfo]);

    const generateSummaryFromAI = async () => {
        try {
            setLoading(true);
            const prompt = promptTemplate.replace('{jobTitle}', resumeInfo?.jobTitle || '');
            console.log(prompt);

            const result = await AIChatSession.sendMessage(prompt);
            const summaries = JSON.parse(result.response.text());

            setAiGenerateSummaryList(summaries);
        } catch (error) {
            console.error("Failed to generate summary from AI:", error);
            toast.error("Failed to generate summary. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const onSave = (e) => {
        e.preventDefault();
        setLoading(true);

        const updatedData = { ...resumeInfo, summary };

        setTimeout(() => {
            const storedResumes = JSON.parse(localStorage.getItem('resumes')) || [];
            const updatedResumes = storedResumes.map(resume =>
                resume.resumeId === resumeId ? updatedData : resume
            );

            if (!storedResumes.some(resume => resume.resumeId === resumeId)) {
                updatedResumes.push(updatedData);
            }

            localStorage.setItem('resumes', JSON.stringify(updatedResumes));
            setResumeInfo(updatedData);

            enabledNext(true);
            toast.success("Details saved successfully");
            setLoading(false);
        }, 1500);
    };

    return (
        <div>
            <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
                <h2 className='font-bold text-lg'>Summary</h2>
                <p>Add a summary for your job title</p>

                <form className='mt-7' onSubmit={onSave}>
                    <div className='flex justify-between items-end'>
                        <label>Add Summary</label>
                        <Button variant="outline" onClick={generateSummaryFromAI} 
                        type="button" size="sm" className="border-primary text-primary flex gap-2"> 
                        <Brain className='h-4 w-4' /> Generate from AI</Button>
                    </div>
                    <Textarea className="mt-5" required
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                    />
                    <div className='mt-2 flex justify-end'>
                        <Button type="submit" disabled={loading}>
                            {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
                        </Button>
                    </div>
                </form>
            </div>

            {aiGeneratedSummaryList && aiGeneratedSummaryList.length > 0 && (
                <div className='my-5'>
                    <h2 className='font-bold text-lg'>Suggestions</h2>
                    {aiGeneratedSummaryList.map((item, index) => (
                        <div key={index} 
                        onClick={() => setSummary(item?.summary)}
                        className='p-5 shadow-lg my-4 rounded-lg cursor-pointer'>
                            <h2 className='font-bold my-1 text-primary'>Level: {item?.experience_level}</h2>
                            <p>{item?.summary}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Summary;
