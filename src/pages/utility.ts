export class SetColorEventListenerArgs {
    constructor (
        public button_id_: string, 
        public edges_: string, 
        public font_: string, 
        public event_: string
    ) {}
}

export function shiftedRandom(
    range_: number, 
    offset_: number, 
    digits_: number
): number {
    return Number((Math.random() * range_ + offset_).toFixed(digits_))
}

export function changeAmountCallback(
    reference_element_: HTMLInputElement | any,
    multiplier_: number, 
    digits_: number
): (amount_: number) => number {
    return amount_ => Number(
        (amount_ + Number(reference_element_.value) * multiplier_).toFixed(digits_)
    )
}

export function setColorEventListener(args: SetColorEventListenerArgs): void {
    let element: HTMLElement | any = document.getElementById(args.button_id_);
    let callable = (): void => {
        element.style.borderColor = args.edges_;
        element.style.color = args.font_;
    }
    element.addEventListener(args.event_, callable);
}

export function getMenuIcons(): HTMLElement[] {
    return [...document.getElementsByTagName("i")].filter(
        (element_: HTMLElement): boolean => {
            return element_.id.includes("menu-icon")
        }
    )
}