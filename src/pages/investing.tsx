// NOW: create user settings & login|register page
// NOW: refactor code from components.jsx into investing.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { MenuRibbon } from "./areas";
import store, { GlobalState } from "@/store";
import { ChannelHeader, Table, DisabledTextbox, InfoHoverIcon } from "./elements";
import * as Data from "../data";
import { Channel } from "../data";
import { attachHoverMessageEventListeners, $ } from "./utility";

export default function InvestingPage({}): JSX.Element {
    const dispatchGlobalState = useDispatch();
    const current_channel_selector = useSelector((state: GlobalState): number => state.current_channel_index);
    
    const [current_channel_index, selectChannelIndex] = useState<number>(current_channel_selector);
    const [current_channel, selectChannel] = useState<Channel>(Data.channels[current_channel_selector]);

    useEffect(() => {
        dispatchGlobalState({
            type: "SET_CHANNEL",
            payload: current_channel_index
        });
        selectChannel(Data.channels[current_channel_selector]);
    }, [current_channel_index])

    useEffect(() => {
        attachHoverMessageEventListeners("info-hover");
        const hover_message_timeseries: Array<HTMLElement|Element> = [
            ...document.getElementsByClassName("info-hover")
        ];
        for (let element_ of hover_message_timeseries) {
            let message_width: number = element_.getBoundingClientRect()["width"];
            let icon_width: number = $(
                `info-hover-anchor-${element_.id.substring(element_.id.lastIndexOf('-') + 1)}`
            ).getBoundingClientRect()["width"];
            (element_ as HTMLElement).style.left = `${-1 * (message_width / 2 - icon_width / 2)}px`;
        }
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
                        {/* NOW: insert Table elements wrapped into functions (they have hardcoded stuff anyways mostly) */}
                        <div>data<br/>current_channel:{`${current_channel_selector}`}</div>
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
                        <InfoHoverIcon info_id_={1} info_text_="custom text"/>
                    </div>
                    <div id="investing-actions">actions</div>
                </div>
                <div id="chart-area">
                    chart
                    <button id="arrow-button" className="glowing-button" onClick={
                        () => selectChannelIndex((current_index_: number): number => current_index_ - 1)
                    }>
                        <i className="fas fa-solid fa-arrow-left"></i>
                    </button>
                    <button id="arrow-button" className="glowing-button" onClick={
                        () => selectChannelIndex((current_index_: number): number => current_index_ + 1)
                    }>
                        <i className="fas fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}