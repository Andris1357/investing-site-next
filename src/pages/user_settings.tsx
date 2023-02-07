import { MenuRibbon } from "./areas";

export default function UserSettingsPage({}): JSX.Element {
    return (
        <div>
            <div><MenuRibbon current_menu_id_="user-settings-menu-icon"/></div>
            {/* NOW: use flex to create columns similar to trade.tsx */}
        </div>
    )
}