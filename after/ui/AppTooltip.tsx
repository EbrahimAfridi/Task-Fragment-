import React from 'react';
import styled from "styled-components";


const Tooltip = styled.div`
// styles for Tooltip
`;

interface PropTypes {
    title: string,
    children: React.ReactNode
}

const AppTooltip = ({ title, children }: PropTypes) => {
    return (
        <Tooltip title={title}>
            {children}
        </Tooltip>
    );
};

export default AppTooltip;
