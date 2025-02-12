import { Journey } from "@/types/Journey";

export const journeyAdapter = {
  toJSON(journey: Journey): Journey {
      return {
          ...journey,
          date: journey.date instanceof Date ? journey.date.toISOString() : journey.date
      };
  },

  fromJSON(data: Journey): Journey {
      return {
          ...data,
          date: new Date(data.date)
      };
  }
};