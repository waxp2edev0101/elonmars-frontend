import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../component/Header/Header';
import { Box, Grid, Button, Typography  } from '@mui/material';
import Modal from '@mui/material/Modal';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useWeb3Context } from '../../../hook/web3Context';
import styles from "./PvpBattle.module.scss";
import ExchangeModal from '../../../component/Header/ExchangeModal';
import { claimBird, claimDiamond, stakeBird, stakeDiamond, swapEggs, swapResources } from '../../../store/user/actions';
import { useDispatch, useSelector } from 'react-redux';
import DepositModal from '../../../component/Modal/DepositModal';
import { STAKE_TIMER } from '../../../hook/constants';
import MiningModal from '../../../component/Modal/MiningModal';
import { showMinutes } from '../../../utils/timer';
import { width } from '@mui/system';
import InstructionModal from '../../../component/Modal/InstructionModal';
import { PVP_ATTACK_TURN, PVP_STATUS } from '../../../store/pvp/constant';
import { attackEndSuccess, getBattleData, setMyAddress, attack, changePvpStatus, unitAttack, unitAttackEndSuccess } from '../../../store/pvp/actions';
import PvpBattleAttackCardView from './PvpBattleAttackCardView';
import { LinearProgress } from '@mui/material';
import { removeRoomTransaction } from '../../../hook/hook';
import { handleSpinner } from '../../../store/utiles/actions';
import { getUnitHealth } from '../../../utils/constants';



const PvpBattle = () => {

  // var myImage:any; 
  var bullet=new Image();
  bullet.src="/images/bullet_laser.png";

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  });

  const canvasBullet = useRef<HTMLCanvasElement>(null);

  const dispatch = useDispatch<any>();
  const pvpModule = useSelector((state:any) => state.pvpModule); 
  const {pvpRoom, roomDetail} = pvpModule;

  const { connected, chainID, address, connect } = useWeb3Context();

  const [localUnitAnim, setLocalUnitAnim] = useState(false);
  const [remoteUnitAnim, setRemoteUnitAnim] = useState(false);

  const [localUnitAttackAnim, setLocalUnitAttackAnim] = useState(false);
  const [remoteUnitAttackAnim, setRemoteUnitAttackAnim] = useState(false);

  const [attackAble, setAttackAble] = useState(false);
  const [isLocalPlayerTurn, setIsLocalPlayerTurn] = useState(true);

  const [showLocalUnit, setShowLocalUnit] = useState(true);
  const [showRemoteUnit, setShowRemoteUnit] = useState(true);

  const [waitingTime, setWaitingTime] = useState(0);
  const [bulletPos, setBulletPos] = useState({
    x: 360,
    y: windowHeight-180,
  });

  let timer:any = null;
  const startTimer = (tm:number) => {
    if (timer === null && tm > 0) {
  
      timer = setInterval(()=>{
        setWaitingTime((prevTimer)=>{
          if(prevTimer < 1) {
            clearInterval(timer);
            attackWithRandomSpell();
            return 0;
          }
          return prevTimer-1;
        });
      }, 1000);
    }
  }

  const attackWithRandomSpell = () => {
    let flg_attack = checkAttackAble();
    console.log("random bullet, ", address, pvpRoom.roomid, flg_attack);

    let ability = address === pvpRoom.roomid ? pvpRoom.localPlayer.ability : pvpRoom.remotePlayer.ability
    
    if(flg_attack) {
      dispatch(attack(pvpRoom.roomid, address, ability[0]));
    }
  }

  useEffect(()=>{
    
    setLocalUnitAnim(pvpRoom.localPlayer.attack);
    setRemoteUnitAnim(pvpRoom.remotePlayer.attack);

    setTimeout(() => {
      dispatch(attackEndSuccess());
    }, 2000);

    if(pvpRoom.localPlayer.attack) {
      shootBullet(-1);
    }
    else if(pvpRoom.remotePlayer.attack){
      shootBullet(1);
    }

  }, [pvpRoom.localPlayer.attack, pvpRoom.remotePlayer.attack]);

  useEffect(()=>{
    
    console.log("unit Attack = ", pvpRoom.localPlayer.unitAttack, pvpRoom.remotePlayer.unitAttack );

    setLocalUnitAttackAnim(pvpRoom.localPlayer.unitAttack);
    setRemoteUnitAttackAnim(pvpRoom.remotePlayer.unitAttack);

    setTimeout(() => {
      dispatch(unitAttackEndSuccess());
    }, 3000);

  }, [pvpRoom.localPlayer.unitAttack, pvpRoom.remotePlayer.unitAttack]);

  useEffect(()=>{
    
    if(pvpRoom.localPlayer.hp === 0) {

    }
    if(pvpRoom.remotePlayer.hp === 0) {

    }

  }, [pvpRoom.localPlayer.hp, pvpRoom.remotePlayer.hp]);

  useEffect(()=>{
    if(roomDetail.status === PVP_STATUS.PLAY) {
      dispatch(getBattleData(pvpRoom.roomid));
    }
  }, [roomDetail.status]);

  const checkAttackAble = () => {
    
    if(pvpRoom.roomid === address) { // local player
      if(roomDetail.currentTurn === PVP_ATTACK_TURN.LOCAL_PLAYER) {
        console.log("TRUE1")
        setAttackAble(true);
        setIsLocalPlayerTurn(true);
        return true;
      } else {
        console.log("FALSE1")
        setAttackAble(false);
        setIsLocalPlayerTurn(true);
        return false;
      }
    } else { // remote player
      if(roomDetail.currentTurn === PVP_ATTACK_TURN.LOCAL_PLAYER) {
        console.log("FALSE2")
        setAttackAble(false);
        setIsLocalPlayerTurn(true);
        return false;
      } else {
        console.log("TRUE2")
        setAttackAble(true);
        setIsLocalPlayerTurn(false);
        return true;
      }
    }
  }

  const unitAttackAction = () => {

    console.log("Unit Attack", roomDetail.currentTurn);

    if(roomDetail.currentTurn === PVP_ATTACK_TURN.LOCAL_PLAYER){
      if(pvpRoom.localPlayer.unitHp > 0)
        dispatch(unitAttack(pvpRoom.roomid, address, pvpRoom.localPlayer.unit));
    } else {
      if(pvpRoom.remotePlayer.unitHp > 0)
        dispatch(unitAttack(pvpRoom.roomid, address, pvpRoom.remotePlayer.unit));
    }
  }

  useEffect(() => {
    
    let check = checkAttackAble();
    console.log("Unit Attack Ready " + roomDetail.status, pvpRoom.remotePlayer.ready);
    if(roomDetail.status===PVP_STATUS.PLAY && pvpRoom.remotePlayer.ready) {
      console.log("Unit Attack Start");
      if (check) unitAttackAction();
    }
    
  }, [roomDetail.currentTurn, pvpRoom.remotePlayer.ready]);

  const handleAnimationEnd = () => {
    alert("Gif Anim ended");
    console.log('GIF animation ended!');
    // Do something when the animation ends
  };

  const handleUnitAttackEnd = () => {

  }

  useEffect(()=>{
    if(roomDetail.status === PVP_STATUS.PLAY) {
      setWaitingTime(10);
      startTimer(10);
    }
    return () => clearInterval(timer);
  }, [roomDetail.currentTurn, roomDetail.status]);

  useEffect(()=>{
    if(pvpRoom.localPlayer.unitHp === 0) {
      setTimeout(() => {
        setShowLocalUnit(false);
      }, 2000);
    }

    if(pvpRoom.remotePlayer.unitHp === 0) {
      setTimeout(() => {
        setShowRemoteUnit(false);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [pvpRoom.localPlayer.unitHp, pvpRoom.remotePlayer.unitHp]);


  var interval: any = null;
  const shootBullet = (dir:number) => {

    setBulletPos({
      x: dir > 0 ? 360 : windowWidth-360,
      y: windowHeight - 180,
    })
        
    if(interval) clearInterval(interval);
    interval = setInterval(() => {
        setBulletPos((prevPos)=>{
          drawBullet(prevPos.x, prevPos.y);

          if(prevPos.x - 100 > windowWidth-360) {
            hideBullet();
            clearInterval(interval);
          }

          if(prevPos.x < 360) {
            hideBullet();
            clearInterval(interval);
          }

          return {x: prevPos.x + dir * 30, y:prevPos.y};
        });
    }, 30)
  }

  const drawBullet = (x:number, y:number) => {
    if (canvasBullet.current) {
        const canvas = canvasBullet.current;
        // canvas.addEventListener('mousemove', updateMousePosition);
        const context = canvas.getContext('2d');
        
        if (context) {
            context.clearRect(0, 0, windowWidth, windowHeight);
            drawImage(context, bullet, x, y, 50, 20, 0);
        }
    }
  }

  const hideBullet = () => {
    if (canvasBullet.current) {
        const canvas = canvasBullet.current;
        // canvas.addEventListener('mousemove', updateMousePosition);
        const context = canvas.getContext('2d');
        
        if (context) {
            context.clearRect(0, 0, windowWidth, windowHeight);
        }
    }
  }

  function drawImage(ctx: any, image: any, x: any, y: any, w: any, h: any, degrees: any){
    ctx.save();
    ctx.translate(x+w/2, y+h/2);
    ctx.rotate(degrees*Math.PI/180.0);
    ctx.translate(-x-w/2, -y-h/2);
    ctx.drawImage(image, x, y, w, h);
    ctx.restore();
  }

  const onCloseRoom = async () => {

    dispatch(handleSpinner(true, "Close Room ..."));

    try{

      let result = await removeRoomTransaction(address); 

      if(result) {
        dispatch(handleSpinner(false, "Close Room ..."));

        dispatch(changePvpStatus(PVP_STATUS.SELECT_ROOM));
      }

    } catch(e) {
      dispatch(handleSpinner(false, "Close Room ..."));
    }
  }

  const backToRoom = () => {
    dispatch(changePvpStatus(PVP_STATUS.SELECT_ROOM));
  }

  return (
    <>
      <Box className={styles.container}>

        {roomDetail.status === PVP_STATUS.WAITING && <Box sx={{display:"flex", justifyContent:"end"}}>
          <Button variant="contained" color='secondary' sx={{zIndex:1}} onClick={(e)=>{onCloseRoom()}}> Close Room </Button>
        </Box>}
        
        <canvas className='bullet-running' ref={canvasBullet} height={windowHeight} width={windowWidth} />

        {roomDetail.status === PVP_STATUS.PLAY && <>
          {attackAble ? <h2>Your turn</h2> : <h2>Enemy turn</h2>}
        </>}

        {roomDetail.status === PVP_STATUS.END && <>
          {roomDetail.winner === roomDetail.myAddress ? <h2>Your Win</h2> : <h2>You Lose</h2>}
          <Box sx={{display:"flex", justifyContent:"center"}}>
            <Button variant="contained" color='primary' sx={{zIndex:1, textAlign:"center"}} onClick={(e)=>{backToRoom()}}> Play Again </Button>
          </Box>
        </>}

        {roomDetail.status === PVP_STATUS.PLAY && attackAble && <PvpBattleAttackCardView isLocal = {pvpRoom.roomid === address}/>}

        <Box className={styles.player1}>
          {roomDetail.status===PVP_STATUS.PLAY && isLocalPlayerTurn && <Box sx={{display:"flex", justifyContent:"center"}}><h3>{waitingTime}</h3></Box>}
          {address === pvpRoom.roomid && <Box sx={{display:"flex", justifyContent:"center"}}><img alt="" style={{width: "40px"}} src='/images/pointer.png'/></Box>}
          {pvpRoom.localPlayer.hp}
          
          <LinearProgress variant="determinate" value={pvpRoom.localPlayer.hp/10} />
          {remoteUnitAnim && !pvpRoom.localPlayer.unitHp && <img alt="" className={styles.explode_player_1} src={"/images/gif_anim/explode_1.gif"+"?"+new Date().getTime()} />}
          {localUnitAnim && <img alt="" src={"/images/gif_anim/player_attack.gif"+"?"+new Date().getTime()} />}
          {!localUnitAnim && <img alt="" src='/images/player.png'/>}
        </Box>

        {showLocalUnit && <Box className={styles.unit1}>
          {pvpRoom.localPlayer.unitHp}
          <LinearProgress variant="determinate" value={pvpRoom.localPlayer.unitHp*100/getUnitHealth(pvpRoom.localPlayer.unit)} />
          {remoteUnitAnim && pvpRoom.localPlayer.unitHp && <img alt="" className={styles.explode_unit_1} src={"/images/gif_anim/explode_1.gif"+"?"+new Date().getTime()} />}
          
          {!localUnitAttackAnim && <>
            {pvpRoom.localPlayer.unitHp && <img alt="" src={`/images/unit/${pvpRoom.localPlayer.unit}.png`} />}
            {!pvpRoom.localPlayer.unitHp && <img alt="" src={`/images/gif_anim/${pvpRoom.localPlayer.unit}_destroy.gif`} onAnimationEnd={handleAnimationEnd}/>}
          </>}
          {localUnitAttackAnim && <img alt="" src={`/images/gif_anim/${pvpRoom.localPlayer.unit}_attack.gif`+"?"+new Date().getTime()} onAnimationEnd={handleUnitAttackEnd}/>}
          
        </Box>}

        {pvpRoom.localPlayer.unit === 'earth' && localUnitAttackAnim && <Box className={styles.unit1_explode}>
          <img alt="" src={`/images/gif_anim/${pvpRoom.localPlayer.unit}_explode.gif`+"?"+new Date().getTime()} onAnimationEnd={handleUnitAttackEnd}/>
        </Box>}

        {roomDetail.status === PVP_STATUS.WAITING && 
          <Box className={styles.player2} >
            <h2> Waiting <img alt="" src="/images/loading.svg" style={{width: "40px"}}/></h2>
            <img alt="" src='/images/player2.png' style={{opacity: 0.1}}/>
          </Box>
        }

        {(roomDetail.status === PVP_STATUS.PLAY || roomDetail.status === PVP_STATUS.END) && <>
          <Box className={styles.player2}>
            {!isLocalPlayerTurn && <Box sx={{display:"flex", justifyContent:"center"}}><h3>{waitingTime}</h3></Box>}
            {address != pvpRoom.roomid && <Box sx={{display:"flex", justifyContent:"center"}}><img alt="" style={{width: "40px"}} src='/images/pointer.png'/></Box>}
            {pvpRoom.remotePlayer.hp}
            <LinearProgress variant="determinate" value={pvpRoom.remotePlayer.hp/10} />
            {localUnitAnim && !pvpRoom.remotePlayer.unitHp && <img alt="" className={styles.explode_player_2} src={"/images/gif_anim/explode_1.gif"+"?"+new Date().getTime()} />}
            {remoteUnitAnim && <img alt="" style = {{transform: 'rotateY(180deg)'}} src={"/images/gif_anim/player_attack.gif"+"?"+new Date().getTime()} />}
            {!remoteUnitAnim && <img alt="" src='/images/player2.png'/>}
          </Box>

          {showRemoteUnit && <Box className={styles.unit2}>
            {pvpRoom.remotePlayer.unitHp}
            <LinearProgress variant="determinate" value={pvpRoom.remotePlayer.unitHp*100/getUnitHealth(pvpRoom.remotePlayer.unit)} />
            {localUnitAnim && pvpRoom.remotePlayer.unitHp && <img alt="" style = {{transform: 'rotateY(180deg)'}} className={styles.explode_unit_2} src={"/images/gif_anim/explode_1.gif"+"?"+new Date().getTime()} />}
            
            {!remoteUnitAttackAnim && <>
              {pvpRoom.remotePlayer.unitHp && <img alt="" style = {{transform: 'rotateY(180deg)'}} src={`/images/unit/${pvpRoom.remotePlayer.unit}.png`} />}
              {!pvpRoom.remotePlayer.unitHp && <img alt="" style = {{transform: 'rotateY(180deg)'}} src={`/images/gif_anim/${pvpRoom.remotePlayer.unit}_destroy.gif`} onAnimationEnd={handleAnimationEnd}/>}
            </>}
            {remoteUnitAttackAnim && <img alt="" style = {{transform: 'rotateY(180deg)'}} src={`/images/gif_anim/${pvpRoom.remotePlayer.unit}_attack.gif`+"?"+new Date().getTime()} onAnimationEnd={handleUnitAttackEnd}/>}
            
          </Box>}

          {pvpRoom.remotePlayer.unit === 'earth' && remoteUnitAttackAnim && <Box className={styles.unit2_explode}>
            <img alt="" style = {{transform: 'rotateY(180deg)'}} src={`/images/gif_anim/${pvpRoom.remotePlayer.unit}_explode.gif`+"?"+new Date().getTime()} onAnimationEnd={handleUnitAttackEnd}/>
          </Box>}
          </>
        }
        
      </Box>
    </>
  );
};

export default PvpBattle;
