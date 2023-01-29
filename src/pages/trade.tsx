import TradeArea from "@/pages/trade_button_area";
import {TradeAreaArgs} from "@/pages/trade_button_area";

let available_eth: number = 1.485204;
let available_tokens: number = 43729;

const trade_area_args: TradeAreaArgs[] = [
    {
        button_id_: "buy-tokens",
        button_text_: "Buy tokens for ETH" ,
        info_text_: `Available ETH: ${available_eth}`
    },
    {
        button_id_: "buy-eth",
        button_text_: "Buy ETH for tokens" ,
        info_text_: `Available tokens: ${available_tokens}`
    }
]

export default function TradingPage(): JSX.Element {
    return (
        <div id="absolute-parent">
            <div id="trade-area">
                {trade_area_args.map(object_ => {
                    return <TradeArea 
                        button_id_={object_.button_id_}
                        button_text_={object_.button_text_} 
                        info_text_={object_.info_text_}
                    />
                })}
            </div>
            <div id="redeem-donations-area">Redeem channel donations</div>
            <div id="withdraw-area">Withdraw tokens to wallet</div>
        </div>
    )
}

// TD: buy & sell buttons && withdraw tokens && redeem channel donations -> flexbox vertical 3
// TD: user sh have ETH & token balance that change upon trading (& investing when I implement the second page)