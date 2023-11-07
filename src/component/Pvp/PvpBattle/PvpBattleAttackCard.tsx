import React, { useState, useEffect } from "react";
import { Box, Grid, Button, Typography  } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { attack } from '../../../store/pvp/actions';
import { useWeb3Context } from "../../../hook/web3Context";
import styles from "./PvpBattle.module.scss";

interface Props {
  type: string,
}


const PvpBattleAttackCard = ({type}:Props) => {

  const dispatch = useDispatch<any>();
  const pvpModule = useSelector((state:any) => state.pvpModule); 
  const {pvpRoom, roomDetail} = pvpModule;
  const { connected, chainID, address, connect } = useWeb3Context();


  const onAttackClick = () => {
    console.log(pvpRoom.roomid, address, type);
    dispatch(attack(pvpRoom.roomid, address, type));
  }

  useEffect(()=>{

  }, []);

   return (
      <>
        <Box className={styles.pvpAttackCard} onClick = {onAttackClick}>
          <img alt="" src={`/images/spell/${type}.png`} />
        </Box>
      </>
  )};

export default PvpBattleAttackCard;
