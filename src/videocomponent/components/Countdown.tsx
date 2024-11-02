import React, { useEffect, useState } from 'react'

interface CountdownProps {
    initialCount: number
    onCountEnd: () => void
}

const Countdown = ({
    initialCount = 5,
    onCountEnd
}: CountdownProps) => {
    const [count, setCount] = useState(initialCount)

    useEffect(() => {
        const interval = setInterval(() => {
            setCount(count - 1)
        }, 1000)

        if (count === 0) {
            clearInterval(interval)
            onCountEnd()
        }

        return () => clearInterval(interval)
    }, [count])

    return (
        <div className='text-red-600 text-[4rem] font-bold '>{count}</div>
    )
}

export default Countdown
