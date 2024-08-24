import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Brain, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';

const prompt = "Job Title: {jobTitle} , Depends on job title give me list of summary for 3 experience levels: Mid Level and Fresh level in 3 -4 lines in array format, with summary and experience_level fields in JSON format";

function Summery({ enabledNext }) {
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const [summary, setSummary] = useState(resumeInfo?.summary || '');
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const [aiGeneratedSummaryList, setAiGenerateSummaryList] = useState([]);

    useEffect(() => {
        if (summary) {
            setResumeInfo({
                ...resumeInfo,
                summary: summary
            });
        }
    }, [summary]);

    const generateSummaryFromAI = async () => {
        setLoading(true);
        const PROMPT = prompt.replace('{jobTitle}', resumeInfo?.jobTitle);
        console.log(PROMPT);
        const result = await AIChatSession.sendMessage(PROMPT);
        console.log(JSON.parse(result.response.text()));

        setAiGenerateSummaryList(JSON.parse(result.response.text()));
        setLoading(false);
    }

    const onSave = (e) => {
        e.preventDefault();

        setLoading(true);

        // Combine summary with existing resume info
        const updatedData = { ...resumeInfo, summary };

        // Save the combined data to localStorage
        localStorage.setItem('resumeData', JSON.stringify(updatedData));

        // Print the saved data to the console
        console.log('Saved Data:', updatedData);

        enabledNext(true);
        setLoading(false);
        toast("Details saved successfully");
    }

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
                        <Brain className='h-4 w-4' />  Generate from AI</Button>
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

            {aiGeneratedSummaryList && (
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
    )
}

export default Summery
