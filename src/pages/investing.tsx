// TD: create user settings & login|register page
// NOW: refactor code from components.jsx into investing.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { MenuRibbon } from "./areas";
import { GlobalState } from "@/store";
import { ChannelHeader, Table, DisabledTextbox, CategoryWithInfo } from "./elements";
import * as Data from "../data";
import { attachHoverMessageEventListeners, positionHoverMessages } from "./utility";
import { TimeFrameInDays, value_timeframe_map, channels, Channel } from "@/typed_data";
import Metric from "@/Metric";

export default function InvestingPage({}): JSX.Element {
    const dispatchGlobalState = useDispatch();
    const current_channel_selector = useSelector((state: GlobalState): number => state.current_channel_index);
    
    const [current_channel_index, selectChannelIndex] = useState<number>(current_channel_selector);
    const [current_channel, selectChannel] = useState<Channel>(channels[current_channel_selector]);
    const [current_timeframe, selectTimeframe] = useState<TimeFrameInDays>("8760");

    useEffect(() => {
        dispatchGlobalState({
            type: "SET_CHANNEL",
            payload: current_channel_index
        });
        selectChannel(channels[current_channel_selector]);
    }, [current_channel_index])

    useEffect(() => {}, [current_channel]);

    useEffect(() => {
        attachHoverMessageEventListeners("info-hover");
        positionHoverMessages("info-hover");
    }, [])

    return (
        <div id="investing-parent" className="absolute-parent">
            <div><MenuRibbon current_menu_id_="investing-menu-icon"/></div>
            <div id="investing-areas" className="main-area">
                <div id="data-area">
                    <div id="channel-data">
                        <ChannelHeader channel_index_={current_channel_index}/>
                        <p id="statistics-title"><strong>Channel statistics</strong></p>
                        <hr />
                        <Table rows_content={[
                            [
                                React.createElement("label", {htmlFor: "stats-score"}, "Platform score"), 
                                <DisabledTextbox 
                                    element_id_={"stats-score"} 
                                    value_={current_channel.score}
                                />
                            ],
                            [
                                React.createElement("label", {htmlFor: "stats-date"}, "Last updated"), 
                                <DisabledTextbox element_id_={"stats-date"} value_={Data.last_updated}/>
                            ]
                        ]}/>
                        <hr />
                        <Table rows_content={[
                            [" ", "Individual value", "Universe average", "Individual index modifier"], 
                            [
                                React.createElement("span", {style: Data.metric_category_style}, "Static metrics"), "", "", ""
                            ],
                            ...([
                                current_channel.subscriber_count, 
                                current_channel.currently_staking,
                                current_channel.view_count,
                                current_channel.upload_count,
                            ].map((metric_: Metric): Array<number|string> => [
                                metric_.label, 
                                metric_.individual_value, 
                                metric_.universe_average, 
                                metric_.individual_modifier
                            ])),
                            [
                                <CategoryWithInfo 
                                    label_text_="Dynamic metrics" 
                                    info_id_={1}
                                    info_text_={`The period over which changes are measured is ${value_timeframe_map[current_timeframe]}`}
                                />,
                                "", "", ""
                            ],
                            ...([
                                current_channel.subscriber_count_change, 
                                current_channel.views_count_change,
                                current_channel.uploads_count_change,
                                current_channel.platform_score_change
                            ].map((metric_: Metric): Array<number|string> => [
                                metric_.label, 
                                metric_.individual_value, 
                                metric_.universe_average, 
                                metric_.individual_modifier
                            ])),
                        ]}/>
                    </div>
                    <div id="investing-actions">actions</div>
                </div>
                <div id="chart-area">
                    <button id="arrow-button" className="glowing-button" onClick={
                        () => selectChannelIndex(
                            (current_index_: number): number => current_index_ === 0
                                ? current_index_
                                : current_index_ - 1
                        )
                    }>
                        <i className="fas fa-solid fa-arrow-left"></i>
                    </button>
                    <button id="arrow-button" className="glowing-button" onClick={
                        () => selectChannelIndex(
                            (current_index_: number): number => current_index_ == Channel.number_of_channels - 1
                                ? current_index_ 
                                : current_index_ + 1
                        )
                    }>
                        <i className="fas fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}