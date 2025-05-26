import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function BackButton() {
  const navigate = useNavigate();

  return (
    <div className="relative">
  <button
  className="flex items-center bg-white text-blue-500 px-3 py-1.5 hover:bg-gray-200 rounded-[10px] border border-blue-300"
  onClick={() => navigate('/deals')} // Navigates to the "/deal" route
>
  <ArrowLeft className="mr-2 text-3xl text-blue-500" /> {/* Icon with blue color */}
  <p className="text-lg font-bold text-blue-500">Back</p> {/* Text with blue color */}
</button>

    </div>
  );
}

export default BackButton;
