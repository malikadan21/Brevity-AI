import React, { useContext, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import RichTextEditor from '../RichTextEditor'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { LoaderCircle } from 'lucide-react'

const formField = {
    title: '',
    companyName: '',
    city: '',
    state: '',
    startDate: '',
    endDate: '',
    workSummary: '',
}

function Experience({ enabledNext }) {
    const [experienceList, setExperienceList] = useState([]);
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const params = useParams();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (resumeInfo?.Experience) {
            setExperienceList(resumeInfo.Experience);
        }
    }, [resumeInfo]);

    const handleChange = (index, event) => {
        const newEntries = experienceList.slice();
        const { name, value } = event.target;
        newEntries[index][name] = value;
        setExperienceList(newEntries);
    }

    const handleRichTextEditor = (event, name, index) => {
        const newEntries = experienceList.slice();
        newEntries[index][name] = event.target.value;
        setExperienceList(newEntries);
    }

    const addNewExperience = () => {
        setExperienceList([...experienceList, { ...formField }]);
    }

    const removeExperience = () => {
        setExperienceList(experienceList.slice(0, -1));
    }

    const onSave = (e) => {
        e.preventDefault();
        setLoading(true);

        // Combine experience list with existing resume info
        const updatedData = { ...resumeInfo, Experience: experienceList };

        // Save the combined data to localStorage
        localStorage.setItem('resumeData', JSON.stringify(updatedData));

        // Print the saved data to the console
        console.log('Saved Data:', updatedData);

        // Update resume info context
        setResumeInfo(updatedData);

        // Notify user
        toast("Details saved successfully");
        setLoading(false);
    }

    return (
        <div>
            <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
                <h2 className='font-bold text-lg'>Professional Experience</h2>
                <p>Add your previous job experience</p>

                <form className='mt-7' onSubmit={onSave}>
                    <div>
                        {experienceList.map((item, index) => (
                            <div key={index} className='grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg'>
                                <div>
                                    <label className='text-xs'>Position Title</label>
                                    <Input
                                        name="title"
                                        onChange={(event) => handleChange(index, event)}
                                        value={item?.title}
                                    />
                                </div>
                                <div>
                                    <label className='text-xs'>Company Name</label>
                                    <Input
                                        name="companyName"
                                        onChange={(event) => handleChange(index, event)}
                                        value={item?.companyName}
                                    />
                                </div>
                                <div>
                                    <label className='text-xs'>City</label>
                                    <Input
                                        name="city"
                                        onChange={(event) => handleChange(index, event)}
                                        value={item?.city}
                                    />
                                </div>
                                <div>
                                    <label className='text-xs'>State</label>
                                    <Input
                                        name="state"
                                        onChange={(event) => handleChange(index, event)}
                                        value={item?.state}
                                    />
                                </div>
                                <div>
                                    <label className='text-xs'>Start Date</label>
                                    <Input
                                        type="date"
                                        name="startDate"
                                        onChange={(event) => handleChange(index, event)}
                                        value={item?.startDate}
                                    />
                                </div>
                                <div>
                                    <label className='text-xs'>End Date</label>
                                    <Input
                                        type="date"
                                        name="endDate"
                                        onChange={(event) => handleChange(index, event)}
                                        value={item?.endDate}
                                    />
                                </div>
                                <div className='col-span-2'>
                                    <label className='text-xs'>Work Summary</label>
                                    <RichTextEditor
                                        index={index}
                                        defaultValue={item?.workSummary}
                                        onRichTextEditorChange={(event) => handleRichTextEditor(event, 'workSummary', index)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='flex justify-between'>
                        <div className='flex gap-2'>
                            <Button variant="outline" onClick={addNewExperience} className="text-primary">+ Add More Experience</Button>
                            <Button variant="outline" onClick={removeExperience} className="text-primary">- Remove</Button>
                        </div>
                        <Button type="submit" disabled={loading}>
                            {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Experience;
