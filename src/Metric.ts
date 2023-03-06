import { ChannelInterface, MetricAverageTimeseries, MetricInterface, Defaults } from "./interfaces";
import { mean, formatPercentageValue } from "./pages/utility";

export default class Metric implements MetricInterface {
    public individual_modifier: string
    public modifier_timeseries?: string[]
    
    constructor (
        public label: string, 
        public individual_value: string, // P: can be integer, or percentage change
        public universe_average: string, // P: can be float, or percentage change
        public timeseries: number[],
        public average_timeseries: number[] | null = null, // TD: change this to have empty arr as deft val -> remove {`!`}
    ) {
        this.individual_modifier = this.calculateModifier(); // TD: refactor to $current_modif
        
        if (average_timeseries !== null) {
            this.calculateModifierTimeseries();
        }
    }

    static calculateAveragesTimeseries(metrics_: MetricInterface[]): number[] {
        return Array.from(
            {length: Defaults.timeseries_max_length},
            (_: undefined, index_: number) => mean(
                Metric.getAllChannelTimestepValues(metrics_, index_)
            )
        )
    }

    calculateModifier(): string { // TD: should have a reverse instead of compounding effect in terms of platform_score_change, platform_score
        return formatPercentageValue(Math.pow(
            Metric.reFormatIfPercentageValue(this.individual_value) 
            / Metric.reFormatIfPercentageValue(this.universe_average), 
            0.4
        ) - 1);
    }

    calculateModifierTimeseries(): void {
        if (this.average_timeseries === null) {
            throw new Error ("Timeseries of modifier values did not receive a value") 
        }
        
        this.modifier_timeseries = Array.from(
            {length: Defaults.timeseries_max_length},
            (_: undefined, index_: number): string => Metric.calculateModifier(
                this.timeseries[index_],
                this.average_timeseries![index_],
            )
        )
    }

    static setIncrementAverageTimeseries(channels_: ChannelInterface[]): void {
        let metric_average_timeseries: MetricAverageTimeseries = {
            subscriber: [], 
            view: [], 
            upload: [],
            score: []
        }

        for (let timestep_ = 0; timestep_ < Defaults.timeseries_max_length; timestep_++) {
            metric_average_timeseries.subscriber.push(mean(
                Metric.getAllChannelTimestepValues(
                    Array.from(
                        channels_, 
                        (element_: ChannelInterface): MetricInterface => element_.subscriber_count_change
                    ),
                    timestep_
                )
            ));
            metric_average_timeseries.view.push(mean(
                Metric.getAllChannelTimestepValues(
                    Array.from(
                        channels_, 
                        (element_: ChannelInterface): MetricInterface => element_.views_count_change
                    ),
                    timestep_
                )
            ));
            metric_average_timeseries.upload.push(mean(
                Metric.getAllChannelTimestepValues(
                    Array.from(
                        channels_, 
                        (element_: ChannelInterface): MetricInterface => element_.uploads_count_change
                    ),
                    timestep_
                )
            ));
        }

        for (let channel_ of channels_) {
            channel_.subscriber_count_change.average_timeseries = metric_average_timeseries.subscriber;
            channel_.views_count_change.average_timeseries = metric_average_timeseries.view;
            channel_.uploads_count_change.average_timeseries = metric_average_timeseries.upload;
        }
    }
    // TD: write extendable interfaces for shared functions
    static getAllChannelTimestepValues(metrics_: MetricInterface[], timestep_index_: number): number[] {
        return Array.from(
            {length: metrics_.length},
            (_: undefined, channel_index_: number): number => metrics_[channel_index_].timeseries[timestep_index_]
        )
    }

    static calculateModifier(
        individual_value_: string | number, 
        universe_average_: string | number
    ): string {
        return formatPercentageValue(Math.pow(
            Metric.reFormatIfPercentageValue(individual_value_) 
            / Metric.reFormatIfPercentageValue(universe_average_), 
            0.4
        ) - 1)
    }
    
    static calculateReverseModifier(
        individual_value_: string | number, 
        universe_average_: string | number
    ): string {
        return formatPercentageValue(-1 * Math.pow(
            Metric.reFormatIfPercentageValue(individual_value_) / Metric.reFormatIfPercentageValue(universe_average_),
            0.3
        ) - 1)
    }

    static reFormatIfPercentageValue(value_: string | number): number {
        let number_: number;
        if (String(value_).includes('%')) {
            number_ = Number(String(value_).replace('%', '')) + 1
        } else {
            number_ = Number(value_)
        }
        return number_
    }
}