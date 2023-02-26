import { MetricData } from "./Metric";

export const index_update_frequency = 1; // I: every x hours (<1 if more over 1 hour), in future get this value dynamically, based on the current freq
export const last_updated = "2021.09.30"; // LT: query fr DB
export const current_timeframe = "1 year"; // TD: ßuseState => have this change b.o. what btn was clicked last

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
    {length: MetricData.timeseries_max_length}, 
    (_, index_) => {
        let date_i = new Date(first_date + index_ * index_update_frequency * 3.6 * 10 ** 6);
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
