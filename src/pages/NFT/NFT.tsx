import { Box, Grid } from "@mui/material";
import Header from "../../component/Header/Header";
import img1 from '../../images/nftchesh1(30).png'
import img2 from '../../images/nftchesh3(60).png'
import img3 from '../../images/nftchesh2(90).png'
import { NFTComponent } from "../../component/NFT/NFT";
import { useWeb3Context } from "../../hook/web3Context";
import { mintNFT } from "../../hook/hook";

const nfts = [
	{ img: img1, earn: 4500 },
	{ img: img2, earn: 9000 },
	{ img: img3, earn: 15000 },
]


const NFT = () => {
	const { connected, address } = useWeb3Context()

	const mint = async (type: number) => {
		if (connected) {
			mintNFT(address, type);
		}
	}
	return (
		<Box>
			<Header showAccount={true} setShowAccount={(f: boolean) => {}} />
			<Box p={12}>
				<Grid container>
					{nfts.map((item: any, key: number) => (
						<Grid item lg={4} md={4} sm={12} xs={12} key={key}>
							<Box p={8}>
								<NFTComponent mint={mint} type={key + 1} img={item.img} earn={item.earn}/>
							</Box>
						</Grid>
					))}
				</Grid>
			</Box>
		</Box>
	)
}

export default NFT;


