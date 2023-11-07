import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../component/Header/Header';
import { Box, Grid, Button, Typography  } from '@mui/material';
import Modal from '@mui/material/Modal';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useWeb3Context } from '../../hook/web3Context';
import styles from "./Main.module.scss";
import ExchangeModal from '../../component/Header/ExchangeModal';
import { claimBird, claimDiamond, stakeBird, stakeDiamond, swapEggs, swapResources } from '../../store/user/actions';
import { useDispatch, useSelector } from 'react-redux';
import DepositModal from '../../component/Modal/DepositModal';
import { STAKE_TIMER } from '../../hook/constants';
import MiningModal from '../../component/Modal/MiningModal';
import { showMinutes } from '../../utils/timer';
import { width } from '@mui/system';
import InstructionModal from '../../component/Modal/InstructionModal';

interface MainProps{
  showAccount: any,
  setShowAccount: any,
}

const Main = ({showAccount, setShowAccount}:MainProps) => {

  const dispatch = useDispatch<any>();
  const userModule = useSelector((state:any) => state.userModule); 
  const {user} = userModule;

  const gbaks = userModule.user.gbaks;
  const resource = userModule.user.resource;
  const eggs = userModule.user.eggs;

  const [openInstruction, setOpenInstruction] = useState(false);


  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize({width:window.innerWidth, height:window.innerHeight});
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  });

  const TEST_MODE = false;
  const MIN_SCREEN = 1200;
  const navigate = useNavigate();
  const { connected, chainID, address, connect } = useWeb3Context();
  const [map, setMap] = useState(0);
  const [openSwap, setOpenSwap] = useState(false);
  const [openDeposit, setOpenDeposit] = useState(false);
  const [openMining, setOpenMining] = useState(false);

  const [items, setItems] = useState([
    {item:0, timer:0, posx:"80px", posy:"100px", type: 1},
    {item:0, timer:0, posx:"80px", posy:"250px", type: 2},
    {item:0, timer:0, posx:"80px", posy:"400px", type: 1},
    {item:0, timer:0, posx:"80px", posy:"550px", type: 2},
    {item:0, timer:0, posx:"200px", posy:"100px", type: 1},
    {item:0, timer:0, posx:"200px", posy:"250px", type: 1},
    {item:0, timer:0, posx:"200px", posy:"400px", type: 1},
    {item:0, timer:0, posx:"200px", posy:"550px", type: 2}
  ]);

  const [birds, setBirds] = useState([
    {item:0, timer:0},
    {item:0, timer:0},
    {item:0, timer:0},
    {item:0, timer:0},
    {item:0, timer:0},
    {item:0, timer:0},
    {item:0, timer:0},
    {item:0, timer:0}
  ]);

  const diamonds=[
    1, 2
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);

  const showModal = (index:any) => {
    if(gbaks<20) {
      return;
    }
    setSelectedIndex(index);
    handleOpen()
  }

  const showBirdModal = () => {
    handleBirdOpen()
  }

  const setItem = (item:any) => {
    
    dispatch(stakeDiamond(address, selectedIndex, item, (res:any)=>{
      console.log("res = ", res, res.success, res.success===false);
      if(res.success === false) return;
      console.log(res.success);

      let _items = [...items];
      _items[selectedIndex].item = item;
      _items[selectedIndex].timer = STAKE_TIMER;
      setItems(_items);
      handleClose();
    }));
  }

  const setBirdItem = (index:any, item:any) => {
    
    if(gbaks<20)  return;
    dispatch(stakeBird(address, index, (res:any)=>{
      if(res.success === false) return;
      let _items = [...birds];
      _items[index].item = item;
      _items[index].timer = STAKE_TIMER;
      setBirds(_items);
    }));

  }

  const onClaim = (e:any, index:number) => {
    e.stopPropagation() ;

    dispatch(claimDiamond(address, index, (res:any)=>{
      if(res.success === false) return;
      let _items = [...items];
      _items[index].item = 0;
      _items[index].timer = 0;
      setItems(_items);
    }));
  }

  const onClaimBird = (e:any, index:number) => {
    e.stopPropagation() ;

    dispatch(claimBird(address, index, (res:any)=>{
      if(res.success === false) return;
      let _items = [...birds];
      _items[index].item = 0;
      _items[index].timer = 0;
      setBirds(_items);
    }));
  }

  const onExchange = (swapAmount:number) => {
    dispatch(swapResources(address, swapAmount, (res:any)=>{}));
    setOpenSwap(false);
  }

  const onExchangeEgg = (swapAmount:number) => {
    dispatch(swapEggs(address, swapAmount, (res:any)=>{}));
    setOpenSwap(false);
  }

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openBird, setOpenBird] = React.useState(false);
  const handleBirdOpen = () => setOpenBird(true);
  const handleBirdClose = () => setOpenBird(false);

  let timer:any = null;
  const startTimer = () => {
    if (timer === null) {
      timer = setInterval(()=>{
        setItems((prevItem)=>{
          
          let _item = [...prevItem];
          _item = _item.map((value)=>{
            if(value.timer > 0) value.timer--;
            return value;
          });
          return _item;
        });

        setBirds((prevItem)=>{
          
          let _item = [...prevItem];
          _item = _item.map((value)=>{
            if(value.timer > 0) value.timer--;
            return value;
          });
          return _item;
        });
      }, 1000);
    }
  }

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
      xs:200,
      sm:400,
      md:800
    },
    background: "url(/images/modal-back.png)",
    backgroundSize: "100%",
    bgcolor: 'background.paper',
    border: '1px solid #000',
    maxHeight: "500px",
    overflow: "auto",
    boxShadow: 24,
    p: 4,
  };

  useEffect(()=>{
    
    startTimer();
    
    return () => clearInterval(timer);
  }, [JSON.stringify(items)]);


  // set staked diamond
  useEffect(()=>{
    console.log(user.stakedDiamond);
    if(user.stakedDiamond && user.stakedDiamond.length>0) {
      
      let _items = [...items];
      for (let dt of user.stakedDiamond) {
        if(!dt || dt.position>7) continue;

        let date = new Date();
        let curSec = date.getTime();
        let endSec = new Date(dt.staked_at).getTime();

        let eDate = new Date(dt.staked_at);

        console.log("{{{", date, eDate, "}}}");
        console.log(date.getTime(), curSec, endSec);

        _items[dt.position].item = dt.diamond;
        _items[dt.position].timer = STAKE_TIMER - Math.floor((curSec - endSec)/1000);
        if(_items[dt.position].timer < 0) _items[dt.position].timer = 0;
      }
      console.log("-->>=================", _items);
      setItems(_items);
    }
  }, [JSON.stringify(user.stakedDiamond)]);

  useEffect(()=>{
    console.log(user.stakedBirds);
    if(user.stakedBirds && user.stakedBirds.length>0) {
      
      let _items = [...birds];
      for (let dt of user.stakedBirds) {
        if(!dt) continue;
        if(dt.position>=10) continue;

        let date = new Date();
        let curSec = date.getTime();
        let endSec = new Date(dt.staked_at).getTime();

        _items[dt.position].item = 1;
        _items[dt.position].timer = STAKE_TIMER - Math.floor((curSec - endSec)/1000);
        if(_items[dt.position].timer < 0) _items[dt.position].timer = 0;
      }
      setBirds(_items);
    }
  }, [JSON.stringify(user.stakedBirds)])

  return (
    <>
      <Box>
        <Header 
          showAccount={showAccount}
          setShowAccount={setShowAccount}
        />
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{...style, width:{sm:400, md:400}}}>
            <Grid container spacing={3}>
              {diamonds.map((item, index)=>(
                <Grid item key = {index} xs={6} sm={6} md={6}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Box
                    sx={{
                      width:"100px",
                      cursor:"pointer",
                      
                    }}

                  >
                    {item === 1 && <img alt="" src='/images/diamond_1.png'/>}
                    {item === 2 && <img alt="" src='/images/diamond_2.png'/>}

                    <Box sx={{textAlign:"center"}}>
                      <Button 
                        sx={{
                          padding: "10px 4px"
                        }}
                        variant="contained" 
                        color='success'
                        onClick={(e)=>setItem(item)}
                      >
                          20 Gbaks
                      </Button>
                      
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Modal>

        <Modal
          open={openBird}
          onClose={handleBirdClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Grid container spacing={3}>
              {birds.map((item, index)=>(
                <Grid item key = {index} xs={6} sm={3} md={1.5}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Box
                    sx={{
                      width:"100px",
                      cursor:"pointer",
                      position: "relative",
                    }}
                    
                  >
                    {<img alt="" src='/images/bird.png'/>}
                    <Box sx={{display: "flex", justifyContent:"center", textAlign:"center"}}>
                      {item.item === 0 && <Button 
                        sx={{
                          padding: "10px 4px",
                        }}
                        variant="contained" 
                        color='success'
                        onClick={(e)=>setBirdItem(index, 1)}
                      >
                          20 Gbaks
                      </Button>}
                      
                      {item.item!=0 && <>
                        {
                          item.timer != 0 ? <Button sx={{ padding: "10px 4px", backgroundColor:"#736b6b", color:"white !important" }} variant="outlined" disabled>
                            {showMinutes(item.timer)}
                          </Button> : 
                          <Button sx={{ padding: "10px 4px" }} variant="contained" color='success' onClick={e => onClaimBird(e, index)} >Claim</Button>
                        }
                      </>}
                      
                    </Box>
                    {/* {item.item != 0 && <Box sx={{
                        position:"absolute",
                        top:"50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        textAlign:'center',
                        backgroundColor: "#fffdfdba",
                        // border: "3px solid black",
                      }}>
                        {
                          item.timer != 0 ? 
                            (<Box sx={{fontSize:"30px"}}> {item.timer} </Box> ) :
                            (<Box>
                              <Button variant="contained" color='success' onClick={e => onClaimBird(e, index)} >Claim</Button>
                            </Box>)
                        }
                      </Box>} */}
                    
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Modal>

        <ExchangeModal open = {openSwap} setOpen = {setOpenSwap} resource = {resource} egg={eggs} onExchange={onExchange} onExchangeEgg={onExchangeEgg}/>
        <DepositModal open = {openDeposit} setOpen = {setOpenDeposit} resource = {resource} egg={eggs} onExchange={onExchange} onExchangeEgg={onExchangeEgg}/>
        <MiningModal open = {openMining} setOpen = {setOpenMining} />
        <InstructionModal open = {openInstruction} setOpen = {setOpenInstruction}/>

        <Box sx={{
          top: "50%",
          right: 0,
          zIndex: 1,
          position:"absolute",
          cursor:"pointer",
        }}
          onClick={(e:any)=>{
            console.log("show first page");
            navigate("/map2");
          }}
        >
          {/* <ArrowForwardIcon sx={{fontSize:"80px"}}/> */}
          <img alt="" src="/images/btn_arraw.png"/>

        </Box>

        <Box
          sx={{
            pointerEvents: `${TEST_MODE||connected?"":"none"}`
          }}
        >

          <Box>
            <Box sx={{position:"absolute", top: "100px", left:"30px", width:"300px", cursor:"pointer"}} onClick={e=>setOpenSwap(true)}><img alt="" src='/images/storage.png'/></Box>
            <Box sx={{position:"absolute", top: "400px", left:"130px", width:"300px", cursor:"pointer"}} onClick={e=>setOpenDeposit(true)}><img alt="" src='/images/home.png'/></Box>
            <Box sx={{position:"absolute", top: "500px", right:"340px", width:"300px", cursor:"pointer"}} onClick={e=>setOpenMining(true)}><img alt="" src='/images/mining.png'/></Box>
          </Box>

          
          {items.map((item, index)=>(
              <Box
                sx={{
                  position: "absolute",
                  top: `${item.posx}`,
                  right: `${item.posy}`,
                  left: (windowSize.width<MIN_SCREEN)?(MIN_SCREEN-parseInt(item.posy)+"px"):"auto",
                  width:`${(item.type===1 || item.item!=0) ?"100px":"150px"}`,
                  cursor:"pointer",
                  margin:"auto",
                }}

                onClick={(e)=>{
                  if(item.item===0) showModal(index);
                }}
                key={index}
              >
                {item.item === 0 ?
                  (<Box sx={{
                    position:"absolute", 
                    top: `${item.type===1 ?"12px":"0px"}`
                  }}>
                    <img alt="" className={styles.item} src={`/images/place_${item.type}.png`}/>
                  </Box>)
                  : (<Box sx={{position: "relative", zIndex: 2}}>
                      
                      {item.item != 0 && <Box sx={{
                        position:"absolute",
                        top:"50%",
                        transform: "translate(0, -50%)",
                        width: "100%",
                        textAlign:'center',
                        backgroundColor: "#fffdfdba",
                        zIndex: 5
                      }}>
                        {
                          item.timer != 0 ? 
                            (<Box> {showMinutes(item.timer)} </Box> ) :
                            (<Box>
                              {/* <Button variant="contained" color='success' onClick={e => onClaim(e, index)} >Claim</Button> */}
                            </Box>)
                        }
                      </Box>}
                      <Box 
                        className={(item.item!=0 && item.timer===0) ? styles.active : ""} 
                        style={{position:"relative", zIndex: 4}} 
                        onClick={e => {
                          if(item.item!=0 && item.timer===0)
                            onClaim(e, index);
                          else alert("please wait...");
                        }}
                      >
                        <img alt="" src={`/images/diamond_${item.item}.png`}/>
                      </Box>
                      <Box sx={{
                        position:"absolute", 
                        top: `${item.type===1 ?"12px":"0px"}`, 
                        left: `${item.type===1 ?"0":"-50px"}`, 
                        width:`${item.type===1 ?"100px":"150px"}`, 
                        zIndex: 1,
                        opacity: 0.6
                      }}>
                        <img alt=""  src={`/images/place_${item.type}.png`}/>
                      </Box>
                    </Box>)
                }
              </Box>
          ))}

          <Box
            sx={{
              position: "absolute",
              top: "40%",
              right: "50%",
              left: windowSize.width<MIN_SCREEN?"500px":"auto",
              width:"150px",
              cursor:"pointer",
              margin:"auto",
            }}

            onClick={(e)=>{
              showBirdModal();
            }}
          >
            <img alt="" className={styles.item} src={`/images/bird_place.png`}/>
          </Box>

        </Box>
      </Box>

      <Box
        className={styles.loginbg}
        sx={{
          display: (TEST_MODE||connected)?"none":"block",
          position: "absolute",
          top:0,
          width:"100%",
          zIndex: 2,
        }}
      >
        <Box sx={{
          position: "absolute",
          top: "50%",
          transform:"translate(0, -50%)",
          justifyContent: "center",
          width: "100vw",
          display: "flex"
        }}>
          
          <Box sx={{
            width: "12vw",
            minWidth: "100px",
            maxWidth: "180px",
          }}>
            <img alt="" src='/images/login_icon.png'/>
          </Box>
          <Box 
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          > 
            <Box className={styles.icon_buttons}><Button sx={{mb:1, width:"100%"}} variant="contained" color='success' onClick={(e)=>{connect()}}><img alt="" src='/images/icon_metamask.png'/>Connect Metamask</Button></Box>
            <Box className={styles.icon_buttons}><a className={styles.link} href='https://pancakeswap.finance/swap?outputCurrency=BNB&inputCurrency=0xc6D542Ab6C9372a1bBb7ef4B26528039fEE5C09B'><Button sx={{width:"100%", justifyContent:"left", mb:1}} variant="contained" color='success' ><img alt="" src='/images/icon_spx.png'/>Buy/Sell SPX</Button></a></Box>
            <Box className={styles.icon_buttons}><Button sx={{width:"100%", justifyContent:"left", mb:1}} variant="contained" color='success' onClick={(e)=>{setOpenInstruction(true)}} ><img alt="" src='/images/icon_youtube.png'/>INSTRUCTION</Button></Box>
          </Box>

        </Box>
      </Box>
    </>
  );
};

export default Main;
