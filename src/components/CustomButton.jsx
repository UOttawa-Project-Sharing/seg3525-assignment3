import React from 'react';
import Button from 'react-bootstrap/Button';

const sizeMap = {
    small: 'sm',
    medium: 'md',
    large: 'lg',
};

export default function CustomButton({ children, size = 'medium', ...props }) {
    return (
        <Button size={sizeMap[size] || 'md'} variant="secondary" {...props}>
            {children}
        </Button>
    );
}