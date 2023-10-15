import "./title.css"

export function Title ({ children }: { children: any }) {
    return (
        <>
        <div className='title'>
        {children}
        </div>
        </>
    )
    }

export function Subtitle ({ children }: { children: any }) {
    return (
        <>
        <div className="subtitle">
        {children}
        </div>
        </>
    )
    }

export function IntroTransition ({ children }: { children: any }) {
    return (
        <>
        <div className="intro-transition">
        {children}
        </div>
        </>
    )
    }

export function SecondSlideTransition ({ children }: { children: any }) {
    return (
        <>
        <div className="second-slide-transition">
        {children}
        </div>
        </>
    )
    }