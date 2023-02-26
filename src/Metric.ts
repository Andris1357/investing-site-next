import { formatPercentageValue } from "./pages/utility";
import { mean, generateRandomTimeseries, shiftedRandom } from "./pages/utility";

export abstract class Defaults {
    static readonly timeseries_max_length: number = 17520
    static readonly number_of_channels: number = 2
}

export default class Metric {
    public individual_modifier: string
    
    constructor (
        public label: string, 
        public individual_value: string | number, // P: can be integer, or percentage change
        public universe_average: string | number, // P: can be float, or percentage change
    ) {
        this.individual_modifier = this.calculateModifier();
    }

    calculateModifier(): string {
        return formatPercentageValue(Math.pow(
            Metric.reFormatIfPercentageValue(this.individual_value) 
            / Metric.reFormatIfPercentageValue(this.universe_average), 
            0.4
        ) - 1);
    }

    static reFormatIfPercentageValue(value_: string | number): number {
        let number_: number = Number(value_);
        if (String(value_).includes('%')) {
            number_ = Number(String(value_).replace('%', '')) + 1
        }
        return number_
    }
}

export class MetricData extends Defaults {
    public timeseries: number[][]
    public current_values: number[]
    public average_timeseries: number[]
    public increment_changes: IncrementChanges[]
    public average_increment_changes: IncrementChanges
    public current_increments: number[]
    public current_average: number
    
    constructor (
        initial_range_: number,
        initial_offset_: number,
        digits_: number,
        increment_mean_: number,
        increment_deviation_: number,
        only_int_increments_: boolean = false,
    ) {
        super();
        const counts_initial: number[] = randomArray(initial_range_, initial_offset_, digits_);
        
        this.timeseries = MetricData.timeseriesWithInitialValue(
            counts_initial,
            increment_mean_,
            increment_deviation_,
            only_int_increments_
        );
        this.current_values = this.getAllChannelTimestepValues(this.timeseries.length - 1);
        this.average_timeseries = this.calculateAveragesOfTimeseries();
        this.increment_changes = IncrementChanges
            .calculateIncrementChangesForAllChannels(this.timeseries);
        this.average_increment_changes = IncrementChanges
            .calculateIncrementChanges(this.average_timeseries);
        this.current_increments = IncrementChanges.getCurrentIncrements(this.increment_changes);
        this.current_average = mean(this.current_values);
    }

    static timeseriesWithInitialValue(
        initial_values_: number[],
        mean_: number,
        deviation_: number,
        only_int_increments_: boolean = false,
    ): number[][] {
        return Array.from(
            {length: MetricData.number_of_channels},
            (_: undefined, index_: number): number[] => generateRandomTimeseries(
                MetricData.timeseries_max_length, 
                initial_values_[index_], 
                mean_, 
                deviation_,
                only_int_increments_
            )
        );
    }

    getAllChannelTimestepValues(timestep_index_: number): number[] {
        return Array.from(
            {length: MetricData.number_of_channels},
            (_, channel_index_: number): number => this.timeseries[channel_index_][timestep_index_]
        )
    }

    calculateAveragesOfTimeseries(): number[] {
        return Array.from(
            {length: MetricData.timeseries_max_length},
            (_, timestep_index_: number): number => mean(this.getAllChannelTimestepValues(timestep_index_))
        )
    }
}

export class IncrementChanges {
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
            {length: MetricData.number_of_channels},
            (_, index_: number): IncrementChanges => new IncrementChanges(
                timeseries_[index_][MetricData.timeseries_max_length - 1],
                timeseries_[index_][MetricData.timeseries_max_length - 1 - 24],
                timeseries_[index_][MetricData.timeseries_max_length - 1 - 168],
                timeseries_[index_][MetricData.timeseries_max_length - 1 - 720],
                timeseries_[index_][MetricData.timeseries_max_length - 1 - 8760],
                timeseries_[index_][0],
            )
        )
    }

    static calculateIncrementChanges(timeseries_: number[]): IncrementChanges {
        return new IncrementChanges(
            timeseries_[MetricData.timeseries_max_length - 1],
            timeseries_[MetricData.timeseries_max_length - 1 - 24],
            timeseries_[MetricData.timeseries_max_length - 1 - 168],
            timeseries_[MetricData.timeseries_max_length - 1 - 720],
            timeseries_[MetricData.timeseries_max_length - 1 - 8760],
            timeseries_[0],
        )
    }

    static getCurrentIncrements(increments_: IncrementChanges[]): number[] {
        return increments_.map(
            (element_: IncrementChanges): number => element_.year
        )
    }
}

export function randomArray(
    range_: number, 
    offset_: number, 
    digits_: number,
): number[] {
    return Array.from(
        {length: Defaults.number_of_channels},
        (): number => shiftedRandom(range_, offset_, digits_)
    );
}