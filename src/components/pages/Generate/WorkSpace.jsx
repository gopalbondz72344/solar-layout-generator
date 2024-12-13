/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from "react";
import ControlPanel from "../../hooks/ControlPanel";
import SMBSection from "../../UI/SMBSection";
import useDrag from "../../hooks/useDrag";

const WorkSpace = ({ counts }) => {
    const workspaceRef = useRef(null);
    const [scaleFactor, setScaleFactor] = useState(1);
    const { position, cursorStyle, handleMouseDown, setPosition } = useDrag();
    const { SmbCount, StringCount, PanelCount } = counts;

    const generateLayout = () => {
        const layout = [];
        for (let i = 0; i < SmbCount; i++) {
            const strings = [];
            for (let j = 0; j < StringCount; j++) {
                const panels = Array(PanelCount).fill(0);
                strings.push(panels);
            }
            layout.push(strings);
        }
        return layout;
    };

    const layout = generateLayout();

    const handleZoom = (event) => {
        const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;
        setScaleFactor((prevScale) => {
            const newScale = prevScale * zoomFactor;
            return Math.max(0.1, Math.min(newScale, 5)); // Set limits for scaling
        });
    };

    useEffect(() => {
        const workspaceElement = workspaceRef.current;
        if (workspaceElement) {
            workspaceElement.addEventListener("wheel", handleZoom, { passive: true });
        }
        return () => {
            if (workspaceElement) {
                workspaceElement.removeEventListener("wheel", handleZoom);
            }
        };
    }, []);

    useEffect(() => {
        setPosition({ x: -50, y: -420 }); // Keep position centered when zooming
    }, [scaleFactor, setPosition]);

    return (
        <div id="workspace" className="min-h-screen custom-background text-white w-[100%] h-[100%] p-80 -z-40">
            <ControlPanel
                setScaleFactor={setScaleFactor}
                setPosition={setPosition}
                scaleFactor={scaleFactor}
            />
            <div
                ref={workspaceRef}
                onMouseDown={handleMouseDown}
                style={{
                    transform: `scale(${scaleFactor}) translate(${position.x}px, ${position.y}px)`,
                    transformOrigin: "center",
                    cursor: cursorStyle,
                    position: "relative",
                    width: "100%",
                    height: "100%",
                }}
            >
                {layout.map((strings, smbIndex) => (
                    <SMBSection
                        key={smbIndex}
                        smbIndex={smbIndex}
                        StringCount={StringCount}
                        PanelCount={PanelCount}
                    />
                ))}
            </div>
        </div>
    );
};

export default WorkSpace;
