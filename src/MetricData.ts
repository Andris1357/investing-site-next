import { Defaults } from "./interfaces";
import IncrementChanges from "./IncrementChanges";
import { mean, generateRandomTimeseries, randomArray } from "./pages/utility";

export default class MetricData extends Defaults {
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
        this.average_timeseries = this.calculateAveragesTimeseries();
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

    calculateAveragesTimeseries(): number[] {
        return Array.from(
            {length: MetricData.timeseries_max_length},
            (_, timestep_index_: number): number => mean(this.getAllChannelTimestepValues(timestep_index_))
        )
    }
}