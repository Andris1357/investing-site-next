// NOW: I need states across pages so I need Redux
// NOW: create user settings & login|register page
// NOW: refactor code from components.jsx into investing.tsx
import { MenuRibbon } from "./areas";

export default function InvestingPage({}): JSX.Element {
    return (
        <div>
            <div><MenuRibbon current_menu_id_="investing-menu-icon"/></div>
            {/* NOW: use flex to create columns similar to trade.tsx */}
        </div>
    )
}