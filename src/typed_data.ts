import { shiftedRandom, mean, generateRandomTimeseries, formatPercentageValue } from "./pages/utility";

export type TimeFrame = "2 years" | "1 year" | "1 month" | "1 week" | "1 day";
export type TimeFrameInDays = "17520" | "8760" | "720" | "168" | "24";
type ValueTimeFrameMap = {
    [key in TimeFrameInDays]: TimeFrame;
};

abstract class Defaults {
    static readonly timeseries_max_length: number = 17520
    static readonly number_of_channels: number = 2
}

class InvestmentAttribute {
    public label: string
    
    constructor (
        label_acronym_: "T" | "I" | "C", 
        public value: number | string
    ) {
        switch(label_acronym_) {
            case "T":
                this.label = "Time until lock expires";
                break;
            case "I":
                this.label = "Invested tokens";
                break;
            case "C":
                this.label = "Current value";
                break;
            default:
                throw new Error("Invalid label acronym. Choose from ['T', 'I', 'C']")
        }
    }
}

class Investment {
    constructor (
        public investment_id: string, 
        public time_until_lock_expires: InvestmentAttribute, 
        public invested_tokens: InvestmentAttribute, 
        public current_value: InvestmentAttribute
    ) {}
}

export class Metric {
    constructor (
        public label: string, 
        public individual_value: number | string, 
        public universe_average: number | string, 
        public individual_modifier: string
    ) {}
}

class ChannelsInput {
    constructor(
        public subscriber_counts: MetricData,
        public view_counts: MetricData,
        public upload_counts: MetricData,
        public staking_counts: number[],
        public staking_counts_average: number,
    ) {}
}

export class Channel extends Defaults { // TD: refactor with types
    private static readonly channel_image_urls: string[] = [
        "https://tse1.mm.bing.net/th?id=OIP.7c-hqo11ia_yd5fcGU7hGgHaF7&pid=Api&rs=1&c=1&qlt=95&w=130&h=104",
        "https://tse1.mm.bing.net/th?id=OIP.qJ24xXHXJKEtx9h-4_rZwAHaF7&pid=Api&rs=1&c=1&qlt=95&w=136&h=108",
    ]
    private static readonly channel_urls: string[] = ["#", "#"]

    constructor (
        public name: string,
        public score: number, 
        public subscriber_count: Metric, 
        public currently_staking: Metric, 
        public view_count: Metric,
        public upload_count: Metric,
        public subscriber_count_change: Metric, 
        public views_count_change: Metric,
        public uploads_count_change: Metric,
        public platform_score_change: Metric,
        public score_timeseries: number[],
        public user_investments: Investment[],
        public image_source: string,
        public link: string,
    ) {
        super();
    }

    static createChannels(args_: ChannelsInput): Channel[] {
        return Array.from(
            {length: Channel.number_of_channels},
            (_: undefined, index_: number): Channel => new Channel(
                `Channel ${index_ + 1}`,
                shiftedRandom(3, 0.2, 5),
                new Metric(
                    "Subscriber count", 
                    args_.subscriber_counts.current_values[index_].toFixed(0), 
                    args_.subscriber_counts.current_average.toFixed(2), 
                    "+2.85%"
                ),
                new Metric(
                    "View count", 
                    args_.view_counts.current_values[index_].toFixed(0), 
                    args_.view_counts.current_average.toFixed(2), 
                    "+12.17%"
                ),
                new Metric(
                    "Upload count",
                    args_.upload_counts.current_values[index_].toFixed(0),
                    args_.upload_counts.current_average.toFixed(2),
                    "+3.04%"
                ),
                new Metric(
                    "Currently staking", 
                    args_.staking_counts[index_], 
                    args_.staking_counts_average, 
                    "+0.59%"
                ),
                new Metric(
                    "Change in subscriber count", 
                    formatPercentageValue(args_.subscriber_counts.current_increments[index_]), 
                    formatPercentageValue(args_.subscriber_counts.average_increment_changes.year),
                    "+46.4%"
                ),
                new Metric(
                    "Change in count of total views", 
                    formatPercentageValue(args_.view_counts.current_increments[index_]),
                    formatPercentageValue(args_.view_counts.average_increment_changes.year),
                    "+4.27%"
                ),
                new Metric(
                    "Change in count of uploads", 
                    formatPercentageValue(args_.upload_counts.current_increments[index_]), 
                    formatPercentageValue(args_.upload_counts.average_increment_changes.year), 
                    "+14.95%"
                ),
                new Metric("Change of platform score", "+22.7%", "-0.67%", "-13.64%"),
                generateRandomTimeseries(MetricData.timeseries_max_length, Math.random() * 5, 0, 10),
                investments[index_],
                Channel.channel_image_urls[index_],
                Channel.channel_urls[index_],
            )
        )
    }
}

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
    ) {
        super();
        const counts_initial: number[] = randomArray(initial_range_, initial_offset_, digits_);
        
        this.timeseries = MetricData.timeseriesWithInitialValue(
            counts_initial,
            increment_mean_,
            increment_deviation_
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
        deviation_: number
    ): number[][] {
        return Array.from(
            {length: MetricData.number_of_channels},
            (_: undefined, index_: number): number[] => generateRandomTimeseries(
                MetricData.timeseries_max_length, 
                initial_values_[index_], 
                mean_, 
                deviation_
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

function randomArray(
    range_: number, 
    offset_: number, 
    digits_: number
): number[] {
    return Array.from(
        {length: Channel.number_of_channels},
        (): number => shiftedRandom(range_, offset_, digits_)
    );
}

export const value_timeframe_map: ValueTimeFrameMap = {
    "17520": "2 years",
    "8760": "1 year",
    "720": "1 month",
    "168": "1 week",
    "24": "1 day",
};

const investments: Investment[][] = [
    [
        new Investment(
            "0x4b68d3f5e32e051cd9b9d3b3a3c6e7e6f1a1b2c2d3e3f4b5c5d6e7f8",
            new InvestmentAttribute("T", "6d 7h 19m"), // TD: refactor these to accept 1 char that gets converted to a label with ßswitch & throws err on deft
            new InvestmentAttribute("I", 335927),
            new InvestmentAttribute("C", 482934)
        ),
        new Investment (
            "0x9a8b7c6d5e4f3g2h1i9a8b7c6d5e4f3g2h1i9a8b7c6d5e4f3g2h1i9",
            new InvestmentAttribute("T", "2mo 16d 23h 08m"),
            new InvestmentAttribute("I", 20734),
            new InvestmentAttribute("C", 17836)
        ),
    ],
    [
        new Investment(
            "0x2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9",
            new InvestmentAttribute("T", "1y 0m 19d 15h 4m"),
            new InvestmentAttribute("I", 16839),
            new InvestmentAttribute("C", 276160)
        ),
        new Investment (
            "0x0f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e6d7",
            new InvestmentAttribute("T", "12h 38m"),
            new InvestmentAttribute("I", 27833),
            new InvestmentAttribute("C", 7512)
        ),
        new Investment (
            "0x5f4e3d2c1b0a5f4e3d2c1b0a5f4e3d2c1b0a5f4e3d2c1b0a5f4e3d2c1",
            new InvestmentAttribute("T", "2y 6m 20d 2h 27m"),
            new InvestmentAttribute("I", 274695),
            new InvestmentAttribute("C", 344809)
        ),
    ],
]
// TD: validate if increments & averages are correct for different timeframes
export const subscriber_counts: MetricData = new MetricData(150000, 5000, 0, 200, 300);
export const view_counts: MetricData = new MetricData(300000, 100000, 0, 500, 500);
export const upload_counts: MetricData = new MetricData(50, 0, 0, 1, 2);

// NOW: premature mechanism for calculating modifiers & score -> fill -> create timeseries of platform score <= attrs
export const currently_staking_counts: number[] = randomArray(50000, 0, 0);
export const currently_staking_count_average: number = mean(currently_staking_counts);

export const channels: Channel[] = Channel.createChannels(new ChannelsInput(
    subscriber_counts,
    view_counts,
    upload_counts,
    currently_staking_counts,
    currently_staking_count_average,
));