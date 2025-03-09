import { Meteo } from '@/types/Meteo';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import sunnyIcon from '@/assets/icons/meteo/sunny.png';
import partlyCloudyIcon from '@/assets/icons/meteo/partly-cloudy.png';
import cloudyIcon from '@/assets/icons/meteo/cloudy.png';
import lightSnowIcon from '@/assets/icons/meteo/snow.png';
import heavySnowIcon from '@/assets/icons/meteo/heavy_snow.png';
import heavyRainIcon from '@/assets/icons/meteo/rain.png';
import lightRainIcon from '@/assets/icons/meteo/rain.png';
import mountainIcon from '@/assets/icons/meteo/mountain.png';
import maxTemp from '@/assets/icons/meteo/high-temperature.png';
import minTemp from '@/assets/icons/meteo/low-temperature.png';
import moon from '@/assets/icons/meteo/crescent-moon.png';
import windArrow from '@/assets/icons/meteo/wind-direction.png';
import { Button } from './ui/button';

interface JourneyMeteoProps {
    meteo: Meteo;
    journeyDate: Date;
    onUpdateClick?: () => void;
}

const skyIcons = {
    SUNNY: sunnyIcon,
    PARTLY_CLOUDY: partlyCloudyIcon,
    CLOUDY: cloudyIcon,
    LIGHT_SNOW: lightSnowIcon,
    HEAVY_SNOW: heavySnowIcon,
    LIGHT_RAIN: lightRainIcon,
    HEAVY_RAIN: heavyRainIcon,
};

const JourneyMeteo = ({
    meteo,
    journeyDate,
    onUpdateClick,
}: JourneyMeteoProps) => {
    const meteoData = meteo instanceof Meteo ? meteo : new Meteo(meteo);
    journeyDate = new Date();

    return (
        <div className="w-full flex flex-col gap-12 max-w-[800px] justify-self-center">
            <div className="w-full flex justify-center">
                <img
                    src={skyIcons[meteoData.sky]}
                    alt={meteoData.getDisplayName()}
                    className="h-32 w-32"
                />
            </div>
            <div className="flex flex-wrap justify-center gap-12 md:gap-16">
                <div className="flex flex-col items-center bg-zinc-50 py-4 px-6 rounded-md">
                    <h4 className="text-xl mb-3">Vent</h4>
                    <div className="flex flex-col items-center">
                        <div
                            className="transform transition-transform"
                            style={{
                                transform: `rotate(${meteoData.wind.getRotation()}deg)`,
                            }}
                        >
                            <img
                                src={windArrow}
                                alt="Wind arrow"
                                className="w-8 h-8"
                            />
                        </div>
                        <span className="flex justify-center text-sm">
                            {meteoData.wind.speed} km/h
                        </span>
                    </div>
                </div>

                <div className="flex flex-col items-center bg-zinc-50 py-4 px-6 rounded-md">
                    <h4 className="text-xl mb-3">Températures</h4>
                    <div className="flex gap-6">
                        <div className="flex flex-col items-center">
                            <img src={minTemp} alt="" className="w-8 h-8" />
                            <span className="flex justify-center text-sm">
                                {meteoData.temperature.min}°C
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <img src={maxTemp} alt="" className="w-8 h-8" />
                            <span className="flex justify-center text-sm">
                                {meteoData.temperature.max}°C
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center bg-zinc-50 py-4 px-6 rounded-md">
                    <h4 className="text-xl mb-3">Iso 0°</h4>
                    <div className="flex gap-6">
                        <div>
                            <img src={sunnyIcon} alt="" className="w-8 h-8" />
                            <span className="flex justify-center text-sm">
                                {meteoData.iso.day}m
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <img src={moon} alt="" className="w-8 h-8" />
                            <span className="flex justify-center text-sm">
                                {meteoData.iso.night}m
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center bg-zinc-50 py-4 px-6 rounded-md">
                    <h4 className="text-xl mb-3">Bera</h4>
                    <div className="flex flex-col items-center">
                        <img
                            src={mountainIcon}
                            alt="Mountain icon for BERA"
                            className="w-8 h-8"
                        />
                        <span className="flex justify-center text-sm">
                            {meteoData.bera}
                        </span>
                    </div>
                </div>
            </div>

            {meteoData.shouldUpdateMeteo(journeyDate) && (
                <Alert className="flex flex-col items-center gap-5">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="h-8 w-8" />
                        <AlertDescription>
                            Les prévisions météo peuvent être actualisées à J-7
                            de la course.
                        </AlertDescription>
                    </div>
                    <Button onClick={onUpdateClick}>Actualiser</Button>
                </Alert>
            )}
        </div>
    );
};

export default JourneyMeteo;
