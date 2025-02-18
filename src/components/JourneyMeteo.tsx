import { Meteo, Wind as WindData } from '@/types/Meteo';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Import des icônes depuis les assets
import sunnyIcon from '@/assets/icons/meteo/sunny.png';
import partlyCloudyIcon from '@/assets/icons/meteo/partly-cloudy.png';
import cloudyIcon from '@/assets/icons/meteo/cloudy.png';
import snowIcon from '@/assets/icons/meteo/snow.png';
import rainIcon from '@/assets/icons/meteo/rain.png';
import windIcon from '@/assets/icons/meteo/wind.png';
import tempIcon from '@/assets/icons/meteo/temperature.png';
import isoIcon from '@/assets/icons/meteo/iso.png';

interface JourneyMeteoProps {
    meteo: Meteo;
    journeyDate: Date;
    onUpdateClick?: () => void;
}

interface WindArrowProps {
    wind: WindData;
}

const skyIcons = {
    SUNNY: sunnyIcon,
    PARTLY_CLOUDY: partlyCloudyIcon,
    CLOUDY: cloudyIcon,
    SNOW: snowIcon,
    RAIN: rainIcon,
};

const BeraIndicator = ({ level }: { level: number }) => (
    <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
            <div
                key={n}
                className={`w-3 h-6 rounded-sm transition-colors ${
                    n <= level ? 'bg-red-500' : 'bg-gray-200'
                }`}
            />
        ))}
    </div>
);

const WindArrow = ({ wind }: WindArrowProps) => (
    <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
            <img src={windIcon} alt="Wind" className="h-8 w-8" />
            <div
                className="transform transition-transform"
                style={{
                    transform: `rotate(${wind.getRotation()}deg)`,
                }}
            >
                ↑
            </div>
        </div>
        <span className="text-sm">{wind.speed} km/h</span>
    </div>
);

const JourneyMeteo = ({
    meteo,
    journeyDate,
    onUpdateClick,
}: JourneyMeteoProps) => {
    const meteoData = meteo instanceof Meteo ? meteo : new Meteo(meteo);

    return (
        <div className="flex flex-col gap-8">
            {/* Conditions principales */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-20">
                <div className="flex flex-col items-center gap-2">
                    <img
                        src={skyIcons[meteoData.sky]}
                        alt={meteoData.getDisplayName()}
                        className="h-8 w-8"
                    />
                    <span className="text-sm">
                        {meteoData.getDisplayName()}
                    </span>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <WindArrow wind={meteoData.wind} />
                </div>

                <div className="flex flex-col items-center gap-2">
                    <BeraIndicator level={meteoData.bera} />
                    <span className="text-sm">BERA {meteoData.bera}/5</span>
                </div>
            </div>

            {/* Températures et ISO */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-20">
                <div className="flex flex-col items-center gap-2">
                    <img src={tempIcon} alt="Temperature" className="h-8 w-8" />
                    <div className="text-sm text-center">
                        <div>Sommet: {meteoData.temperature.top}°C</div>
                        <div>Base: {meteoData.temperature.bottom}°C</div>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <img src={isoIcon} alt="ISO" className="h-8 w-8" />
                    <div className="text-sm text-center">
                        <div>ISO 0° jour: {meteoData.iso.day}m</div>
                        <div>ISO 0° nuit: {meteoData.iso.night}m</div>
                    </div>
                </div>
            </div>

            {meteoData.shouldUpdateMeteo(journeyDate) && (
                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        Les prévisions météo peuvent être actualisées à J-7 de
                        la course.{' '}
                        <button
                            onClick={onUpdateClick}
                            className="text-blue-600 hover:text-blue-800 underline"
                        >
                            Modifier la course pour actualiser la météo
                        </button>
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
};

export default JourneyMeteo;
