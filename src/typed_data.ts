import { shiftedRandom, sum, mean, generateRandomTimeseries } from "./pages/utility";

export type TimeFrame = "2 years" | "1 year" | "1 month" | "1 week" | "1 day";
export type TimeFrameInDays = "17520" | "8760" | "720" | "168" | "24";
type ValueTimeFrameMap = {
    [key in TimeFrameInDays]: TimeFrame;
};

class IncrementChanges {
    public day: number  //P: reflect percentages, e.g. 0.75 = 75%
    public week: number
    public month: number
    public year: number
    public all: number
    
    constructor (
        current_value_: number,
        day_value_: number, // P: what was the value of this attribute this much time ago?
        week_value_: number,
        month_value_: number,
        year_value_: number,
        all_value_: number,
    ) {
        this.day = 1 - current_value_ / day_value_;
        this.week = 1 - current_value_ / week_value_;
        this.month = 1 - current_value_ / month_value_;
        this.year = 1 - current_value_ / year_value_;
        this.all = 1 - current_value_ / all_value_;
    }

    static calculateIncrementChangesForAllChannels(timeseries_: number[][]): IncrementChanges[] {
        return Array.from(
            {length: number_of_channels},
            (_, index_: number): IncrementChanges => new IncrementChanges(
                timeseries_[index_][timeseries_max_length - 1],
                timeseries_[index_][timeseries_max_length - 1 - 24],
                timeseries_[index_][timeseries_max_length - 1 - 168],
                timeseries_[index_][timeseries_max_length - 1 - 720],
                timeseries_[index_][timeseries_max_length - 1 - 8760],
                timeseries_[index_][0],
            )
        )
    }

    static calculateIncrementChanges(timeseries_: number[]): IncrementChanges {
        return new IncrementChanges(
            timeseries_[timeseries_max_length - 1],
            timeseries_[timeseries_max_length - 1 - 24],
            timeseries_[timeseries_max_length - 1 - 168],
            timeseries_[timeseries_max_length - 1 - 720],
            timeseries_[timeseries_max_length - 1 - 8760],
            timeseries_[0],
        )
    }
}

export const timeseries_max_length: number = 17520;
const number_of_channels: number = 2;
  
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

function getAllChannelTimestepValues<T>(
    timeseries_: T[][],
    timestep_index_: number
): T[] {
    return Array.from(
        {length: number_of_channels},
        (_, channel_index_: number): T => timeseries_[channel_index_][timestep_index_]
    )
}

function timeseriesWithInitialValue(
    initial_values_: number[],
    mean_: number,
    deviation_: number
): number[][] {
    return Array.from(
        {length: number_of_channels},
        (_: undefined, index_: number): number[] => generateRandomTimeseries(
            timeseries_max_length, 
            initial_values_[index_], 
            mean_, 
            deviation_
        )
    );
}

function calculateAveragesOfTimeseries(timeseries_: number[][]): number[] {
    return Array.from(
        {length: timeseries_max_length},
        (_, timestep_index_: number): number => mean(getAllChannelTimestepValues(
            timeseries_,
            timestep_index_
        ))
    )
}

export const value_timeframe_map: ValueTimeFrameMap = {
    "17520": "2 years",
    "8760": "1 year",
    "720": "1 month",
    "168": "1 week",
    "24": "1 day",
};

const subscriber_counts_initial: number[] = randomArray(150000, 5000, 0);
export const subscriber_counts_timeseries: number[][] = timeseriesWithInitialValue(
    subscriber_counts_initial,
    200,
    300
);
export const subscriber_counts_current: number[] = getAllChannelTimestepValues(
    subscriber_counts_timeseries,
    subscriber_counts_timeseries.length - 1
);

const subscriber_counts_average_timeseries: number[] = calculateAveragesOfTimeseries(subscriber_counts_timeseries);
export const subscriber_counts_current_average: number = mean(subscriber_counts_current)
export const subscriber_counts_increment_changes: IncrementChanges[] = IncrementChanges.calculateIncrementChangesForAllChannels(
    subscriber_counts_timeseries
);
export const subscriber_counts_average_increment_changes: IncrementChanges = IncrementChanges.calculateIncrementChanges(
    subscriber_counts_average_timeseries
);
export const subscriber_counts_current_increments: number[] = subscriber_counts_increment_changes.map(
    (element_: IncrementChanges) => element_.year
);

// NOW: premature mechanism for calculating modifiers
export const currently_staking_counts: number[] = randomArray(50000, 0, 0);
export const currently_staking_count_average: number = mean(currently_staking_counts);
// TD: add new attributes for static view cnt
const view_counts_initial: number[] = randomArray(300000, 10000, 0);
export const view_counts_timeseries: number[][] = timeseriesWithInitialValue(
    view_counts_initial,
    500,
    500
); // NOW: calculate universe average
const view_counts_average_timeseries: number[] = calculateAveragesOfTimeseries(view_counts_timeseries);
export const view_counts_increment_changes: IncrementChanges[] = IncrementChanges.calculateIncrementChangesForAllChannels(
    view_counts_timeseries
);
export const view_counts_average_increment_changes: IncrementChanges = IncrementChanges.calculateIncrementChanges(
    view_counts_average_timeseries
);
export const view_counts_current_increments: number[] = view_counts_increment_changes.map(
    (element_: IncrementChanges) => element_.year
);