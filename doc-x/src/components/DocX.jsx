import React, { useState } from 'react'

export default function DocX(props) {
    const [input, setInput] = useState("DocX")
    return (
        <>
            <div style={{ borderRadius: "20px", padding: "20px" }} className='bump'>
                <div style={{ position: "relative" }}>
                    <textarea ref={props.textareaRef} value={props.input} onChange={(e) => { props.sendMessage(e.target.value); props.setInput(e.target.value) }}></textarea>
                    {props.children}
                </div>
            </div>

        </>
    )
}
