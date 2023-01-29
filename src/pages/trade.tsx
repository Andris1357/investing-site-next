import TradeArea from "@/pages/trade_button_area";
import RedeemDonationsArea from "./redeem_donations_area";
import WithdrawArea from "./withdraw_area";
import {TradeAreaArgs} from "@/pages/trade_button_area";

let available_eth: number = 1.485204;
let available_tokens: number = 43729;
let available_donations: number = 73921;

const trade_area_args: TradeAreaArgs[] = [
    {
        button_id: "buy-tokens",
        button_text: "Buy tokens for ETH" ,
        info_text: `Available ETH: ${available_eth}`
    },
    {
        button_id: "buy-eth",
        button_text: "Buy ETH for tokens" ,
        info_text: `Available tokens: ${available_tokens}`
    }
]

export default function TradingPage(): JSX.Element {
    return (
        <div id="absolute-parent">
            <div id="trade-area">
                {trade_area_args.map(object_ => {
                    return <TradeArea 
                        button_id={object_.button_id}
                        button_text={object_.button_text} 
                        info_text={object_.info_text}
                    />
                })}
            </div>
            <RedeemDonationsArea available_donations={available_donations}/>
            <WithdrawArea available_tokens={available_tokens}/>
        </div>
    )
}

// TD: buy & sell buttons && withdraw tokens && redeem channel donations -> flexbox vertical 3
// TD: user sh have ETH & token balance that change upon trading (& investing when I implement the second page)