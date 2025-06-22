import React from 'react';

const sizeMap = {
    small: 'h3',
    medium: 'h2',
    large: 'h1',
};

export default function Title({ children, size = 'medium' }) {
    const Tag = sizeMap[size] || 'h2';
    return <Tag style={{ textShadow: '2px 2px 0 #000, 4px 4px 0 #000' }}>{children}</Tag>;
}