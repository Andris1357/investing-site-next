export abstract class Defaults {
    static readonly timeseries_max_length: number = 17520 as const
    static readonly number_of_channels: number = 2 as const
}

export interface ChannelInterface {
    name: string
    subscriber_count: MetricInterface
    currently_staking: MetricInterface
    view_count: MetricInterface
    upload_count: MetricInterface
    subscriber_count_change: MetricInterface
    views_count_change: MetricInterface
    uploads_count_change: MetricInterface
    platform_score?: MetricInterface
    platform_score_change?: MetricInterface
    user_investments: InvestmentInterface[]
    image_source: string
    link: string
}

export interface MetricInterface {
    individual_modifier: string
    modifier_timeseries?: string[]
    label: string, 
    individual_value: string | number, // P: can be integer, or percentage change
    universe_average: string | number, // P: can be float, or percentage change
    timeseries: number[],
    average_timeseries: number[] | null,
}

export interface InvestmentInterface {
    investment_id: string, 
    time_until_lock_expires: InvestmentAttributeInterface, 
    invested_tokens: InvestmentAttributeInterface, 
    current_value: InvestmentAttributeInterface
}

export interface InvestmentAttributeInterface {
    label: string
    value: number | string
}

export interface MetricAverageTimeseries {
    subscriber: number []
    view: number []
    upload: number []
    score: number []
}