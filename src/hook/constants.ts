export const chainIds: {
    [key: string]: 56 | 97,
} = {
    mainnet: 56,
    testnet: 97
}
// export const chainId = 97; // binance smart chain testnet
export const chainId: 56 | 97 = chainIds[process.env.REACT_APP_NETWORK || 'testnet']; // binance smart chain mainnet
// export const PREMIUM_COST = 0.01;
// export const LAND_COST = 0.01;

// export const chainId = 56;
export const PREMIUM_COST = 25; // 50

export const LAND_COST = [4320, 1000, 3240] ;

export const DEFAULT_MINE = {
    COST: chainId===97 ? 1 : 8100,
    CLAIM: chainId===97 ? 1 : 3000,
    REQUEST: chainId===97 ? 1 : 300,
    TIMER: 24*60*60,
}

export const GOLD_MINE = {
    COST: chainId===97 ? 1 : 5040,
    CLAIM: 300,
    REQUEST: 20,
    TIMER: 3*60*60,
}
export const URANIUM_MINE = {
    COST: chainId===97 ? 1 : 6700,
    CLAIM: 400,
    REQUEST: 30,
    TIMER: 3*60*60,
}

export const POWER_PLANT = {
    COST: chainId===97 ? 1 : 40000 ,
    CLAIM: 9000,
    REQUEST: 3000,
    TIMER: 24*60*60,
}

export const STAKE_TIMER = 3 * 60 * 60;
export const MINING_TIMER = 24 * 60 * 60;

export const RPC_URL = {
    56: "https://bsc-dataseed1.binance.org:443",
    97: "https://data-seed-prebsc-1-s3.binance.org:8545/",
};

export const NETWORK_NAMES = {
    56: "BSC Mainnet",
    97: "BSC Testnet",
};

export const ADMIN_WALLET_ADDRESS = {
    // 56: "0x96Ca266261F828BAB32E800F5797f0eDc2cCE66f", // ElonMars Deployer
    56: "0x2924a5b536e60303e9C25BbFcd3Ae4Adc9085652", // ElonMars Aministrator
    97: "0x4762099E567e738F0E49D45A16e8c53e31CeB059",
};

export const BUSD_CONTRACT_ADDRESS = {
    56: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    97: "0xaB1a4d4f1D656d2450692D237fdD6C7f9146e814",
};

export const TOKEN_CONTRACT_ADDRESS = {
    56: "0xc6D542Ab6C9372a1bBb7ef4B26528039fEE5C09B",
    97: "0xE606cFd86d134b16178b95bf6E5ee8A3F55d8B4F",
};

export const POOL_WALLET_ADDRESS = {
    56: "0xAccEe92795919145843132a3E6c135f27c897C6E", // CORRECT
    97: "0x0a28e740F270e2c25646F5E0189CDFE175546E29",
};

export const PVP_CONTRACT_ADDRESS = {
    56: "0xB4BD6347c8bEE284879c79Ab7092972D8389cAD0",
    97: "0xB4BD6347c8bEE284879c79Ab7092972D8389cAD0",
};

export const NFT_CONTRACT_ADDRESS = {
    56: "0x95df3239DB35234F6eEaAcacfc9E03456009C142",
    97: "0xB4BD6347c8bEE284879c79Ab7092972D8389cAD0",
}