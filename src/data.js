import { 
    subscriber_counts_current, 
    subscriber_counts_current_average, 
    timeseries_max_length, 
    subscriber_counts_current_increments,
    currently_staking_counts,
    currently_staking_count_average,
    subscriber_counts_average_increment_changes,
    view_counts_current_increments,
    view_counts_average_increment_changes,
    
} from "./typed_data";
import { generateRandomTimeseries, formatPercentageValue } from "./pages/utility";

class InvestmentAttribute {
    constructor (label_, value_) {
        this.label = label_;
        this.value = value_;
    }
}

class Investment {
    constructor (investment_id_, time_until_lock_expires_, invested_tokens_, current_value_) {
        this.investment_id = investment_id_;
        this.time_until_lock_expires = time_until_lock_expires_;
        this.invested_tokens = invested_tokens_;
        this.current_value = current_value_;
    }
}

export class Metric {
    constructor (label_, individual_value_, universe_average_, individual_modifier_) {
        this.label = label_;
        this.individual_value = individual_value_;
        this.universe_average = universe_average_;
        this.individual_modifier = individual_modifier_;
    }
}

export class Channel { // TD: refactor with types
    constructor (
        name_,
        score_, 
        subscriber_count_, 
        currently_staking_, 
        subscriber_count_change_, 
        views_count_change_,
        uploads_count_change_,
        platform_score_change_,
        score_timeseries_,
        user_investments_,
        image_source_,
        link_,
    ) {
        this.name = name_;
        this.score = score_;
        this.subscriber_count = subscriber_count_;
        this.currently_staking = currently_staking_;
        this.subscriber_count_change = subscriber_count_change_;
        this.views_count_change = views_count_change_;
        this.uploads_count_change = uploads_count_change_;
        this.platform_score_change = platform_score_change_;
        this.score_timeseries = score_timeseries_;
        this.user_investments = user_investments_;
        this.image_source = image_source_;
        this.link = link_;
    }
}
// /\: GENERATE MORE DATA FOR {INVESTMENTS ON CRT CHANNELS, TOTAL INVESTMENT VALUES} #> should not the total value be shown for all channels?
export const index_update_frequency = 2; // I: every x hours (<1 if more over 1 hour), in future get this value dynamically, based on the current freq
export const last_updated = "2021.09.30"; // LT: query fr DB
export const current_timeframe = "1 year"; // TD: ßuseState => have this change b.o. what btn was clicked last

export const investments = [ // LT: sh come from DB
    new Investment(
        "0x4b68d3f5e32e051cd9b9d3b3a3c6e7e6f1a1b2c2d3e3f4b5c5d6e7f8",
        new InvestmentAttribute("Time until lock expires", "6d 7h 19m"),
        new InvestmentAttribute("Invested tokens", 335927),
        new InvestmentAttribute("Current value", 482934)
    ),
    new Investment (
        "0x9a8b7c6d5e4f3g2h1i9a8b7c6d5e4f3g2h1i9a8b7c6d5e4f3g2h1i9",
        new InvestmentAttribute("Time until lock expires", "2mo 16d 23h 08m"),
        new InvestmentAttribute("Invested tokens", 20734),
        new InvestmentAttribute("Current value", 17836)
    ),
];

export const channels = [
    new Channel(
        "Channel 1", // TD: refactor this with ßArray.from() where channel name & $sub_cnt take index_ as arg
        1.4804627, // TD: fix subscriber count being rendered as ~[0] on both channels before switching
        new Metric(
            "Subscriber count", 
            subscriber_counts_current[0].toFixed(0), 
            subscriber_counts_current_average.toFixed(0), 
            "-13.47%"
        ),
        new Metric(
            "Currently staking", 
            currently_staking_counts[0], 
            currently_staking_count_average, 
            "-10.58%"
        ),
        new Metric(
            "Change in subscriber count", 
            formatPercentageValue(subscriber_counts_current_increments[0]), 
            formatPercentageValue(subscriber_counts_average_increment_changes.year),
            "+1.5%"
        ),
        new Metric(
            "Change in count of total views", 
            formatPercentageValue(view_counts_current_increments[0]),
            formatPercentageValue(view_counts_average_increment_changes.year),
            "+4.27%"
        ),
        new Metric("Change in count of uploads", 8, 3.71, "+11.38%"),
        new Metric("Change of platform score", "+8.46%", "-0.67%", "-2.38%"),
        generateRandomTimeseries(timeseries_max_length, Math.random() * 5, 0, 10),
        [
            new Investment(
                "0x4b68d3f5e32e051cd9b9d3b3a3c6e7e6f1a1b2c2d3e3f4b5c5d6e7f8",
                new InvestmentAttribute("Time until lock expires", "6d 7h 19m"), // TD: refactor these to accept 1 char that gets converted to a label with ßswitch & throws err on deft
                new InvestmentAttribute("Invested tokens", 335927),
                new InvestmentAttribute("Current value", 482934)
            ),
            new Investment (
                "0x9a8b7c6d5e4f3g2h1i9a8b7c6d5e4f3g2h1i9a8b7c6d5e4f3g2h1i9",
                new InvestmentAttribute("Time until lock expires", "2mo 16d 23h 08m"),
                new InvestmentAttribute("Invested tokens", 20734),
                new InvestmentAttribute("Current value", 17836)
            ),
        ],
        "https://tse1.mm.bing.net/th?id=OIP.7c-hqo11ia_yd5fcGU7hGgHaF7&pid=Api&rs=1&c=1&qlt=95&w=130&h=104",
        "#",
    ), // TD: merge these into an ßArray.from() once every attribute has been dynamized
    new Channel(
        "Channel 2",
        1.8936851,
        new Metric(
            "Subscriber count", 
            subscriber_counts_current[1].toFixed(0), 
            subscriber_counts_current_average.toFixed(0), 
            "+2.85%"
        ),
        new Metric(
            "Currently staking", 
            currently_staking_counts[1], 
            currently_staking_count_average, 
            "+0.59%"
        ),
        new Metric(
            "Change in subscriber count", 
            formatPercentageValue(subscriber_counts_current_increments[1]), 
            formatPercentageValue(subscriber_counts_average_increment_changes.year), 
            "+46.4%"
        ),
        new Metric(
            "Change in count of total views", 
            formatPercentageValue(view_counts_current_increments[1]), 
            formatPercentageValue(view_counts_average_increment_changes.year),
            "+4.27%"
        ),
        new Metric("Change in count of uploads", 17, 3.71, "+14.95%"),
        new Metric("Change of platform score", "+22.7%", "-0.67%", "-13.64%"),
        generateRandomTimeseries(timeseries_max_length, Math.random() * 5, 0, 10),
        [
            new Investment(
                "0x2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9",
                new InvestmentAttribute("Time until lock expires", "1y 0m 19d 15h 4m"),
                new InvestmentAttribute("Invested tokens", 16839),
                new InvestmentAttribute("Current value", 276160)
            ),
            new Investment (
                "0x0f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e6d7",
                new InvestmentAttribute("Time until lock expires", "12h 38m"),
                new InvestmentAttribute("Invested tokens", 27833),
                new InvestmentAttribute("Current value", 7512)
            ),
            new Investment (
                "0x5f4e3d2c1b0a5f4e3d2c1b0a5f4e3d2c1b0a5f4e3d2c1b0a5f4e3d2c1",
                new InvestmentAttribute("Time until lock expires", "2y 6m 20d 2h 27m"),
                new InvestmentAttribute("Invested tokens", 274695),
                new InvestmentAttribute("Current value", 344809)
            ),
        ],
        "https://tse1.mm.bing.net/th?id=OIP.qJ24xXHXJKEtx9h-4_rZwAHaF7&pid=Api&rs=1&c=1&qlt=95&w=136&h=108",
        "#",
    ),
];

export const green_borders = "rgb(200,255,180) rgb(127,255,0) rgb(80,160,40) rgb(20,130,30)";
export const red_borders = "rgb(255, 180, 180) rgb(245, 130, 70) rgb(180, 20, 20) rgb(210, 40, 35)";
export const yellow_borders = "rgb(210, 230, 0) rgb(210, 255, 0) rgb(110, 130, 30) rgb(157, 147, 30)";

export const metric_category_style = { // !: <span>.padding does not transfer to parent::<td>.padding
    minHeight: "50px", // /\: padding does not work -> try sth else | remove sub-titles
    maxHeight: "50px",
    fontSize: "16px", 
    textDecoration: "underline",
    fontWeight: "bold",
}; // TD: these may be duplications - try w scss
export const hover_message_style = {
    position: "absolute", 
    bottom: "125%", 
    left: "-20px"
};
export const space_style = {
    display: "inline-block", 
    width: "10px"
};
export const chart_button_selected_style = {
    color: "rgb(255, 60, 0)", 
    borderColor: red_borders,
};
export const menu_icon_style = {
    color: "chartreuse",
    fontSize: "24px",
    padding: "0 0 7px 15px",
};

const first_date = Date.now() - 3.1536 * 10 ** 10; //later subst w first recorded date
const labels_full = Array.from(
    {length: timeseries_max_length}, 
    (_, index) => {
        let date_i = new Date(first_date + index * index_update_frequency * 3.6 * 10 ** 6);
        return "" + date_i.getFullYear() + "-" + (date_i.getMonth() + 1) + "-" + date_i.getDate() + ". " + date_i.getHours() + ":00"; // LT: later switch to datetime of db row
    }
); // I: only shows 7-10 labels in total -> label is null if index %% arr.slice.length/10 != 0
export const labels_1_3 = Array.from(
    labels_full, 
    x => x.substring(0, x.indexOf(" "))
);
export const labels_2_3 = Array.from(
    labels_full, 
    x => x.substring(5, x.indexOf(" "))
);
export const labels_3_5 = Array.from(
    labels_full, 
    x => x.substring(x.substring(0, x.indexOf(" ")).lastIndexOf("-") + 1, x.length)
);
export const labels_4_5 = Array.from(
    labels_full, 
    x => x.substring(x.indexOf(" ") + 1, x.length)
);
export const labels_current = labels_1_3;
