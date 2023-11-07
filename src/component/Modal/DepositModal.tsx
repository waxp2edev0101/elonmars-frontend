import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

import { Grid, TextField, Tooltip } from '@mui/material';
import { deposit, sendToken } from "../../hook/hook";
import { useWeb3Context } from "../../hook/web3Context";
import { useDispatch } from "react-redux";
import { checkWithdrawableReqeust, depositRequest, withdrawRequest } from "../../store/user/actions";
import { onShowAlert } from "../../store/utiles/actions";
import { ADMIN_WALLET_ADDRESS, chainId } from "../../hook/constants";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface Props{
    open: boolean;
    setOpen: any;
    resource: any;
    egg: any;
    onExchange: any;
    onExchangeEgg: any;
}

const DepositModal = ({open, setOpen, resource, egg, onExchange, onExchangeEgg}:Props) => {

  const { connected, chainID, address, connect } = useWeb3Context();
  const dispatch = useDispatch<any>();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [spxAmount, setSPXAmount] = useState(0);
  const [gbaksAmount, setGbaksAmount] = useState(0);

  const onChangeAmount = (e:any) => {
    e.preventDefault();

    if(e.target.value < 0) return;
    

    setSPXAmount(e.target.value);
  };

  const onChangeEggAmount = (e:any) => {

    e.preventDefault();

    if(e.target.value < 0) return;

    setGbaksAmount(e.target.value);
  };

  const onDeposit = async () => {

    if(spxAmount < 320) {
      alert("minimal withdraw amount is 320SPX");
      return;
    }
    dispatch(onShowAlert("Pease wait while confirming", "info"));
    let transaction = await deposit(address, ADMIN_WALLET_ADDRESS[chainId], spxAmount);
    console.log('spx deposite transaction: ', transaction)
    dispatch(depositRequest(address, spxAmount, transaction.transactionHash, (res:any)=>{
      handleClose(); 
      console.log('callback')
      if(res.success) {
        dispatch(onShowAlert("Deposit successfully", "success"));
      } else {
        dispatch(onShowAlert("Deposit faild!", "warning"));
      }
    }));
  }

  const onWithdraw = async () => {

    if(gbaksAmount < 300) {
      alert("minimal withdraw amount is 300Gbaks");
      return;
    }

    const res = await checkWithdrawableReqeust(address, gbaksAmount)
    console.log(res)
    if (res.success && !res.withdrawable) {
      dispatch(onShowAlert(`you can withdraw only $${res?.maximumValue} per day`, "warning"));
      return
    }

    dispatch(onShowAlert("Pease wait while confirming", "info"));

    let transaction = await sendToken(address, ADMIN_WALLET_ADDRESS[chainId], 5);
    
    dispatch(withdrawRequest(address, gbaksAmount, transaction.transactionHash, (res:any)=>{
      console.log('callback')
      handleClose();
      if(res && res?.success) {
        dispatch(onShowAlert("Withdraw successfully", "success"));
      } else {
        dispatch(onShowAlert(res?.message, "warning"));
      }
    }));
  }

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
      xs:200,
      md:400,
    },
    // background: "url(/images/modal-back.png)",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    pt: 1,
    pb: 1
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2 id="parent-modal-title">Deposit and Withdraw</h2>
          <Grid container>
            <Grid item xs={12} sm={6} md={6} sx={{marginBottom:"10px"}}>
              <Box
                sx={{
                  display:"flex",
                  flexDirection:"column",
                  alignItems:"center",
                  gap: "20px",
                }}
              >
                <TextField 
                  sx={{mr:1, textAlign:"right", borderColor:"red"}} 
                  name="spx" 
                  label="SPX" 
                  value={spxAmount} 
                  type = "number" 
                  onChange={onChangeAmount}
                />
                <p>You will receive {Number(spxAmount)} Gbaks</p>
                <Button variant="contained" color='primary' onClick={e => onDeposit()} >Deposit</Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={6} sx={{marginBottom:"10px"}}>
              <Box
                sx={{
                  display:"flex",
                  flexDirection:"column",
                  alignItems:"center",
                  gap: "20px",
                }}
              >
                <TextField 
                  sx={{mr:1, textAlign:"right", borderColor:"red"}} 
                  name="gbaks" 
                  label="Gbaks" 
                  value={gbaksAmount} 
                  type = "number" 
                  onChange={onChangeEggAmount}
                />
                <p>You will receive {Math.floor(gbaksAmount / 10)} SPX</p>
                <Button variant="contained" color='primary' onClick={e => onWithdraw()} >Withdraw</Button>
              </Box>
              <p style={{color:"#879906", display:"flex", marginTop:"12px"}}><ErrorOutlineIcon/> withdraw fee is 5 BUSD</p>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default DepositModal;
