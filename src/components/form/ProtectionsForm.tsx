import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import SectionTitle from '@/components/SectionTitle';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import { Protections, Rope } from '@/types/Protection';
import { Label } from '../ui/label';

interface ProtectionsFormProps {
    protections: Protections;
    onChange: (protections: Protections) => void;
}

const ProtectionsForm: React.FC<ProtectionsFormProps> = ({
    protections,
    onChange,
}) => {
    const [camsInput, setCamsInput] = useState(
        protections.cams?.join(' ') || ''
    );

    const handleRopeDiameterChange = (index: number, value: string) => {
        const diameter = parseFloat(value) || 0;
        const updatedRopes = [...protections.ropes];
        updatedRopes[index] = new Rope({
            ...updatedRopes[index],
            diameter,
        });

        const updatedProtections = new Protections({
            ...protections,
            ropes: updatedRopes,
        });

        onChange(updatedProtections);
    };

    const handleRopeLengthChange = (index: number, value: string) => {
        const length = parseInt(value) || 0;
        const updatedRopes = [...protections.ropes];
        updatedRopes[index] = new Rope({
            ...updatedRopes[index],
            length,
        });

        const updatedProtections = new Protections({
            ...protections,
            ropes: updatedRopes,
        });

        onChange(updatedProtections);
    };

    const handleAddRope = () => {
        const updatedProtections = new Protections({
            ...protections,
            ropes: [...protections.ropes, new Rope()],
        });

        onChange(updatedProtections);
    };

    const handleRemoveRope = (index: number) => {
        if (protections.ropes.length <= 1) return; // Garder au moins une corde

        const updatedRopes = [...protections.ropes];
        updatedRopes.splice(index, 1);

        const updatedProtections = new Protections({
            ...protections,
            ropes: updatedRopes,
        });

        onChange(updatedProtections);
    };

    const handleNutsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nuts = parseInt(e.target.value) || 0;

        const updatedProtections = new Protections({
            ...protections,
            nuts,
        });

        onChange(updatedProtections);
    };

    const handleCamsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawInput = e.target.value;
        setCamsInput(rawInput);

        // Conversion en nombres seulement quand on a une valeur valide
        const cams = rawInput
            .split(/\s+/)
            .map((value) => {
                // Ne pas modifier si l'utilisateur est en train de taper un nombre décimal
                if (value.endsWith('.')) {
                    return NaN; // On filtrera ça
                }
                return parseFloat(value.trim());
            })
            .filter((value) => !isNaN(value));

        const updatedProtections = new Protections({
            ...protections,
            cams: cams,
        });

        onChange(updatedProtections);
    };

    const handleCamsBlur = () => {
        const cleanedCams = camsInput
            .split(/\s+/)
            .map((v) => parseFloat(v.trim()))
            .filter((v) => !isNaN(v));
        setCamsInput(cleanedCams.join(' '));
    };

    const handleScrewsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const screws = parseInt(e.target.value) || 0;

        const updatedProtections = new Protections({
            ...protections,
            screws,
        });

        onChange(updatedProtections);
    };

    return (
        <>
            <SectionTitle content="Protections" />
            <Card className="mb-8">
                <CardContent className="pt-6">
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <Label>Cordes</Label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAddRope}
                                className="flex items-center gap-1"
                            >
                                <Plus size={14} />
                                Ajouter
                            </Button>
                        </div>

                        <div className="flex flex-col gap-4">
                            {protections.ropes.map((rope, index) => (
                                <div
                                    className="flex items-end gap-3"
                                    key={`rope-${index}`}
                                >
                                    <div className="flex-1">
                                        <Label
                                            htmlFor={`rope-diameter-${index}`}
                                            className="text-sm"
                                        >
                                            Diamètre (mm)
                                        </Label>
                                        <Input
                                            id={`rope-diameter-${index}`}
                                            type="number"
                                            step="0.1"
                                            value={rope.diameter || ''}
                                            onChange={(e) =>
                                                handleRopeDiameterChange(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            placeholder="8.4"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <Label
                                            htmlFor={`rope-length-${index}`}
                                            className="text-sm"
                                        >
                                            Longueur (m)
                                        </Label>
                                        <Input
                                            id={`rope-length-${index}`}
                                            type="number"
                                            value={rope.length || ''}
                                            onChange={(e) =>
                                                handleRopeLengthChange(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            placeholder="50"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleRemoveRope(index)}
                                        className="mb-0"
                                        disabled={protections.ropes.length <= 1}
                                    >
                                        <Minus size={14} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <Label htmlFor="nuts">Nombre de coinceurs</Label>
                            <Input
                                id="nuts"
                                type="number"
                                name="protections.nuts"
                                value={protections.nuts || ''}
                                onChange={handleNutsChange}
                                placeholder="0"
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <Label htmlFor="cams">
                                Friends (tailles, séparées par des espaces)
                            </Label>
                            <Input
                                id="cams"
                                name="cams"
                                value={camsInput}
                                onChange={handleCamsChange}
                                placeholder="1.2 2.3 3.4"
                                className="mt-2"
                                onBlur={handleCamsBlur}
                            />
                        </div>
                        <div>
                            <Label htmlFor="screws">
                                Nombre de broches à glace
                            </Label>
                            <Input
                                id="screws"
                                type="number"
                                name="protections.screws"
                                value={protections.screws || ''}
                                onChange={handleScrewsChange}
                                placeholder="0"
                                className="mt-2"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
};

export default ProtectionsForm;
