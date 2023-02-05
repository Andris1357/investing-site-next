export class SetColorEventListenerArgs {
    constructor (
        public button_id_: string, 
        public edges_: string, 
        public font_: string, 
        public event_: string
    ) {}
}

export function setColorEventListener(args: SetColorEventListenerArgs): void {
    let element: HTMLElement | any = document.getElementById(args.button_id_);
    let callable = (): void => {
        element.style.borderColor = args.edges_;
        element.style.color = args.font_;
    }
    element.addEventListener(args.event_, callable);
}