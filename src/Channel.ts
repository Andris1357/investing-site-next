import { Defaults, ChannelInterface } from "./interfaces";
import MetricData from "./MetricData";
import Metric from "./Metric";
import { Investment, investments} from "./typed_data";
import IncrementChanges from "./IncrementChanges";
import { mean, formatPercentageValue } from "./pages/utility";

class ChannelsInput {
    constructor(
        public subscriber_counts: MetricData,
        public view_counts: MetricData,
        public upload_counts: MetricData,
        public staking_counts: MetricData,
    ) {}
}

export default class Channel extends Defaults implements ChannelInterface {
    private static readonly channel_urls: string[] = ["#", "#"]
    private static readonly channel_image_urls: string[] = [
        "https://tse1.mm.bing.net/th?id=OIP.7c-hqo11ia_yd5fcGU7hGgHaF7&pid=Api&rs=1&c=1&qlt=95&w=130&h=104",
        "https://tse1.mm.bing.net/th?id=OIP.qJ24xXHXJKEtx9h-4_rZwAHaF7&pid=Api&rs=1&c=1&qlt=95&w=136&h=108",
    ]

    public name: string
    public subscriber_count: Metric
    public currently_staking: Metric
    public view_count: Metric
    public upload_count: Metric
    public subscriber_count_change: Metric
    public views_count_change: Metric
    public uploads_count_change: Metric
    public platform_score?: Metric
    public platform_score_change?: Metric
    public user_investments: Investment[]
    public image_source: string
    public link: string

    constructor (args_: ChannelsInput & {index_: number}) {
        super();
        this.name = `Channel ${args_.index_ + 1}`;
        
        this.subscriber_count = new Metric(
            "Subscriber count", 
            args_.subscriber_counts.current_values[args_.index_].toFixed(0), 
            args_.subscriber_counts.current_average.toFixed(2), 
            args_.subscriber_counts.timeseries[args_.index_],
            args_.subscriber_counts.average_timeseries,
        );

        this.view_count = new Metric(
            "View count", 
            args_.view_counts.current_values[args_.index_].toFixed(0), 
            args_.view_counts.current_average.toFixed(2), 
            args_.view_counts.timeseries[args_.index_],
            args_.view_counts.average_timeseries,
        );

        this.upload_count = new Metric(
            "Upload count",
            args_.upload_counts.current_values[args_.index_].toFixed(0),
            args_.upload_counts.current_average.toFixed(2),
            args_.upload_counts.timeseries[args_.index_],
            args_.upload_counts.average_timeseries,
        );

        this.currently_staking = new Metric(
            "Currently staking", 
            args_.staking_counts.current_values[args_.index_].toFixed(0), 
            args_.staking_counts.current_average.toFixed(0), 
            args_.staking_counts.timeseries[args_.index_],
            args_.staking_counts.average_timeseries,
        );

        this.subscriber_count_change = new Metric(
            "Change in subscriber count", 
            formatPercentageValue(args_.subscriber_counts.current_increments[args_.index_]), 
            formatPercentageValue(args_.subscriber_counts.average_increment_changes.year),
            IncrementChanges.calculateIncrementTimeseries(args_.subscriber_counts.timeseries[args_.index_]),
        );

        this.views_count_change = new Metric(
            "Change in count of total views", 
            formatPercentageValue(args_.view_counts.current_increments[args_.index_]),
            formatPercentageValue(args_.view_counts.average_increment_changes.year),
            IncrementChanges.calculateIncrementTimeseries(args_.view_counts.timeseries[args_.index_]),
        );

        this.uploads_count_change = new Metric(
            "Change in count of uploads", 
            formatPercentageValue(args_.upload_counts.current_increments[args_.index_]), 
            formatPercentageValue(args_.upload_counts.average_increment_changes.year), 
            IncrementChanges.calculateIncrementTimeseries(args_.upload_counts.timeseries[args_.index_]),
        );

        this.user_investments = investments[args_.index_];
        this.image_source = Channel.channel_image_urls[args_.index_];
        this.link = Channel.channel_urls[args_.index_];
    }

    setNewTimeframeCurrents() {} // NOW: implement

    static assignChannelsScoreMetrics(channels_: Channel[]): void { // TD: refactor this to execute sub funcs
        let channels_score_timeseries: number[][] = [];
        let channels_score_average_timeseries: number[] = [];
        let channels_score_increment_timeseries: number[][] = [];
        let channels_score_average_increment_timeseries: number[] = [];
        let channels_score_modifier_timeseries: string[][] = [];
        let channels_score_increment_modifier_timeseries: string[][] = [];

        for (let timestep_ of Array.from(
            {length: Channel.timeseries_max_length - 1},
            (_: undefined, index_: number): number => index_
        )) {
            channels_.forEach((channel_: Channel, channel_index_: number) => {
                if (timestep_ === 0) {
                    channels_score_timeseries.push([1]);
                    channels_score_increment_timeseries.push([0]);
                    channels_score_average_increment_timeseries.push(0);
                    channels_score_modifier_timeseries.push([]);
                    channels_score_increment_modifier_timeseries.push(["+0%"]);
                } else {
                    channels_score_timeseries[channel_index_].push(
                        channels_score_timeseries[channel_index_][timestep_ - 1]
                    );
                }

                for (let metric_ of [
                    channel_.subscriber_count,
                    channel_.view_count,
                    channel_.upload_count,
                    channel_.subscriber_count_change,
                    channel_.views_count_change,
                    channel_.uploads_count_change,
                    channel_.currently_staking,
                ]) {
                    channels_score_timeseries[channel_index_][timestep_] *= Metric.reFormatIfPercentageValue(
                        metric_.modifier_timeseries![timestep_]
                    );
                }
            })

            channels_score_average_timeseries.push(mean(Array.from(
                {length: Defaults.number_of_channels},
                (_: undefined, channel_index_: number) => channels_score_timeseries[channel_index_][timestep_]
            )));

            for (let channel_index_ = 0; channel_index_ < Defaults.number_of_channels; channel_index_++) {
                let modifier: string = Metric.calculateReverseModifier(
                    channels_score_timeseries[channel_index_][timestep_],
                    channels_score_average_timeseries[timestep_]
                );
                channels_score_modifier_timeseries[channel_index_].push(modifier);
                channels_score_timeseries[channel_index_][timestep_] *= Metric.reFormatIfPercentageValue(modifier);
            }

            channels_score_average_timeseries.push(mean(Array.from(
                {length: Defaults.number_of_channels},
                (_: undefined, channel_index_: number) => channels_score_timeseries[channel_index_][timestep_]
            ))); // TD: test if you could create an inner func fr this not to repeat yourself; question is whether the array can act similar to an obj and let itself be changed by this func

            if (timestep_ > 0) {
                channels_score_average_increment_timeseries.push(IncrementChanges.calculateSingleIncrementChange(
                    channels_score_average_timeseries[timestep_],
                    channels_score_average_timeseries[timestep_ - 1]
                ));

                for (let channel_index_ = 0; channel_index_ < Defaults.number_of_channels; channel_index_++) {
                    channels_score_increment_timeseries[channel_index_].push(IncrementChanges.calculateSingleIncrementChange(
                        channels_score_timeseries[channel_index_][timestep_],
                        channels_score_timeseries[channel_index_][timestep_ - 1]
                    ));
                    
                    let modifier: string = Metric.calculateReverseModifier(
                        channels_score_increment_timeseries[channel_index_][timestep_],
                        channels_score_average_increment_timeseries[timestep_]
                    );
                    channels_score_increment_modifier_timeseries[channel_index_].push(modifier);
                    channels_score_timeseries[channel_index_][timestep_] *= Metric.reFormatIfPercentageValue(modifier);
                }
            }
        }

        channels_.forEach((channel_: Channel, channel_index_: number) => {
            channel_.platform_score = new Metric(
                "Platform score",
                channels_score_timeseries[channel_index_][Defaults.timeseries_max_length - 8761].toFixed(5),
                channels_score_average_timeseries[Defaults.timeseries_max_length - 8761].toFixed(5),
                channels_score_timeseries[channel_index_],
                channels_score_average_timeseries
            );
            channel_.platform_score_change = new Metric(
                "Change in platform score",
                formatPercentageValue(channels_score_increment_timeseries[channel_index_][Defaults.timeseries_max_length - 8761]),
                formatPercentageValue(channels_score_average_increment_timeseries[Defaults.timeseries_max_length - 8761]),
                channels_score_increment_timeseries[channel_index_],
                channels_score_average_increment_timeseries
            );
        })
    }

    static createChannels(args_: ChannelsInput): Channel[] {
        let channels: Channel[] = Array.from(
            {length: Channel.number_of_channels},
            (_: undefined, index_: number): Channel => new Channel({...args_, index_}) // I: ES6 syntax = I do not have to specify ß{index_: index_}
        )
        Metric.setIncrementAverageTimeseries(channels);

        for (let channel_ of channels) {
            for (let metric_ of [
                channel_.subscriber_count_change,
                channel_.views_count_change,
                channel_.uploads_count_change,
            ]) {
                metric_.calculateModifierTimeseries();
            }
        }

        Channel.assignChannelsScoreMetrics(channels);
        return channels
    }

    static getAllChannelTimestepValues(timeseries_array_: number[][], timestep_: number): number[] {
        return Array.from(
            {length: Defaults.number_of_channels},
            (_: undefined, channel_index_: number): number => timeseries_array_[channel_index_][timestep_]
        )
    }
}