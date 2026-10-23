import logo from "./logo.svg";

// The logo is used as a mask so it can take the brand colour of the current theme
const LOGO_MASK_STYLE = {
    maskImage: `url(${logo})`,
    WebkitMaskImage: `url(${logo})`,
    maskSize: "contain",
    WebkitMaskSize: "contain",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
};

/** Round brand badge with the Trading Assist logo */
export function LogoMark() {
    return (
        <span className="flex items-center justify-center w-9 h-9 flex-shrink-0 rounded-full bg-brand-300">
            <span role="img" aria-label="Logo" className="block w-5 h-5 bg-forest-300" style={LOGO_MASK_STYLE} />
        </span>
    );
}
