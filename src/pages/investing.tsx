// NOW: I need states across pages so I need Redux
// NOW: create Link on <i> in trade.tsx to this page & to that page
import { MenuRibbon } from "./areas"

export default function InvestingPage({}): JSX.Element {
    return (
        <div>
            <div><MenuRibbon current_menu_id_="investing-menu-icon"/></div>
        </div>
    )
}