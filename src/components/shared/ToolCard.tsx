import { useState } from 'react';
import { Tool, InputEnum } from '../screens/Index';
import { PencilSquareIcon, CheckIcon, XCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface ToolCardProps {
  tool: Tool;
  onUpdateTool: (updatedTool: Partial<Tool>) => void;
  onDeleteTool: (id: string) => void;
}

const ToolCard = ({ tool, onUpdateTool, onDeleteTool }: ToolCardProps) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [inputData, setInputData] = useState<Partial<Tool>>(tool);

  const toggleIsEdit = () => setIsEdit((prevIsEdit) => !prevIsEdit);

  const onClose = () => {
    setIsEdit(false);
    setInputData({ ...tool });
  };

  const handleInputChange = (field: InputEnum, value: string) => {
    setInputData({ ...inputData, [field]: value });
  };

  const handleUpdate = () => {
    setIsEdit(false);

    // Check if all required fields are filled
    if (!inputData.title || !inputData.description || !inputData.url) {
      console.error('All fields are required!');
      return;
    }

    // Update the tool if any of the input values have changed
    if (inputData.title !== tool.title || inputData.description !== tool.description || inputData.url !== tool.url) {
      onUpdateTool({ ...inputData, id: tool.id });
    }
  };

  const inputClasses = clsx('bg-transparent', 'border-0', 'py-2', 'px-4', 'rounded-md');

  return (
    <div
      key={tool.id}
      className="h-48 group relative rounded-md flex flex-col justify-between shadow-slate-900 shadow-md p-4 bg-gradient-to-r from-slate-800 to-slate-700"
    >
      <div className="pt-6">
        <input
          className={clsx(inputClasses, 'text-xl mb-2 font-bold text-slate-100 outline-none', {
            'bg-gray-900': isEdit,
            'cursor-text': isEdit,
            'focus:outline-white': isEdit,
          })}
          value={inputData.title}
          onChange={(e) => handleInputChange(InputEnum.Title, e.target.value)}
          readOnly={!isEdit}
        />
        <input
          className={clsx(inputClasses, 'outline-none', {
            'bg-gray-900': isEdit,
            'cursor-text': isEdit,
            'focus:outline-white': isEdit,
          })}
          value={inputData.description}
          onChange={(e) => handleInputChange(InputEnum.Description, e.target.value)}
          readOnly={!isEdit}
        />
      </div>
      {isEdit ? (
        <div className={inputClasses}>{inputData.url}</div>
      ) : (
        <a href={inputData.url} target="_blank" rel="noreferrer">
          <input
            className={clsx(inputClasses, 'text-slate-400 outline-none cursor-pointer')}
            value={inputData.url}
            onChange={(e) => handleInputChange(InputEnum.Url, e.target.value)}
            readOnly={!isEdit}
          />
        </a>
      )}

      {isEdit ? (
        <>
          <CheckIcon
            onClick={() => {
              if (inputData.title && inputData.description && inputData.url) {
                handleUpdate();
              }
            }}
            className="h-6 w-6 text-green-500 absolute top-4 hover:text-green-400 right-16 cursor-pointer"
          />
          <XCircleIcon
            onClick={onClose}
            className="h-6 w-6 text-red-900 absolute top-4 hover:text-red-700 right-10 cursor-pointer"
          />
          <TrashIcon
            onClick={() => onDeleteTool(tool.id)}
            className="h-6 w-6 text-red-900 absolute top-4 right-2 cursor-pointer hover:text-red-700"
          />
        </>
      ) : (
        <button
          className="btn btn-active btn-ghost hidden group-hover:block absolute top-4 right-4 p-0"
          onClick={toggleIsEdit}
          disabled={!tool.title || !tool.description || !tool.url}
        >
          <PencilSquareIcon className="h-6 w-6 text-slate-50 cursor-pointer" />
        </button>
      )}
    </div>
  );
};

export default ToolCard;
