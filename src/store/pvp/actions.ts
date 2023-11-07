import { 
  GET_ROOM_LIST,
  CREATE_ROOM_SUCCESS,
  ENTER_ROOM_SUCCESS,
  CLOSE_ROOM_SUCCESS,
  CHANGE_PVP_STATUS,
  SET_ABILITY_SUCCESS,
  SET_UNIT_SUCCESS,
  ENTER_ROOM,
  ATTACK_END,
  ATTACK_START,
  GET_BATTLE_DATA_SUCCESS,
  SET_MY_ADDRESS,
  SET_BATTLE_WINNER,
  CHANGE_TURN,
  UNIT_ATTACK_START,
  UNIT_ATTACK_END
} from "./action-types";
import api from '../../utils/callApi';

import { PLAYER_SOCKET, UNIT_SOCKET } from "../../utils/socket_api";
import { sendEvent } from "../../utils/socketHelper";
import { PVP_ATTACK_TURN } from "./constant";
import { getUnitDamage } from "../../utils/constants";

export function getRoomList(result: any) {
  return async (dispatch: any) => {

    dispatch({
      type: GET_ROOM_LIST,
      payload: {rooms: result}
    });
  }
}

export function createRoom(roomid:any, price:number, cb:any) {
  return async (dispatch: any) => {

    const msgData = {
      roomid: roomid,
      price: price
    };
    sendEvent(PLAYER_SOCKET.CREATE_ROOM, msgData);
  }
}

export function createRoomSuccess(roomid:any, price:Number) {
  return async (dispatch: any) => {
    dispatch({
      type: CREATE_ROOM_SUCCESS,
      payload: { room:{price: price, roomid: roomid} }
    });
  }
}

export function enterRoom(roomid: string, address:any, price:any, cb:any) {
  return async (dispatch: any) => {

    const msgData = {
      roomid: roomid,
      address: address
    };
    
    dispatch({
      type: ENTER_ROOM,
      payload: { price }
    });

    sendEvent(PLAYER_SOCKET.JOIN_ROOM, msgData);
  }
}

export function enterRoomSuccess(roomid:any, address:number, price:number = 5, turn: string) {

  if(turn === 'local') turn = PVP_ATTACK_TURN.LOCAL_PLAYER;
  else turn = PVP_ATTACK_TURN.REMOTE_PLAYER;

  return async (dispatch: any) => {

    dispatch({
      type: CHANGE_TURN,
      payload: { turn }
    });

    dispatch({
      type: ENTER_ROOM_SUCCESS,
      payload: { roomid, address, price }
    });
  }
}

export function closeRoom(address:any, index:number, item:number, cb:any) {
  return async (dispatch: any) => {

    dispatch({
      type: CLOSE_ROOM_SUCCESS,
      payload: { room:{price: "10", roomid: "1", status: "open"} }
    });
  }
}

export function changePvpStatus(newStatus: string) {
  return async (dispatch: any) => {

    dispatch({
      type: CHANGE_PVP_STATUS,
      payload: { status:newStatus }
    });
  }
}

export function setAbility(roomid: string, address: string, ability: any) {
  return async (dispatch: any) => {
    const msgData = {
      roomid: roomid,
      address: address,
      ability: ability
    };
    sendEvent(PLAYER_SOCKET.SELECT_ABILITY, msgData);
  }
}

export function setAbilitySuccess(roomid:string, address: string, ability: any) {
  return async (dispatch: any) => {
    dispatch({
      type: SET_ABILITY_SUCCESS,
      payload: { roomid, address, ability }
    });
  }
}

export function setUnit(roomid: string, address: string, unit: string) {
  return async (dispatch: any) => {
    const msgData = {
      roomid: roomid,
      address: address,
      unit: unit
    };
    sendEvent(PLAYER_SOCKET.SELECT_UNIT, msgData);
  }
}


export function setUnitSuccess(roomid:string, address: string, unit: any) {
  return async (dispatch: any) => {
    dispatch({
      type: SET_UNIT_SUCCESS,
      payload: { roomid, address, unit }
    });
  }
}

export function attack(roomid:string, address: string, type: any) {
  return async (dispatch: any) => {
    const msgData = {
      roomid: roomid,
      address: address,
      type: type
    };
    sendEvent(PLAYER_SOCKET.ATTACK, msgData);
  }
}

export function attackSuccess(roomid:string, address: string, type: any, damage: any, health: any) {
  return async (dispatch: any) => {

    dispatch({
      type: ATTACK_START,
      payload: { roomid, address, type, damage, health}
    });
  }
}

export function unitAttack(roomid:string, address: string, type: any) {
  
  return async (dispatch: any) => {

    const {damage} = getUnitDamage(type);

    console.log("Unit Attack Damage = ", damage);
    if(damage === 0) return;

    const msgData = {
      roomid: roomid,
      address: address,
      type: type
    };
    sendEvent(UNIT_SOCKET.ATTACK, msgData);
  }
}

export function unitAttackSuccess(roomid:string, address: string, type: any, damage: any, health: any) {
  return async (dispatch: any) => {

    dispatch({
      type: UNIT_ATTACK_START,
      payload: { roomid, address, type, damage, health}
    });
  }
}

export function attackEndSuccess() {
  return async (dispatch: any) => {
    dispatch({
      type: ATTACK_END,
      payload: {  }
    });
  }
}

export function unitAttackEndSuccess() {
  return async (dispatch: any) => {
    dispatch({
      type: UNIT_ATTACK_END,
      payload: {  }
    });
  }
}

export function getBattleData(roomid:string) {
  return async (dispatch: any) => {

    let res = await api('pvp/get_battle_data', "POST", {roomid});

    console.log("battle data api", res);
    dispatch({
      type: GET_BATTLE_DATA_SUCCESS,
      payload: { data: res }
    });
    
  }
}

export function setMyAddress(address: string) {
  return async (dispatch: any) => {

    dispatch({
      type: SET_MY_ADDRESS,
      payload: { address }
    });
    
  }
}

export function battleFinished(winner: string) {
  return async (dispatch: any) => {

    dispatch({
      type: SET_BATTLE_WINNER,
      payload: { winner }
    });
    
  }
}

export function changeTurn(turn: string) {
  
  if(turn === 'local') turn = PVP_ATTACK_TURN.LOCAL_PLAYER;
  else turn = PVP_ATTACK_TURN.REMOTE_PLAYER;

  return async (dispatch: any) => {

    dispatch({
      type: CHANGE_TURN,
      payload: { turn }
    });
    
  }
}