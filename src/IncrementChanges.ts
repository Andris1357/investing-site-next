import { Defaults } from "./interfaces"

export default class IncrementChanges {
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
        this.day = current_value_ / day_value_ - 1;
        this.week = current_value_ / week_value_ - 1;
        this.month = current_value_ / month_value_ - 1;
        this.year = current_value_ / year_value_ - 1;
        this.all = current_value_ / all_value_ - 1;
    }

    static calculateIncrementChangesForAllChannels(timeseries_: number[][]): IncrementChanges[] {
        return Array.from(
            {length: Defaults.number_of_channels},
            (_, index_: number): IncrementChanges => new IncrementChanges(
                timeseries_[index_][Defaults.timeseries_max_length - 1],
                timeseries_[index_][Defaults.timeseries_max_length - 1 - 24],
                timeseries_[index_][Defaults.timeseries_max_length - 1 - 168],
                timeseries_[index_][Defaults.timeseries_max_length - 1 - 720],
                timeseries_[index_][Defaults.timeseries_max_length - 1 - 8760],
                timeseries_[index_][0],
            )
        )
    }

    static calculateIncrementChanges(timeseries_: number[]): IncrementChanges {
        return new IncrementChanges(
            timeseries_[Defaults.timeseries_max_length - 1],
            timeseries_[Defaults.timeseries_max_length - 1 - 24],
            timeseries_[Defaults.timeseries_max_length - 1 - 168],
            timeseries_[Defaults.timeseries_max_length - 1 - 720],
            timeseries_[Defaults.timeseries_max_length - 1 - 8760],
            timeseries_[0],
        )
    }

    static getCurrentIncrements(increments_: IncrementChanges[]): number[] {
        return increments_.map(
            (element_: IncrementChanges): number => element_.year
        )
    }

    static calculateSingleIncrementChange(current_value_: number, previous_value_: number): number {
        return current_value_ / previous_value_ - 1
    }

    static calculateIncrementTimeseries(timeseries_: number[]): number[] {
        return [0, ...Array.from(
            {length: timeseries_.length - 1},
            (__: undefined, index_: number): number => {
                return IncrementChanges.calculateSingleIncrementChange(
                    timeseries_[index_ + 1],
                    timeseries_[index_]
                )
            }
        )]
    }
}