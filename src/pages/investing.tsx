// NOW: create user settings & login|register page
// NOW: refactor code from components.jsx into investing.tsx
import { MenuRibbon } from "./areas";

export default function InvestingPage({}): JSX.Element {
    return (
        <div id="investing-parent" className="absolute-parent">
            <div><MenuRibbon current_menu_id_="investing-menu-icon"/></div>
            {/* NOW: use flex to create columns similar to trade.tsx */}
            <div id="investing-areas" className="main-area">
                <div id="data-area">
                    data
                </div>
                <div id="chart-area">
                    chart
                </div>
            </div>
        </div>
    )
}