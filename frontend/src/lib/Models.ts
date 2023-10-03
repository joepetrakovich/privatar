export interface Currency {
    name: string,
    symbol: string,
    decimals: number
};

export interface Network {
    name: string,
    chainIdHex: string,
    chainIdDecimal: number,
    rpcUrls: string[],
    blockExplorerUrls: string[],
    nativeCurrency: Currency
}