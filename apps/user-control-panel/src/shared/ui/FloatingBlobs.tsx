export function FloatingBlobs() {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">

            <div
                className="
                    absolute 
                    w-[700px] h-[700px] 
                    md:w-[900px] md:h-[900px]
                    lg:w-[1100px] lg:h-[1100px]
                    bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10
                    dark:from-primary/12 dark:via-primary/8 dark:to-primary/5
                    rounded-full 
                    blur-3xl
                    animate-float-slow
                    -top-96 -right-96
                    md:-top-[500px] md:-right-[400px]
                    lg:-top-[600px] lg:-right-[500px]
                "
            />

            <div
                className="
                    absolute 
                    w-[600px] h-[600px] 
                    md:w-[750px] md:h-[750px]
                    lg:w-[900px] lg:h-[900px]
                    bg-gradient-to-br from-accent/30 via-accent/25 to-accent/20
                    dark:from-accent/18 dark:via-accent/12 dark:to-accent/8
                    rounded-full 
                    blur-3xl
                    animate-float-medium
                    bottom-0 right-0
                    translate-x-1/4 translate-y-1/4
                    md:translate-x-1/3 md:translate-y-1/3
                "
            />

            <div
                className="
                    absolute 
                    w-[500px] h-[500px] 
                    md:w-[650px] md:h-[650px]
                    lg:w-[500px] lg:h-[400px]
                    bg-gradient-to-br from-primary/25 via-primary/20 to-primary-15 
                    rounded-full 
                    blur-3xl
                    animate-float-slow
                    bottom-0 left-0
                    -translate-x-1/4 translate-y-1/4
                    md:-translate-x-1/3 md:translate-y-1/3
                "
            />
        </div>
    );
}