import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import JourneyFiltersProps from '@/components/JourneyFiltersProps';

interface Journey {
    id: string;
    title: string;
    date: string;
    season: 'SUMMER' | 'WINTER';
}

const Journeys = () => {
    const [journeys, setJourneys] = useState<Journey[]>([]);
    const [filteredJourneys, setFilteredJourneys] = useState<Journey[]>([]);

    // Fonction pour gérer les changements de filtres
    const handleFiltersChange = ({
        dateRange,
        season,
    }: {
        dateRange: DateRange | undefined;
        season: 'SUMMER' | 'WINTER' | undefined;
    }) => {
        // On part de la liste complète des journeys
        let filtered = [...journeys];

        // Filtre par date si une période est sélectionnée
        if (dateRange?.from && dateRange?.to) {
            filtered = filtered.filter((journey) => {
                const journeyDate = new Date(journey.date);
                return (
                    journeyDate >= dateRange.from && journeyDate <= dateRange.to
                );
            });
        }

        // Filtre par saison si une saison est sélectionnée
        if (season) {
            filtered = filtered.filter((journey) => journey.season === season);
        }

        setFilteredJourneys(filtered);
    };

    // Récupération des journeys depuis l'API
    useEffect(() => {
        const fetchJourneys = async () => {
            try {
                const response = await fetch('/api/journeys'); // ajuste l'URL selon ton API
                if (!response.ok) throw new Error('Failed to fetch journeys');
                const data = await response.json();
                setJourneys(data);
                setFilteredJourneys(data); // initialise avec tous les journeys
            } catch (error) {
                console.error('Error fetching journeys:', error);
                // Gère l'erreur comme tu le souhaites
            }
        };

        fetchJourneys();
    }, []);

    return (
        <div className="container mx-auto py-6">
            <div className="flex flex-col gap-6">
                <JourneyFiltersProps onFiltersChange={handleFiltersChange} />

                {/* Affichage des journeys filtrés */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredJourneys.map((journey) => (
                        <div
                            key={journey.id}
                            className="p-4 border rounded-lg shadow-sm"
                        >
                            <h3 className="font-semibold">{journey.title}</h3>
                            <p>{new Date(journey.date).toLocaleDateString()}</p>
                            <p>{journey.season}</p>
                            {/* Ajoute d'autres infos que tu veux afficher */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Journeys;
