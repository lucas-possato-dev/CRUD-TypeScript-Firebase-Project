import React from 'react';
import { useState, useEffect } from 'react';
import { Head } from '~/components/shared/Head';
import { useFirestore } from '~/lib/firebase';
import { collection, query, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import ToolCard from '../shared/ToolCard';

import 'react-toastify/dist/ReactToastify.css';

export interface Tool {
  id: string;
  title?: string;
  description?: string;
  url?: string;
}

export enum InputEnum {
  Id = 'id',
  Title = 'title',
  Description = 'description',
  Url = 'url',
}

function Index() {
  const { state } = useAuthState();
  const [tools, setTools] = useState<Array<Tool>>([]);
  const firestore = useFirestore();
  const storage = useStorage();
  const [inputData, setInputData] = useState<Partial<Tool>>({
    title: '',
    description: '',
    url: '',
  });

  const [formError, setFormError] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      const toolsCollection = collection(firestore, 'tools');
      const toolsQuery = query(toolsCollection);
      const querySnapshot = await getDocs(toolsQuery);
      const fetchedData: Array<Tool> = [];
      querySnapshot.forEach((doc) => {
        fetchedData.push({ id: doc.id, ...doc.data() } as Tool);
      });
      setTools(fetchedData);
    }
    fetchData();
  }, []);

  const onUpdateTool = (updatedTool: Partial<Tool>) => {
    if (!updatedTool.id) {
      return;
    }

    const docRef = doc(firestore, 'tools', updatedTool.id);
    updateDoc(docRef, updatedTool)
      .then(() => {
        toast.success('Updated successfully!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onDeleteTool = (id: string) => {
    const docRef = doc(firestore, 'tools', id);

    deleteDoc(docRef)
      .then(() => {
        toast.success('Deleted successfully!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });

        // Remove o item deletado da lista de ferramentas
        setTools(tools.filter((tool) => tool.id !== id));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleInputChange = (field: InputEnum, value: string | undefined) => {
    setInputData({ ...inputData, [field]: value });
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const toolsCollection = collection(firestore, 'tools');

      const newTool: Partial<Tool> = {
        title: inputData.title,
        description: inputData.description,
        url: inputData.url,
      };

      const docRef = await addDoc(toolsCollection, newTool);

      toast.success('Saved successfully!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      setTools([
        ...tools,
        { id: docRef.id, title: inputData.title, description: inputData.description, url: inputData.url },
      ]);
      setInputData({
        title: '',
        description: '',
        url: '',
      });
    } catch (error) {
      setFormError(true);
    }
  };

  return (
    <>
      <Head title="Tools AI" />
      <div className="hero h-screen bg-slate-800">
        <div className="max-w-5xl mx-auto">
          <form className="flex flex-col lg:flex-row items-center  justify-center" onSubmit={handleFormSubmit}>
            <input
              type="text"
              onChange={(event) => handleInputChange(InputEnum.Title, event.target.value)}
              value={inputData.title}
              placeholder="Title"
              className="m-4 text-slate-50 bg-transparent border border-slate-700 focus:ring-slate-400 focus:outline-none p-4 rounded-lg"
            />
            <input
              type="text"
              onChange={(event) => handleInputChange(InputEnum.Description, event.target.value)}
              value={inputData.description}
              placeholder="Description"
              className="m-4 text-slate-50 bg-transparent border border-slate-700 focus:ring-slate-400 focus:outline-none p-4 rounded-lg"
            />
            <input
              type="text"
              onChange={(event) => handleInputChange(InputEnum.Url, event.target.value)}
              value={inputData.url}
              placeholder="URL"
              className="m-4 text-slate-50 bg-transparent border border-slate-700 focus:ring-slate-400 focus:outline-none p-4 rounded-lg"
            />
            <button
              type="submit"
              className="m-4 border border-purple-500 p-3 rounded-lg transition-opacity bg-purple-600 bg-opacity-30 hover:bg-opacity-50 text-slate-50"
            >
              Add new tool
            </button>
          </form>
          <div className="max-w-[600px] md:max-w-[1000px]">
            <div className="grid sm:grid-cols-2 gap-4 sm:w-full mx-auto bg-transparent text-slate-50">
              {tools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onUpdateTool={onUpdateTool}
                  onDeleteTool={(id: string) => onDeleteTool(id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Index;
