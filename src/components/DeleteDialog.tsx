import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { deleteJourney } from '@/store/features/journeySlice';
import { AppDispatch } from '@/store/store';

interface DeleteDialogProps {
    journeyId: string;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({ journeyId }) => {
    const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
    const [deleteError, setDeleteError] = useState<string>('');
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleDelete = async (
        e: React.MouseEvent<HTMLButtonElement>
    ): Promise<void> => {
        e.preventDefault();
        setIsDeleteLoading(true);
        setDeleteError('');

        try {
            if (journeyId) {
                await dispatch(deleteJourney(journeyId)).unwrap();
                navigate('/journeys');
            } else {
                setDeleteError(
                    'Impossible de supprimer une course sans identifiant'
                );
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setDeleteError(error.message);
            } else {
                setDeleteError(String(error));
            }
        } finally {
            setIsDeleteLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    variant="destructive"
                    className="bg-red-500"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    Supprimer
                </Button>
            </DialogTrigger>
            <DialogContent className="w-auto flex flex-col gap-8 rounded-sm">
                <DialogHeader>
                    <DialogTitle>Sûr(e) de supprimer la course ?</DialogTitle>
                </DialogHeader>
                <DialogFooter className="flex flex-row justify-center gap-6">
                    <Button
                        variant="destructive"
                        className="bg-red-500"
                        onClick={handleDelete}
                        disabled={isDeleteLoading}
                    >
                        {isDeleteLoading ? 'Suppression...' : 'Confirmer'}
                    </Button>
                    <DialogClose asChild>
                        <Button
                            type="button"
                            variant="secondary"
                            disabled={isDeleteLoading}
                        >
                            Annuler
                        </Button>
                    </DialogClose>
                </DialogFooter>
                {deleteError && (
                    <div className="text-red-500 text-center mt-2">
                        {deleteError}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default DeleteDialog;
