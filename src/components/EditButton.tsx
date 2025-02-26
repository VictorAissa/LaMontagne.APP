import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface EditButtonProps {
    journeyId: number | null;
    textContent: string;
}

const EditButton = ({ journeyId, textContent }: EditButtonProps) => {
    const navigate = useNavigate();
    const handleClick = () => {
        if (journeyId) {
            navigate(`/journeys/${journeyId}/edit`);
        }
    };

    return <Button onClick={handleClick}>{textContent}</Button>;
};

export default EditButton;
