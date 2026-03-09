import Link from "next/link"

export function Header({ showBackButton = false }: { showBackButton?: boolean }) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-6 pt-8">
            <div
                className="
          mx-auto
          grid
          grid-cols-12
          gap-x-6
          items-start
        "
            >
                {/* Logo or Back Button (left side, 2 columns) */}
                <div className="col-span-2">
                    {showBackButton ? (
                        <Link
                            href="/"
                            aria-label="Back to home"
                            className="flex items-center gap-2 text-foreground hover:text-[var(--text-secondary)] transition-colors duration-200"
                        >
                            <span
                                className="material-symbols-outlined"
                                style={{
                                    fontSize: 24,
                                    fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24',
                                }}
                            >
                                arrow_back
                            </span>
                            <span className="text-base font-medium">Back</span>
                        </Link>
                    ) : (
                        <Link href="/" aria-label="Diana Tofan home">
                            <svg
                                width={24}
                                height={24}
                                viewBox="0 0 251 239"
                                fill="currentColor"
                                className="hover:cursor-pointer header-logo"
                            >
                                <path d="M81.8812 236.371C70.4592 236.371 59.7762 234.311 49.8387 230.187C39.8897 226.064 31.2221 220.459 23.8188 213.365C16.4152 206.282 10.602 197.988 6.37312 188.469C2.13835 178.951 0.0239258 168.791 0.0239258 158.005C0.0239258 147.215 2.13835 137.07 6.37312 127.552C10.602 118.034 16.4152 109.739 23.8188 102.645C31.2221 95.5623 39.8897 89.9577 49.8387 85.8341C59.7762 81.7104 70.4592 79.6472 81.8812 79.6472H86.9537C83.1464 82.816 79.6051 86.9987 76.3239 92.1717C73.0457 97.3654 70.3025 103.331 68.0767 110.1C65.8567 116.869 64.1097 124.324 62.8446 132.468C61.5764 140.612 60.9409 149.128 60.9409 158.005C60.9409 166.893 61.5764 175.41 62.8446 183.554C64.1097 191.694 65.8567 199.152 68.0767 205.907C70.3025 212.688 73.0457 218.653 76.3239 223.838C79.6051 229.023 83.1464 233.203 86.9537 236.371H81.8812" />
                                <path d="M241.777 67.9032V136.754H240.509C239.022 134.635 236.646 131.094 233.367 126.119C230.089 121.156 225.753 115.495 220.361 109.145C214.966 102.808 208.413 96.1448 200.689 89.1657C192.971 82.1865 183.925 75.6272 173.567 69.4876V67.9032H241.777ZM105.674 56.8034C113.711 52.5733 121.959 47.7166 130.419 42.2037C137.605 37.347 145.539 31.4764 154.212 24.6007C162.884 17.728 171.448 9.85323 179.911 0.964538V106.618V158.643C179.911 166.042 180.913 172.764 182.923 178.789C184.933 184.81 187.629 190.32 191.014 195.283C194.398 200.258 198.203 204.651 202.436 208.449C206.666 212.256 211.005 215.544 215.445 218.293C225.806 225.062 237.654 230.232 250.976 233.832C242.519 235.313 234.053 236.478 225.596 237.329C218.194 237.956 210.207 238.166 201.644 237.956C193.077 237.746 184.987 236.688 177.372 234.787C169.97 232.878 163.044 229.395 156.594 224.314C150.141 219.236 144.537 213.049 139.777 205.756C135.018 198.464 131.261 190.367 128.518 181.49C125.763 172.602 124.389 163.515 124.389 154.207V103.751C124.389 92.976 123.392 84.5159 121.376 78.3763C119.369 72.2396 117.2 67.5898 114.87 64.421C112.127 60.6107 109.059 58.0715 105.674 56.8034" />
                            </svg>
                        </Link>
                    )}
                </div>

                {/* Navigation (right side, 4 columns aligned right) */}
                <nav className="col-span-4 col-start-9 flex flex-col items-end gap-1">
                    <Link
                        href="/#work"
                        classNam font-medium text-foreground hover:text-[var(--text-secondary)] transition-colors duration-200"
                    >
                        work
                    </Link>
                    <Link
                        href="/about"
                        className="text-base font-medium text-foreground hover:text-[var(--text-secondary)] transition-colors duration-200"
                    >
                        about
                    </Link>
                </nav>
            </div>
        </header>
    )
}