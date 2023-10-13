import "./title.css"

export function Title ({ children }: { children: any }) {
    return (
        <>
        <div className="title">
        {children}
        </div>
        </>
    )
    }