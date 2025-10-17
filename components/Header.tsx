interface HeaderProps {
    name?: string;
}

const Header = ({ name = "CSR" }: HeaderProps) => {
    return (
        <div className="hero bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 shadow-xl mb-10 relative overflow-hidden">
            <div className="absolute top-10 right-20 w-24 h-24 bg-primary/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 left-20 w-16 h-16 bg-secondary/20 rounded-full blur-lg"></div>
            
            <div className="hero-content text-center py-10 relative z-10">
                <div className="max-w-2xl">
                    <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                        {name} Market
                    </h1>
                    <p className="text-xl text-base-content/80 leading-relaxed mb-2">
                        A simulated product listing page rendering with {name}.
                    </p>
                </div>
            </div>
        </div>
    )
}
export default Header