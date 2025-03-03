import React from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import SectionTitle from '@/components/SectionTitle';
import { Altitudes } from '@/types/Topo';
import { Label } from '@radix-ui/react-label';

interface AltitudesFormProps {
    altitudes: Altitudes;
    onChange: (altitudes: Altitudes) => void;
}

const AltitudesForm: React.FC<AltitudesFormProps> = ({
    altitudes,
    onChange,
}) => {
    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const max = Number(e.target.value) || 0;
        const updatedAltitudes = new Altitudes({
            ...altitudes,
            max,
        });
        onChange(updatedAltitudes);
    };

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const min = Number(e.target.value) || 0;
        const updatedAltitudes = new Altitudes({
            ...altitudes,
            min,
        });
        onChange(updatedAltitudes);
    };

    const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const total = Number(e.target.value) || 0;
        const updatedAltitudes = new Altitudes({
            ...altitudes,
            total,
        });
        onChange(updatedAltitudes);
    };

    return (
        <>
            <SectionTitle content="Altitudes" />
            <Card className="mb-8">
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <Label htmlFor="alt-max">
                                Altitude maximale (m)
                            </Label>
                            <Input
                                id="alt-max"
                                type="number"
                                name="altitudes.max"
                                value={altitudes.max || ''}
                                onChange={handleMaxChange}
                                placeholder="4000"
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <Label htmlFor="alt-min">
                                Altitude minimale (m)
                            </Label>
                            <Input
                                id="alt-min"
                                type="number"
                                name="altitudes.min"
                                value={altitudes.min || ''}
                                onChange={handleMinChange}
                                placeholder="2000"
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <Label htmlFor="alt-total">
                                Dénivelé total (m)
                            </Label>
                            <Input
                                id="alt-total"
                                type="number"
                                name="altitudes.total"
                                value={altitudes.total || ''}
                                onChange={handleTotalChange}
                                placeholder="2200"
                                className="mt-2"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
};

export default AltitudesForm;
