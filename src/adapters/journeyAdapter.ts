import { Journey } from "@/types/Journey";

export const journeyAdapter = {
  toJSON(journey: Journey): any {
      return {
          ...journey,
          date: journey.date instanceof Date ? journey.date.toISOString() : journey.date
      };
  },

  fromJSON(data: any): Journey | null {
    if (!data || !data.date) {
        return null
    }

    return {
        ...data,
        date: new Date(data.date)
    };
  }
};