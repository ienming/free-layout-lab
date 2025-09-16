export function getAngleFromDegree(degree) {
    return (degree * Math.PI) / 180;
};

export function getDegreeFromAngle(angle) {
    const deg = (angle * 180) / Math.PI;
    return (deg + 360) % 360;
};

// 滑鼠世界座標 → 元素本地座標
export function getLocalCoords(globalX, globalY, targetCx, targetCy, angle) {
    const dx = globalX - targetCx;
    const dy = globalY - targetCy;
    const localX = dx * Math.cos(-angle) - dy * Math.sin(-angle);
    const localY = dx * Math.sin(-angle) + dy * Math.cos(-angle);

    return { localX, localY };
};
