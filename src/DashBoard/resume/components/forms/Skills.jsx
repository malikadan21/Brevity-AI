import { Input } from '@/components/ui/input';
import React, { useContext, useEffect, useState } from 'react';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

function Skills() {
  const [skillsList, setSkillsList] = useState([{
    name: '',
    rating: 0
  }]);
  const { resumeId } = useParams();
  const [loading, setLoading] = useState(false);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  useEffect(() => {
    if (resumeInfo?.skills) {
      setSkillsList(resumeInfo.skills);
    }
  }, [resumeInfo]);

  const handleChange = (index, name, value) => {
    const newEntries = skillsList.slice();
    newEntries[index][name] = value;
    setSkillsList(newEntries);
  }

  const addNewSkill = () => {
    setSkillsList([...skillsList, {
      name: '',
      rating: 0
    }]);
  }

  const removeSkill = () => {
    setSkillsList(skillsList.slice(0, -1));
  }

  const onSave = (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedData = { ...resumeInfo, skills: skillsList };

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
      toast('Details saved successfully!');
      setLoading(false);
    }, 1500); // Simulate a delay for the loading animation
  }

  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
      <h2 className='font-bold text-lg'>Skills</h2>
      <p>Add your top professional key skills</p>

      <div>
        {skillsList.length > 0 && skillsList.map((item, index) => (
          <div key={index} className='flex justify-between mb-2 border rounded-lg p-3'>
            <div>
              <label className='text-xs'>Name</label>
              <Input
                className="w-full"
                value={item.name}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
              />
            </div>
            <Rating
              style={{ maxWidth: 120 }}
              value={item.rating}
              onChange={(v) => handleChange(index, 'rating', v)}
            />
          </div>
        ))}
      </div>
      <div className='flex justify-between'>
        <div className='flex gap-2'>
          <Button variant="outline" onClick={addNewSkill} className="text-primary">
            + Add More Skill
          </Button>
          <Button variant="outline" onClick={removeSkill} className="text-primary">
            - Remove
          </Button>
        </div>
        <Button disabled={loading} onClick={onSave}>
          {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
        </Button>
      </div>
    </div>
  );
}

export default Skills;
