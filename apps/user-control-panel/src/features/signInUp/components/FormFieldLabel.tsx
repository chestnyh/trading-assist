export function FormFieldLabel({ label, id }: { label: string, id: string }){
    return (
        <label htmlFor={id} className="font-roboto tracking-[0] font-normal text-[14px] text-text">{label}</label>
    );
};