import { useEffect, useRef } from "react";
import { styled } from '@mui/material'
import { ThreeDeeRenderer } from "../core/ThreeDeeRender";

export const Wrapper = styled('div')({
    position: "fixed",
    top:0,
    bottom:0,
    left:0,
    right:0,
    zIndex:-1,
})

const Canvas = styled('canvas')({
    width: '100%',
    height: '100%',
    position: 'absolute'
})

const ThreeDeeBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const rendererRef = useRef<ThreeDeeRenderer | null>(null)
    useEffect(() => {
        if (canvasRef.current) {
            rendererRef.current = new ThreeDeeRenderer(canvasRef.current)
        }
        return () => {
            rendererRef.current?.dispose()
            rendererRef.current = null
        }
    }, [])

    return <Wrapper ><Canvas ref={canvasRef} /></Wrapper>
}

export default ThreeDeeBackground