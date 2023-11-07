import React, { useState, useEffect } from "react";
import { Box, Grid, Button, Typography  } from '@mui/material';


import Modal from '@mui/material/Modal';
import styles from "./PvpRoom.module.scss";
import Header from "../../Header/Header";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useWeb3Context } from '../../../hook/web3Context';
import { claimBird, claimDiamond, stakeBird, stakeDiamond, swapEggs, swapResources } from '../../../store/user/actions';
import { useDispatch, useSelector } from 'react-redux';
import { LAND_COST, STAKE_TIMER } from "../../../hook/constants";
import { showMinutes } from "../../../utils/timer";
import GoldMineModal from "../../Modal/GoldMineModal";
import UraniumMineModal from "../../Modal/UraniumMineModal";
import PowerPlantModal from "../../Modal/PowerPlantModal";
import PvpRoomCard from "../PvpRoomCard/PvpRoomCard";
import { getRoomList } from "../../../store/pvp/actions";

import RoomCreateModal from "../Modal/RoomCreateModal";
import { getPvpRoomList } from "../../../hook/hook";
import { IS_TEST_MODE } from "../../../utils/constants";

const PvpRoom = () => {
    
  const dispatch = useDispatch<any>();
  const pvpModule = useSelector((state:any) => state.pvpModule); 
  const {roomDetail} = pvpModule;
  const rooms = roomDetail.rooms;

  const { connected, chainID, address, connect } = useWeb3Context();

  const [openCreateModal, setOpenCreateModal] = useState(false);



  const getRooms = async () => {

    let result = [];
    if(IS_TEST_MODE) {
      result = [{roomid:"0x144d8FD81a9D7C0102267DD7df76d89017374BaF", price:"5", status:0}];
    } else {
      result = await getPvpRoomList();
    }
    
    dispatch(getRoomList(result));
  }


  useEffect(()=>{

    getRooms();
    const intervalId = setInterval(() => {
      getRooms();
    }, 5000);

    // Return a cleanup function that clears the interval when the component unmounts or the interval changes.
    return () => clearInterval(intervalId);
  }, []);

  return (<>
    <Box className={styles.root}>
      <RoomCreateModal open={openCreateModal} setOpen={setOpenCreateModal}/>
      <Box sx={{mt: 2, mb: 3}}>
        <Button variant="contained" color='secondary' sx={{zIndex:1}} onClick={(e)=>{setOpenCreateModal(true)}}> Create Room </Button>
      </Box>
      <Grid container>
          {rooms.map((item:any, index:number)=>(
            <Grid item key = {index} xs={3} sm={3} md={3} lg={2} sx={{marginBottom:"10px", display:"flex", justifyContent:"center"}}>
              <PvpRoomCard price = {item.price} status = {item.status} id = {item.roomid}/>
            </Grid>
          ))}
        </Grid>
    </Box>
  </>)};

export default PvpRoom;