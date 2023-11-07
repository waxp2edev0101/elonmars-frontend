import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../component/Header/Header';
import { Box, Grid, Button, Typography  } from '@mui/material';
import Modal from '@mui/material/Modal';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useWeb3Context } from '../../hook/web3Context';
import styles from "./PvpPage.module.scss";
import ExchangeModal from '../../component/Header/ExchangeModal';
import { claimBird, claimDiamond, stakeBird, stakeDiamond, swapEggs, swapResources } from '../../store/user/actions';
import { useDispatch, useSelector } from 'react-redux';
import DepositModal from '../../component/Modal/DepositModal';
import { STAKE_TIMER } from '../../hook/constants';
import MiningModal from '../../component/Modal/MiningModal';
import { showMinutes } from '../../utils/timer';
import { width } from '@mui/system';
import InstructionModal from '../../component/Modal/InstructionModal';
import PvpRoom from '../../component/Pvp/PvpRoom/PvpRoom';
import { PVP_STATUS } from '../../store/pvp/constant';
import PvpUnit from '../../component/Pvp/PvpUnit/PvpUnit';
import PvpSpell from '../../component/Pvp/PvpSpell/PvpSpell';
import PvpBattle from '../../component/Pvp/PvpBattle/PvpBattle';

import socket from '../../utils/socket';
import { attackSuccess, battleFinished, createRoom, createRoomSuccess, enterRoom, enterRoomSuccess, setAbilitySuccess, setMyAddress, setUnitSuccess, unitAttackSuccess } from '../../store/pvp/actions';
import { PLAYER_SOCKET, UNIT_SOCKET } from '../../utils/socket_api';
import { handleGetPrivateKey } from '../../hook/hook';

interface PvpPageProps{
  showAccount: any,
  setShowAccount: any,
}

const PvpPage = ({showAccount, setShowAccount}:PvpPageProps) => {

  const dispatch = useDispatch<any>();
  const pvpModule = useSelector((state:any) => state.pvpModule); 
  const {roomDetail, pvpRoom} = pvpModule;

  const {address} = useWeb3Context();


  useEffect(()=>{
    socket.emit("connection", () => {
      console.log("socket connected!");
    });

    // ----------------------------------- Player socket events -----------------------------------
    socket.on(PLAYER_SOCKET.CREATE_ROOM, (data:any) =>{
      console.log("[Socket] [Create Room] success", data);
      dispatch(createRoomSuccess(data.roomid, data.price));
    })

    socket.on(PLAYER_SOCKET.JOIN_ROOM, (data:any) =>{
      console.log("[Socket] [Join Room] success", data);
      dispatch(enterRoomSuccess(data.roomid, data.address, data.price, data.turn));
    })

    socket.on(PLAYER_SOCKET.SELECT_UNIT, (data:any) =>{
      console.log("[Socket] [Select Unit] success", data);
      dispatch(setUnitSuccess(pvpRoom.roomid, data.address, data.unit));
    })

    socket.on(PLAYER_SOCKET.SELECT_ABILITY, (data:any) =>{
      console.log("[Socket] [Select Weapon] success", data);
      dispatch(setAbilitySuccess(pvpRoom.roomid, data.address, data.ability));
    })

    socket.on(PLAYER_SOCKET.ATTACK, (data:any) =>{
      console.log("[Socket] [Attack] success", data);
      dispatch(attackSuccess(pvpRoom.roomid, data.address, data.type, data.damage, data.health));
    })

    socket.on(PLAYER_SOCKET.FINISHED, (data:any) =>{
      console.log("[Socket] [End Pvp] success", data);
      dispatch(battleFinished(data.winner));
    })

    socket.on(UNIT_SOCKET.ATTACK, (data:any) =>{
      console.log("[Socket] [Unit Attack] success", data);
      dispatch(unitAttackSuccess(pvpRoom.roomid, data.address, data.type, data.damage, data.health));
    })


  }, []);

  useEffect(()=>{
    console.log("address =============>>>>>>>>>> ", address);
    if(address && address!= "") {
      dispatch(setMyAddress(address));
    }
  }, [address]);

  return (
    <>
      <Box sx={{position:"absolute", top: 0}}>
        <Header 
          showAccount={showAccount}
          setShowAccount={setShowAccount}
        />
      </Box>

      

      {roomDetail.status === PVP_STATUS.SELECT_ROOM && <PvpRoom/>}
      {roomDetail.status === PVP_STATUS.SELECT_UNIT && <PvpUnit/>}
      {roomDetail.status === PVP_STATUS.SELECT_SPELL && <PvpSpell/>}
      {roomDetail.status === PVP_STATUS.WAITING && <PvpBattle/>}
      {(roomDetail.status === PVP_STATUS.PLAY || roomDetail.status === PVP_STATUS.END) && <PvpBattle/>}
      {/* {roomDetail.status === PVP_STATUS.END && <PvpBattle/>} */}
      
    </>
  );
};
 
export default PvpPage;
