import { Journey } from "@/types/Journey";

export const journeyAdapter = {
    toJSON(journey: Journey) {
      return {
        ...journey,
        date: journey.date instanceof Date ? journey.date.toISOString() : journey.date
      };
    },
  
    fromJSON(data:  Partial<Journey>): Journey {
      return new Journey({
        ...data,
        date: data.date ? new Date(data.date) : new Date()      });
    }
  };