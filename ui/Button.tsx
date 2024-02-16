interface ButtonType {
    variant: string,
    onClick: () => void,
    startIcon: React.ReactNode,
    children: React.ReactNode
}

function Button({ variant, onClick, startIcon, children }: ButtonType) {
    return(
        <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', padding: 2, color: "#fff" }}>
            <span>{startIcon}</span>
            {children}
        </button>
    )
}

export default Button;