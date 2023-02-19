import { shiftedRandom, arrayAverage } from "./pages/utility";

export type TimeFrame = "2 years" | "1 year" | "1 month" | "1 week" | "1 day";
export type TimeFrameInDays = "17520" | "8760" | "720" | "168" | "24";
type ValueTimeFrameMap = {
    [key in TimeFrameInDays]: TimeFrame;
};
  
function randomArray(
    range_: number, 
    offset_: number, 
    digits_: number
): number[] {
    return Array.from(
        {length: number_of_channels},
        (): number => shiftedRandom(range_, offset_, digits_)
    );
}

const number_of_channels: number = 2;
export const value_timeframe_map: ValueTimeFrameMap = {
    "17520": "2 years",
    "8760": "1 year",
    "720": "1 month",
    "168": "1 week",
    "24": "1 day",
};

export const subscriber_counts: number[] = randomArray(20000, 5000, 0);
export const subscriber_count_average: number = arrayAverage(subscriber_counts);
// NOW: premature mechanism for calculating modifiers
export const currently_staking_counts: number[] = randomArray(15000, 0, 0);
export const currently_staking_count_average: number = arrayAverage(currently_staking_counts);
// NOW: generate random amounts of sub_cnt, views etc for the beginning of the 2 year max period & each afterwards where there would be a new timeframe start (e.g. 1 month is 1 mo before now) -> when switching timefr, change% sh update <= calc <%< ~ values
    // #> generate full timeseries instead because it is more straightforward