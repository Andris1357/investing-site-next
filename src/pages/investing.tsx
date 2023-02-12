// NOW: create user settings & login|register page
// NOW: refactor code from components.jsx into investing.tsx
import { MenuRibbon } from "./areas";
import { useDispatch, useSelector } from "react-redux";
import store, { GlobalState } from "@/store";
import { useEffect, useState } from "react";
import { ChannelHeader } from "./elements";

export default function InvestingPage({}): JSX.Element {
    const dispatchGlobalState = useDispatch();
    const current_channel_selector = useSelector((state: GlobalState): number => state.current_channel_index);
    
    const [current_channel_index, selectChannel] = useState<number>(current_channel_selector);

    useEffect(() => {
        dispatchGlobalState({
            type: "SET_CHANNEL",
            payload: current_channel_index
        });
    }, [current_channel_index])
    
    return (
        <div id="investing-parent" className="absolute-parent">
            <div><MenuRibbon current_menu_id_="investing-menu-icon"/></div>
            <div id="investing-areas" className="main-area">
                <div id="data-area">
                    <div id="channel-data">
                        <ChannelHeader channel_index_={current_channel_index}/>
                        <div>data<br/>current_channel:{`${current_channel_selector}`}</div>
                    </div>
                    <div id="investing-actions">actions</div>
                </div>
                <div id="chart-area">
                    chart
                    <button id="arrow-button" className="glowing-button" onClick={
                        () => selectChannel((current_index_: number): number => current_index_ - 1)
                    }>
                        <i className="fas fa-solid fa-arrow-left"></i>
                    </button>
                    <button id="arrow-button" className="glowing-button" onClick={
                        () => selectChannel((current_index_: number): number => current_index_ + 1)
                    }>
                        <i className="fas fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}